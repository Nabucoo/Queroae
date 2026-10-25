-- =====================================================================
-- QueroAê - Remoção da coluna de foto
-- APLICADO PELO PAINEL em 2026-10-25 (o projeto usa iniciais, não foto).
-- Este arquivo é só um REGISTRO; não precisa rodar.
-- =====================================================================
alter table public.usuario drop column if exists foto_url;
