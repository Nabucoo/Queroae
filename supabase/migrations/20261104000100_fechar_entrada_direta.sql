-- =====================================================================
-- QueroAê - Fecha a entrada direta nos grupos
-- Rodar UMA vez no Supabase, SOMENTE DEPOIS que o site novo estiver no ar
-- (o site antigo usa entrar_no_grupo e pararia de entrar nos grupos):
-- SQL Editor > New query > colar > Run.
--
-- A partir daqui, a única forma de entrar em um grupo é ser aprovado pelo
-- admin (pedir_entrada + aprovar_pedido). Criar um grupo continua igual.
--
-- Para desfazer, se for preciso:
--   grant execute on function public.entrar_no_grupo(text) to authenticated;
-- =====================================================================

-- 1. Ninguém mais chama a função pela API
revoke execute on function public.entrar_no_grupo(text) from public, anon, authenticated;

-- 2. Limpa pedidos de quem já entrou direto enquanto ela estava aberta
delete from public.pedido_entrada p
using public.usuario_grupo ug
where ug.id_grupo = p.id_grupo
  and ug.id_usuario = p.id_usuario;
