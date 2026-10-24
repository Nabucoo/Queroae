// Edge Function "apagar-conta": roda nos servidores do Supabase (Deno), não no navegador.
// Só aqui usamos a chave service_role, que nunca vai para o front-end.
// Se a pessoa for admin, a administração passa para o integrante mais antigo
// do grupo; se ela for a única integrante, o grupo é excluído.
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

  // 2. Grupos em que a pessoa é admin. O banco não deixa apagar um admin
  //    (on delete restrict), então antes resolvemos cada grupo:
  //    - tem outros integrantes → a administração passa para o mais antigo;
  //    - é o único integrante  → o grupo é excluído.
  const { data: grupos, error: erroGrupos } = await admin
    .from('grupo').select('id_grupo').eq('id_admin', user.id)
  if (erroGrupos) return responder(500, { erro: 'Erro ao verificar seus grupos.' })

  for (const grupo of grupos) {
    // O integrante mais antigo (quem entrou primeiro), sem contar quem está saindo
    const { data: sucessor, error: erroSucessor } = await admin
      .from('usuario_grupo')
      .select('id_usuario')
      .eq('id_grupo', grupo.id_grupo)
      .neq('id_usuario', user.id)
      .order('created_at', { ascending: true })
      .order('id_usuario_grupo', { ascending: true }) // desempate
      .limit(1)
      .maybeSingle()
    if (erroSucessor) return responder(500, { erro: 'Erro ao transferir seus grupos.' })

    const { error: erroGrupo } = sucessor
      ? await admin.from('grupo').update({ id_admin: sucessor.id_usuario }).eq('id_grupo', grupo.id_grupo)
      : await admin.from('grupo').delete().eq('id_grupo', grupo.id_grupo)
    if (erroGrupo) return responder(500, { erro: 'Erro ao transferir seus grupos.' })
  }

  // 3. Agora que não é admin de nada, apaga o login. O banco apaga em cascata: perfil, participações, listas e escolhas.
  const { error: erroApagar } = await admin.auth.admin.deleteUser(user.id)
  if (erroApagar) {
    console.error(erroApagar)
    return responder(500, { erro: 'Não foi possível apagar a conta agora. Tente novamente.' })
  }

  return responder(200, { ok: true })
})
