-- =====================================================================
-- QueroAê - Convite por link, com aprovação do admin
-- Rodar no Supabase: SQL Editor > New query > colar > Run.
-- Pode rodar de novo sem problema (substitui a versão anterior deste arquivo).
--
-- Só ACRESCENTA: uma tabela nova e funções novas. Não altera os dados que
-- já existem e NÃO mexe em entrar_no_grupo, que o site oficial ainda usa.
-- A entrada direta só será fechada em outra migration, na hora de publicar.
--
-- Regra da surpresa: nada aqui lê presentes ou escolhas.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. A tabela de pedidos
-- ---------------------------------------------------------------------
-- Um pedido por pessoa em cada grupo. Aprovar apaga o pedido (a pessoa vira
-- integrante). Recusar mantém a linha, para ela ver o aviso na Home; dispensar
-- o aviso apaga a linha, e aí ela pode pedir de novo.
create table if not exists public.pedido_entrada (
  id_pedido  bigint generated always as identity primary key,
  id_grupo   bigint not null references public.grupo (id_grupo) on delete cascade,
  id_usuario uuid   not null references public.usuario (id_usuario) on delete cascade,
  situacao   text   not null default 'pendente' check (situacao in ('pendente', 'recusado')),
  created_at timestamptz not null default now(),
  unique (id_grupo, id_usuario)
);

-- Liga a proteção SEM criar política: pela API, ninguém lê nem escreve
-- nesta tabela diretamente. Tudo passa pelas funções abaixo.
alter table public.pedido_entrada enable row level security;
revoke all on table public.pedido_entrada from anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Ver o convite (janela "Entrar neste grupo?")
-- ---------------------------------------------------------------------
-- Devolve null se o código não existir.
-- Só os primeiros nomes de até 4 pessoas: o resto só depois de aprovado.
create or replace function public.ver_convite(p_codigo text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_id_grupo bigint;
  v_nome     varchar;
begin
  if v_uid is null then
    raise exception 'Você precisa estar logado.';
  end if;

  select g.id_grupo, g.nome into v_id_grupo, v_nome
  from public.grupo g
  where g.codigo_convite = lower(trim(p_codigo));

  if v_id_grupo is null then
    return null;
  end if;

  -- Quem já participa vai direto para o grupo: não precisa de mais nada
  if exists (
    select 1 from public.usuario_grupo ug
    where ug.id_grupo = v_id_grupo and ug.id_usuario = v_uid
  ) then
    return jsonb_build_object('id_grupo', v_id_grupo, 'ja_participa', true);
  end if;

  return jsonb_build_object(
    'id_grupo', v_id_grupo,
    'ja_participa', false,
    'nome', v_nome,
    'meu_pedido', (
      select p.situacao from public.pedido_entrada p
      where p.id_grupo = v_id_grupo and p.id_usuario = v_uid
    ),
    'total', (select count(*) from public.usuario_grupo ug where ug.id_grupo = v_id_grupo),
    'nomes', coalesce((
      select jsonb_agg(primeiros.nome)
      from (
        select split_part(trim(u.nome), ' ', 1) as nome
        from public.usuario_grupo ug
        join public.usuario u on u.id_usuario = ug.id_usuario
        where ug.id_grupo = v_id_grupo
        order by ug.created_at, ug.id_usuario_grupo
        limit 4
      ) primeiros
    ), '[]'::jsonb)
  );
end;
$$;

-- Para quem NÃO está logado: responde só "sim" ou "não", sem dizer nada
-- sobre o grupo. Permite avisar de um link inválido antes de a pessoa criar
-- uma conta à toa.
create or replace function public.convite_existe(p_codigo text)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.grupo g
    where g.codigo_convite = lower(trim(p_codigo))
  );
$$;

-- ---------------------------------------------------------------------
-- 3. O lado de quem pede
-- ---------------------------------------------------------------------
-- Cria o pedido. Devolve { id_grupo, situacao }, em que situacao pode ser:
--   'integrante': já participa, nada foi criado;
--   'pendente':   pedido criado agora ou já existente;
--   'recusado':   existe uma recusa que a pessoa ainda não dispensou.
create or replace function public.pedir_entrada(p_codigo text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_id_grupo bigint;
  v_situacao text;
begin
  if v_uid is null then
    raise exception 'Você precisa estar logado.';
  end if;

  select g.id_grupo into v_id_grupo
  from public.grupo g
  where g.codigo_convite = lower(trim(p_codigo));

  if v_id_grupo is null then
    raise exception 'Código de convite inválido. Confira o código ou peça um novo para quem convidou você.';
  end if;

  if exists (
    select 1 from public.usuario_grupo ug
    where ug.id_grupo = v_id_grupo and ug.id_usuario = v_uid
  ) then
    return jsonb_build_object('id_grupo', v_id_grupo, 'situacao', 'integrante');
  end if;

  insert into public.pedido_entrada (id_grupo, id_usuario)
  values (v_id_grupo, v_uid)
  on conflict (id_grupo, id_usuario) do nothing;

  select p.situacao into v_situacao
  from public.pedido_entrada p
  where p.id_grupo = v_id_grupo and p.id_usuario = v_uid;

  return jsonb_build_object('id_grupo', v_id_grupo, 'situacao', v_situacao);
end;
$$;

-- Meus pedidos, para os avisos na Home. O nome do grupo vem por aqui porque
-- quem não é integrante não consegue ler a tabela grupo.
create or replace function public.meus_pedidos()
returns table (id_pedido bigint, id_grupo bigint, nome_grupo text, situacao text, created_at timestamptz)
language sql
security definer
stable
set search_path = ''
as $$
  select p.id_pedido, p.id_grupo, g.nome::text, p.situacao, p.created_at
  from public.pedido_entrada p
  join public.grupo g on g.id_grupo = p.id_grupo
  where p.id_usuario = (select auth.uid())
  order by p.created_at desc;
$$;

-- Cancelar um pedido pendente ou dispensar o aviso de recusa: as duas ações
-- apagam o pedido, e só o de quem chamou.
create or replace function public.descartar_pedido(p_id_pedido bigint)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.pedido_entrada p
  where p.id_pedido = p_id_pedido
    and p.id_usuario = (select auth.uid());
$$;

-- ---------------------------------------------------------------------
-- 4. O lado do admin
-- ---------------------------------------------------------------------
-- Pedidos pendentes de um grupo, com nome e e-mail.
-- Quem não é o admin desse grupo recebe uma lista vazia.
create or replace function public.pedidos_do_grupo(p_id_grupo bigint)
returns table (id_pedido bigint, id_usuario uuid, nome text, email text, created_at timestamptz)
language sql
security definer
stable
set search_path = ''
as $$
  select p.id_pedido, p.id_usuario, u.nome::text, a.email::text, p.created_at
  from public.pedido_entrada p
  join public.grupo g on g.id_grupo = p.id_grupo
  join public.usuario u on u.id_usuario = p.id_usuario
  join auth.users a on a.id = p.id_usuario
  where p.id_grupo = p_id_grupo
    and p.situacao = 'pendente'
    and g.id_admin = (select auth.uid())
  order by p.created_at;
$$;

-- Quantos pedidos pendentes há em cada grupo em que sou admin (selo da Home).
create or replace function public.contagem_pedidos()
returns table (id_grupo bigint, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  select p.id_grupo, count(*)
  from public.pedido_entrada p
  join public.grupo g on g.id_grupo = p.id_grupo
  where p.situacao = 'pendente'
    and g.id_admin = (select auth.uid())
  group by p.id_grupo;
$$;

-- Aprovar: a pessoa vira integrante e o pedido some.
-- A mensagem é a mesma para "não existe" e "não é seu grupo": assim ninguém
-- descobre pedidos de outros grupos testando números.
create or replace function public.aprovar_pedido(p_id_pedido bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id_grupo   bigint;
  v_id_usuario uuid;
begin
  select p.id_grupo, p.id_usuario into v_id_grupo, v_id_usuario
  from public.pedido_entrada p
  join public.grupo g on g.id_grupo = p.id_grupo
  where p.id_pedido = p_id_pedido
    and p.situacao = 'pendente'
    and g.id_admin = (select auth.uid())
  for update of p; -- trava o pedido: evita aprovar junto com um cancelamento

  if v_id_grupo is null then
    raise exception 'Este pedido não está mais disponível. A pessoa pode ter cancelado.';
  end if;

  insert into public.usuario_grupo (id_usuario, id_grupo)
  values (v_id_usuario, v_id_grupo)
  on conflict (id_usuario, id_grupo) do nothing;

  delete from public.pedido_entrada p where p.id_pedido = p_id_pedido;
end;
$$;

-- Recusar: o pedido fica marcado, para a pessoa ver o aviso na Home.
create or replace function public.recusar_pedido(p_id_pedido bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.pedido_entrada p
  set situacao = 'recusado'
  from public.grupo g
  where g.id_grupo = p.id_grupo
    and p.id_pedido = p_id_pedido
    and p.situacao = 'pendente'
    and g.id_admin = (select auth.uid());

  if not found then
    raise exception 'Este pedido não está mais disponível. A pessoa pode ter cancelado.';
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- 5. Permissões: tira o acesso padrão e libera só o necessário
-- ---------------------------------------------------------------------
revoke execute on function public.ver_convite(text)        from public, anon;
revoke execute on function public.convite_existe(text)     from public;
revoke execute on function public.pedir_entrada(text)      from public, anon;
revoke execute on function public.meus_pedidos()           from public, anon;
revoke execute on function public.descartar_pedido(bigint) from public, anon;
revoke execute on function public.pedidos_do_grupo(bigint) from public, anon;
revoke execute on function public.contagem_pedidos()       from public, anon;
revoke execute on function public.aprovar_pedido(bigint)   from public, anon;
revoke execute on function public.recusar_pedido(bigint)   from public, anon;

grant execute on function public.ver_convite(text)        to authenticated;
grant execute on function public.convite_existe(text)     to anon, authenticated;
grant execute on function public.pedir_entrada(text)      to authenticated;
grant execute on function public.meus_pedidos()           to authenticated;
grant execute on function public.descartar_pedido(bigint) to authenticated;
grant execute on function public.pedidos_do_grupo(bigint) to authenticated;
grant execute on function public.contagem_pedidos()       to authenticated;
grant execute on function public.aprovar_pedido(bigint)   to authenticated;
grant execute on function public.recusar_pedido(bigint)   to authenticated;
