import { createClient } from '@supabase/supabase-js'

// As chaves vêm do arquivo .env (que não vai para o Git).
// No Vite, só variáveis que começam com VITE_ chegam ao navegador.
const url = import.meta.env.VITE_SUPABASE_URL
const chaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !chaveAnon) {
  throw new Error('Faltam VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY no arquivo .env')
}

// Conexão única com o Supabase, usada pelo app inteiro.
export const supabase = createClient(url, chaveAnon)
