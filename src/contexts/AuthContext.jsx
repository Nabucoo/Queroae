import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// O "contexto" guarda quem está logado e deixa essa informação
// disponível para qualquer tela, sem passar de componente em componente.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(null) // login do Supabase (ou null)
  const [perfil, setPerfil] = useState(null) // linha da tabela usuario (nome...)
  const [carregando, setCarregando] = useState(true)
  // Para onde mandar quem não está logado: boas-vindas por padrão;
  // depois de "Sair", vai para o login (a pessoa claramente já tem conta).
  const [destinoSemLogin, setDestinoSemLogin] = useState('/boas-vindas')

  // 1. Descobre se já existe login salvo e fica "ouvindo" entradas e saídas
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
      setCarregando(false)
    })

    const { data: ouvinte } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao)
    })
    return () => ouvinte.subscription.unsubscribe() // para de ouvir ao sair
  }, [])

  // 2. Sempre que o usuário logado mudar, busca o perfil dele.
  // useCallback guarda a função para ela não ser recriada a cada desenho da tela.
  const idUsuario = sessao?.user?.id
  const recarregarPerfil = useCallback(async () => {
    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nome')
      .eq('id_usuario', idUsuario)
      .single()
    if (error) console.error('Erro ao buscar perfil:', error)
    setPerfil(data ?? null)
  }, [idUsuario])

  useEffect(() => {
    if (idUsuario) recarregarPerfil()
  }, [idUsuario, recarregarPerfil])

  // destino: para onde ir depois de sair ('/login' ou '/boas-vindas')
  async function sair(destino = '/login') {
    setDestinoSemLogin(destino)
    await supabase.auth.signOut()
  }

  // Só entrega o perfil se ele for de quem está logado agora
  // (evita mostrar por um instante o nome de quem saiu).
  const perfilAtual = perfil?.id_usuario === idUsuario ? perfil : null

  const valor = { sessao, usuario: sessao?.user ?? null, perfil: perfilAtual, carregando, destinoSemLogin, sair, recarregarPerfil }
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

// Hook para as telas usarem: const { usuario, perfil, sair } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
