-- =====================================================================
-- QueroAê - Libera os presentes escolhidos por quem sai de um grupo
-- Rodar UMA vez no Supabase: SQL Editor > New query > colar > Run.
--
-- Sempre que uma pessoa deixa um grupo (saiu, foi removida pelo admin,
-- apagou a conta ou o grupo foi excluído), apaga as escolhas que ELA
-- tinha feito em presentes DAQUELE grupo. Assim nenhum presente fica
-- riscado com o nome de alguém que não está mais no grupo.
-- Roda dentro do banco: ninguém vê o que estava escolhido (surpresa ok).
-- =====================================================================

-- 1. A função que faz a limpeza (fica na área privada, fora da API)
create or replace function privado.liberar_escolhas_ao_sair()
returns trigger
language plpgsql
security definer          -- roda com permissão total, só para esta limpeza
set search_path = ''
as $$
begin
  delete from public.escolha_presente e
  using public.presente p, public.usuario_grupo ug
  where e.id_presente = p.id_presente
    and p.id_usuario_grupo = ug.id_usuario_grupo
    and ug.id_grupo = old.id_grupo          -- presentes do grupo que a pessoa deixou
    and e.id_presenteador = old.id_usuario; -- escolhidos por ela
  return old;
end;
$$;

-- 2. Ninguém chama essa função "na mão": só o trigger
revoke execute on function privado.liberar_escolhas_ao_sair() from public, anon, authenticated;

-- 3. O trigger: depois de cada saída de um grupo, roda a limpeza
create trigger ao_sair_do_grupo
after delete on public.usuario_grupo
for each row execute function privado.liberar_escolhas_ao_sair();
