// Edge Function "apagar-conta": roda nos servidores do Supabase (Deno), não no navegador.
// Só aqui usamos a chave service_role, que nunca vai para o front-end.
import { createClient } from 'npm:@supabase/supabase-js@2'

// CORS: permite que o navegador (outro endereço) chame esta função
const cabecalhosCors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function responder(status: number, corpo: Record<string, unknown>) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  // O navegador faz uma "pergunta prévia" (OPTIONS) antes do pedido de verdade
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabecalhosCors })
  if (req.method !== 'POST') return responder(405, { erro: 'Use POST.' })

  // Estas variáveis o Supabase já fornece para toda Edge Function
  const url = Deno.env.get('SUPABASE_URL')!
  const chaveAnon = Deno.env.get('SUPABASE_ANON_KEY')!
  const chaveServico = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // 1. Quem está pedindo? Usamos o login que veio no pedido.
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return responder(401, { erro: 'Você precisa estar logado.' })

  const clienteDoUsuario = createClient(url, chaveAnon, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user }, error: erroUsuario } = await clienteDoUsuario.auth.getUser()
  if (erroUsuario || !user) return responder(401, { erro: 'Sessão inválida. Entre novamente.' })

  // Cliente com poderes totais (ignora o RLS) — só existe aqui no servidor
  const admin = createClient(url, chaveServico, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // 2. Admin de algum grupo não pode ser apagado (regra do banco: on delete restrict)
  const { data: grupos, error: erroGrupos } = await admin
    .from('grupo').select('nome').eq('id_admin', user.id)
  if (erroGrupos) return responder(500, { erro: 'Erro ao verificar seus grupos.' })
  if (grupos.length > 0) {
    const nomes = grupos.map((g) => g.nome).join(', ')
    return responder(409, { erro: `Você é admin de: ${nomes}. Exclua esses grupos antes de apagar sua conta.` })
  }

  // 3. Apaga o login. O banco apaga em cascata: perfil, participações, listas e escolhas.
  const { error: erroApagar } = await admin.auth.admin.deleteUser(user.id)
  if (erroApagar) {
    console.error(erroApagar)
    return responder(500, { erro: 'Não foi possível apagar a conta agora. Tente novamente.' })
  }

  return responder(200, { ok: true })
})
