// Confere a conexão com o Supabase e se o banco tem o que o app espera.
// Só LÊ dados; não altera nada. Rode com: npm run testar-conexao
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const chaveAnon = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !chaveAnon) {
  console.log('❌ Não achei as chaves. Confira se o arquivo .env existe e está preenchido.')
  process.exit(1)
}

const supabase = createClient(url, chaveAnon)
let tudoCerto = true

// 1. Tabelas: sem login, o RLS devolve lista vazia (e sem erro) se a tabela existe.
const tabelas = ['usuario', 'grupo', 'usuario_grupo', 'presente', 'escolha_presente']
for (const tabela of tabelas) {
  const { error } = await supabase.from(tabela).select('*').limit(1)
  if (error) {
    tudoCerto = false
    console.log(`❌ Tabela ${tabela}: ${error.message}`)
  } else {
    console.log(`✅ Tabela ${tabela} encontrada`)
  }
}

// 2. Funções: sem login, o banco deve RECUSAR (permissão negada = a função existe e está protegida).
const funcoes = {
  criar_grupo: { p_nome: 'teste' },
  entrar_no_grupo: { p_codigo: 'teste' },
}
for (const [funcao, parametros] of Object.entries(funcoes)) {
  const { error } = await supabase.rpc(funcao, parametros)
  if (error?.code === '42501') {
    console.log(`✅ Função ${funcao} encontrada e protegida`)
  } else {
    tudoCerto = false
    console.log(`❌ Função ${funcao}: ${error ? error.message : 'aceitou chamada sem login!'}`)
  }
}

console.log(tudoCerto ? '\n🎉 Conexão e banco OK!' : '\n⚠️  Algo não bateu. Veja as mensagens acima.')
