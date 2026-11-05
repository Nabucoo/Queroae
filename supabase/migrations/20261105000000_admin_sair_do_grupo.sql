-- =====================================================================
-- QueroAê - O admin pode sair do grupo
-- Rodar UMA vez no Supabase: SQL Editor > New query > colar > Run.
-- Pode rodar ANTES de publicar o site novo: só acrescenta uma função.
--
-- O grupo passa para o integrante mais antigo, a mesma regra de "apagar conta"
-- (Edge Function apagar-conta). Se só houver o admin, ele precisa excluir o grupo.
-- A política de RLS continua proibindo o admin de apagar a própria participação:
-- este é o único caminho, e ele nunca deixa um grupo sem admin.
--
-- Regra da surpresa: nada aqui lê ou devolve escolhas. O trigger ao_sair_do_grupo
-- libera os presentes que a pessoa escolheu, como em qualquer saída.
-- =====================================================================
create or replace function public.admin_sair_do_grupo(p_id_grupo bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_sucessor uuid;
begin
  if v_uid is null then
    raise exception 'Você precisa estar logado.';
  end if;

  -- Trava o grupo: evita duas trocas de admin ao mesmo tempo
  perform 1 from public.grupo g
  where g.id_grupo = p_id_grupo and g.id_admin = v_uid
  for update;

  if not found then
    raise exception 'Só o admin pode sair por aqui. Atualize a tela e tente de novo.';
  end if;

  select ug.id_usuario into v_sucessor
  from public.usuario_grupo ug
  where ug.id_grupo = p_id_grupo and ug.id_usuario <> v_uid
  order by ug.created_at, ug.id_usuario_grupo
  limit 1;

  if v_sucessor is null then
    raise exception 'Você é a única pessoa no grupo. Para sair, exclua o grupo.';
  end if;

  update public.grupo set id_admin = v_sucessor where id_grupo = p_id_grupo;

  delete from public.usuario_grupo
  where id_grupo = p_id_grupo and id_usuario = v_uid;
end;
$$;

revoke execute on function public.admin_sair_do_grupo(bigint) from public, anon;
grant execute on function public.admin_sair_do_grupo(bigint) to authenticated;
