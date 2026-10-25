-- =====================================================================
-- QueroAê - Esconde as funções auxiliares da API (item B do DEPLOY.md)
-- Rodar UMA vez no Supabase: SQL Editor > New query > colar > Run.
--
-- As 7 funções abaixo são usadas só pelas regras de segurança (RLS).
-- No esquema "public" a API consegue chamá-las; no esquema "privado"
-- a API não enxerga. As regras de RLS continuam funcionando, porque
-- apontam para a função em si, não para o nome do esquema.
-- criar_grupo e entrar_no_grupo FICAM em public: o app precisa delas.
-- =====================================================================

-- 1. Cria a área privada (a API só enxerga o esquema "public")
create schema if not exists privado;

-- 2. Deixa quem está logado usar o que está lá dentro
--    (as regras de RLS rodam como o usuário logado e precisam disso)
grant usage on schema privado to authenticated;

-- 3. Muda as 7 funções de área (as permissões que elas já tinham vão junto)
alter function public.eh_membro(bigint)              set schema privado;
alter function public.eh_admin(bigint)               set schema privado;
alter function public.compartilha_grupo_com(uuid)    set schema privado;
alter function public.dono_do_usuario_grupo(bigint)  set schema privado;
alter function public.grupo_do_usuario_grupo(bigint) set schema privado;
alter function public.dono_do_presente(bigint)       set schema privado;
alter function public.grupo_do_presente(bigint)      set schema privado;
