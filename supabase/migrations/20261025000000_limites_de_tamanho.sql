-- =====================================================================
-- QueroAê - Limites de tamanho dos textos (item A do DEPLOY.md)
-- APLICADO PELO PAINEL em 2026-10-25:
--   Table Editor > tabela > coluna > Edit column > "CHECK constraint".
-- Este arquivo é só um REGISTRO do que existe no banco; não precisa rodar.
-- Os limites do banco ficam um pouco acima dos da tela (folga), para o
-- usuário normal sempre esbarrar antes no aviso amigável do app.
-- =====================================================================

-- usuario.nome        (tela: 60)
alter table public.usuario  add check (length(nome) <= 80);

-- grupo.nome / descricao   (tela: 60 / 500)
alter table public.grupo    add check (length(nome) <= 80);
alter table public.grupo    add check (length(descricao) <= 600);

-- presente.nome / descricao / link   (tela: 100 / 500 / 2000)
-- 2048 é o tamanho de link que todos os navegadores aceitam com segurança.
alter table public.presente add check (length(nome) <= 120);
alter table public.presente add check (length(descricao) <= 600);
alter table public.presente add check (length(link) <= 2048);
