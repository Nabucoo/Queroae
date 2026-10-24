-- =====================================================================
-- QueroAê - Banco de dados (Supabase / Postgres)
-- Como usar: Supabase > SQL Editor > New query > cole tudo > Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. LIMPEZA (opcional)
-- Se você já criou tabelas pelo painel (ex.: "Usuario" com maiúscula),
-- tire o "--" das linhas abaixo para apagá-las antes de recriar.
-- ATENÇÃO: isso apaga os dados. Só faça em projeto de testes.
-- ---------------------------------------------------------------------
-- drop table if exists public.escolha_presente cascade;
-- drop table if exists public.presente cascade;
-- drop table if exists public.usuario_grupo cascade;
-- drop table if exists public.grupo cascade;
-- drop table if exists public.usuario cascade;
-- drop table if exists public."Escolha_Presente" cascade;
-- drop table if exists public."Presente" cascade;
-- drop table if exists public."Usuario_Grupo" cascade;
-- drop table if exists public."Grupo" cascade;
-- drop table if exists public."Usuario" cascade;


-- ---------------------------------------------------------------------
-- 1. TABELAS
-- ---------------------------------------------------------------------

-- Perfil do usuário. O id é o MESMO id do auth.users (login do Supabase).
create table public.usuario (
  id_usuario uuid primary key references auth.users (id) on delete cascade,
  nome       varchar not null,
  foto_url   text,
  created_at timestamptz not null default now()
);

-- Grupo de presentes. "restrict" no admin: não dá para apagar o usuário
-- que é admin de um grupo sem antes tratar o grupo (transferir ou excluir).
create table public.grupo (
  id_grupo       bigint generated always as identity primary key,
  codigo_convite text not null unique
                   default substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  nome           varchar not null,
  descricao      text,
  id_admin       uuid not null references public.usuario (id_usuario) on delete restrict,
  created_at     timestamptz not null default now()
);

-- Quem participa de qual grupo. O "unique" impede a mesma pessoa
-- de entrar duas vezes no mesmo grupo.
create table public.usuario_grupo (
  id_usuario_grupo bigint generated always as identity primary key,
  id_usuario       uuid   not null references public.usuario (id_usuario) on delete cascade,
  id_grupo         bigint not null references public.grupo (id_grupo) on delete cascade,
  created_at       timestamptz not null default now(),
  constraint usuario_grupo_unico unique (id_usuario, id_grupo)
);

-- Presente desejado. Pertence a uma participação (usuário + grupo).
create table public.presente (
  id_presente      bigint generated always as identity primary key,
  id_usuario_grupo bigint not null
                     references public.usuario_grupo (id_usuario_grupo) on delete cascade,
  nome             varchar not null,
  descricao        text,
  link             text,
  created_at       timestamptz not null default now()
);

-- Quem vai comprar cada presente. Fica em tabela separada para o dono
-- da lista NUNCA conseguir ler (isso protege a surpresa).
-- O "unique" em id_presente garante um único comprador por presente.
create table public.escolha_presente (
  id_escolha_presente bigint generated always as identity primary key,
  id_presente         bigint not null unique
                        references public.presente (id_presente) on delete cascade,
  id_presenteador     uuid   not null
                        references public.usuario (id_usuario) on delete cascade,
  created_at          timestamptz not null default now()
);

-- Índices: o Postgres não cria sozinho nas chaves estrangeiras,
-- e eles deixam as buscas rápidas.
create index on public.grupo (id_admin);
create index on public.usuario_grupo (id_grupo);
create index on public.presente (id_usuario_grupo);
create index on public.escolha_presente (id_presenteador);


-- ---------------------------------------------------------------------
-- 2. TRIGGER: cria o perfil automaticamente quando alguém se cadastra
-- O nome vem do cadastro no React:
--   supabase.auth.signUp({ email, password, options: { data: { nome } } })
-- ---------------------------------------------------------------------
create or replace function public.criar_usuario_ao_cadastrar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.usuario (id_usuario, nome)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'nome', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger ao_criar_usuario_auth
after insert on auth.users
for each row execute function public.criar_usuario_ao_cadastrar();

revoke execute on function public.criar_usuario_ao_cadastrar() from public, anon, authenticated;


-- ---------------------------------------------------------------------
-- 3. FUNÇÕES AUXILIARES (usadas pelas políticas)
-- "security definer" = roda com permissão do dono, ignorando o RLS.
-- Isso evita o loop infinito de uma política consultar a própria tabela.
-- ---------------------------------------------------------------------

-- Eu participo deste grupo?
create or replace function public.eh_membro(p_id_grupo bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.usuario_grupo ug
    where ug.id_grupo = p_id_grupo
      and ug.id_usuario = (select auth.uid())
  );
$$;

-- Eu sou o admin deste grupo?
create or replace function public.eh_admin(p_id_grupo bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.grupo g
    where g.id_grupo = p_id_grupo
      and g.id_admin = (select auth.uid())
  );
$$;

-- Eu e esta outra pessoa estamos em algum grupo em comum?
create or replace function public.compartilha_grupo_com(p_outro uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.usuario_grupo a
    join public.usuario_grupo b on b.id_grupo = a.id_grupo
    where a.id_usuario = (select auth.uid())
      and b.id_usuario = p_outro
  );
$$;

-- Quem é o usuário de uma participação?
create or replace function public.dono_do_usuario_grupo(p_id_usuario_grupo bigint)
returns uuid
language sql stable security definer set search_path = ''
as $$
  select ug.id_usuario from public.usuario_grupo ug
  where ug.id_usuario_grupo = p_id_usuario_grupo;
$$;

-- Qual é o grupo de uma participação?
create or replace function public.grupo_do_usuario_grupo(p_id_usuario_grupo bigint)
returns bigint
language sql stable security definer set search_path = ''
as $$
  select ug.id_grupo from public.usuario_grupo ug
  where ug.id_usuario_grupo = p_id_usuario_grupo;
$$;

-- Quem é o dono de um presente?
create or replace function public.dono_do_presente(p_id_presente bigint)
returns uuid
language sql stable security definer set search_path = ''
as $$
  select ug.id_usuario
  from public.presente p
  join public.usuario_grupo ug on ug.id_usuario_grupo = p.id_usuario_grupo
  where p.id_presente = p_id_presente;
$$;

-- Em qual grupo está um presente?
create or replace function public.grupo_do_presente(p_id_presente bigint)
returns bigint
language sql stable security definer set search_path = ''
as $$
  select ug.id_grupo
  from public.presente p
  join public.usuario_grupo ug on ug.id_usuario_grupo = p.id_usuario_grupo
  where p.id_presente = p_id_presente;
$$;


-- ---------------------------------------------------------------------
-- 4. FUNÇÕES CHAMADAS PELO APP (supabase.rpc)
-- ---------------------------------------------------------------------

-- Cria o grupo e já coloca quem criou como admin e integrante.
-- No React: const { data: idGrupo } = await supabase.rpc('criar_grupo', { p_nome, p_descricao })
create or replace function public.criar_grupo(p_nome varchar, p_descricao text default null)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_id_grupo bigint;
begin
  if v_uid is null then
    raise exception 'Você precisa estar logado.';
  end if;

  insert into public.grupo (nome, descricao, id_admin)
  values (p_nome, p_descricao, v_uid)
  returning id_grupo into v_id_grupo;

  insert into public.usuario_grupo (id_usuario, id_grupo)
  values (v_uid, v_id_grupo);

  return v_id_grupo;
end;
$$;

-- Entra em um grupo usando o código de convite.
-- No React: await supabase.rpc('entrar_no_grupo', { p_codigo })
create or replace function public.entrar_no_grupo(p_codigo text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_id_grupo bigint;
begin
  if v_uid is null then
    raise exception 'Você precisa estar logado.';
  end if;

  select g.id_grupo into v_id_grupo
  from public.grupo g
  where g.codigo_convite = lower(trim(p_codigo));

  if v_id_grupo is null then
    raise exception 'Código de convite inválido.';
  end if;

  insert into public.usuario_grupo (id_usuario, id_grupo)
  values (v_uid, v_id_grupo)
  on conflict (id_usuario, id_grupo) do nothing;

  return v_id_grupo;
end;
$$;

-- Só usuários logados podem chamar estas funções.
revoke execute on function public.eh_membro(bigint)                 from public, anon;
revoke execute on function public.eh_admin(bigint)                  from public, anon;
revoke execute on function public.compartilha_grupo_com(uuid)       from public, anon;
revoke execute on function public.dono_do_usuario_grupo(bigint)     from public, anon;
revoke execute on function public.grupo_do_usuario_grupo(bigint)    from public, anon;
revoke execute on function public.dono_do_presente(bigint)          from public, anon;
revoke execute on function public.grupo_do_presente(bigint)         from public, anon;
revoke execute on function public.criar_grupo(varchar, text)        from public, anon;
revoke execute on function public.entrar_no_grupo(text)             from public, anon;

grant execute on function public.eh_membro(bigint)                  to authenticated;
grant execute on function public.eh_admin(bigint)                   to authenticated;
grant execute on function public.compartilha_grupo_com(uuid)        to authenticated;
grant execute on function public.dono_do_usuario_grupo(bigint)      to authenticated;
grant execute on function public.grupo_do_usuario_grupo(bigint)     to authenticated;
grant execute on function public.dono_do_presente(bigint)           to authenticated;
grant execute on function public.grupo_do_presente(bigint)          to authenticated;
grant execute on function public.criar_grupo(varchar, text)         to authenticated;
grant execute on function public.entrar_no_grupo(text)              to authenticated;


-- ---------------------------------------------------------------------
-- 5. RLS (Row Level Security): liga a proteção em TODAS as tabelas.
-- Com RLS ligado e sem política, ninguém acessa nada. As políticas
-- abaixo liberam só o que deve ser permitido.
-- ---------------------------------------------------------------------
alter table public.usuario          enable row level security;
alter table public.grupo            enable row level security;
alter table public.usuario_grupo    enable row level security;
alter table public.presente         enable row level security;
alter table public.escolha_presente enable row level security;

-- USUARIO: vejo a mim mesmo e quem divide grupo comigo; só edito o meu.
-- (Sem política de insert/delete: o trigger cria, e apagar conta
--  será feito por uma Edge Function.)
create policy "usuario: ver a mim e colegas de grupo"
  on public.usuario for select to authenticated
  using (
    id_usuario = (select auth.uid())
    or public.compartilha_grupo_com(id_usuario)
  );

create policy "usuario: editar o proprio perfil"
  on public.usuario for update to authenticated
  using (id_usuario = (select auth.uid()))
  with check (id_usuario = (select auth.uid()));

-- GRUPO: só integrantes veem; só o admin edita e exclui.
-- (Sem política de insert: a criação é pela função criar_grupo.)
create policy "grupo: integrantes veem"
  on public.grupo for select to authenticated
  using (public.eh_membro(id_grupo));

create policy "grupo: admin edita"
  on public.grupo for update to authenticated
  using (id_admin = (select auth.uid()))
  with check (id_admin = (select auth.uid()));

create policy "grupo: admin exclui"
  on public.grupo for delete to authenticated
  using (id_admin = (select auth.uid()));

-- USUARIO_GRUPO: integrantes veem a lista de membros do grupo.
-- Posso sair do grupo (menos o admin). O admin pode remover outros.
-- (Sem política de insert: entrar é pela função entrar_no_grupo.)
create policy "usuario_grupo: integrantes veem membros"
  on public.usuario_grupo for select to authenticated
  using (public.eh_membro(id_grupo));

create policy "usuario_grupo: sair ou remover"
  on public.usuario_grupo for delete to authenticated
  using (
    (id_usuario = (select auth.uid()) and not public.eh_admin(id_grupo))
    or
    (public.eh_admin(id_grupo) and id_usuario <> (select auth.uid()))
  );

-- PRESENTE: integrantes do grupo veem; só o dono cria, edita e remove.
create policy "presente: integrantes veem"
  on public.presente for select to authenticated
  using (public.eh_membro(public.grupo_do_usuario_grupo(id_usuario_grupo)));

create policy "presente: dono cria"
  on public.presente for insert to authenticated
  with check (public.dono_do_usuario_grupo(id_usuario_grupo) = (select auth.uid()));

create policy "presente: dono edita"
  on public.presente for update to authenticated
  using (public.dono_do_usuario_grupo(id_usuario_grupo) = (select auth.uid()))
  with check (public.dono_do_usuario_grupo(id_usuario_grupo) = (select auth.uid()));

create policy "presente: dono remove"
  on public.presente for delete to authenticated
  using (public.dono_do_usuario_grupo(id_usuario_grupo) = (select auth.uid()));

-- ESCOLHA_PRESENTE (onde mora a surpresa)

-- Ver quem escolheu: integrantes do grupo, EXCETO o dono do presente.
create policy "escolha: integrantes veem, menos o dono"
  on public.escolha_presente for select to authenticated
  using (
    public.eh_membro(public.grupo_do_presente(id_presente))
    and public.dono_do_presente(id_presente) <> (select auth.uid())
  );

-- >>> POLÍTICA 1 e 2 (as duas regras que você pediu) <<<
-- Marcar "vou comprar": eu sou o presenteador,
--   (1) eu NÃO posso ser o dono do presente, e
--   (2) eu preciso ser integrante do grupo daquele presente.
create policy "escolha: marcar que vou comprar"
  on public.escolha_presente for insert to authenticated
  with check (
    id_presenteador = (select auth.uid())
    and public.dono_do_presente(id_presente) <> (select auth.uid())
    and public.eh_membro(public.grupo_do_presente(id_presente))
  );

-- Desmarcar: só quem marcou. (Sem política de update: não se edita escolha.)
create policy "escolha: desmarcar a propria"
  on public.escolha_presente for delete to authenticated
  using (id_presenteador = (select auth.uid()));


