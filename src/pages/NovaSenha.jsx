import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'

// A pessoa chega aqui pelo link do e-mail. O Supabase lê o link
// e cria uma sessão temporária, que permite trocar a senha.
export default function NovaSenha() {
  const { sessao, carregando } = useAuth()
  const navegar = useNavigate()
  const [senha, setSenha] = useState('')
  const [repetir, setRepetir] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    if (senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.')
    if (senha !== repetir) return setErro('As senhas não são iguais.')

    setEnviando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))
    navegar('/', { replace: true })
  }

  if (carregando) return <p className="p-6 text-sm text-suave">Carregando…</p>

  if (!sessao) {
    return (
      <TelaAuth
        titulo="Link inválido ou expirado"
        subtitulo="Peça um novo link para criar sua senha."
        rodape={<Link to="/esqueci-senha" className="font-medium text-destaque hover:underline">Pedir novo link</Link>}
      />
    )
  }

  return (
    <TelaAuth titulo="Nova senha" subtitulo="Escolha a senha que você vai usar daqui em diante.">
      <form onSubmit={salvar} className="flex flex-col gap-4">
        <Campo rotulo="Nova senha" type="password" autoComplete="new-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
        <Campo rotulo="Repita a nova senha" type="password" autoComplete="new-password" required value={repetir} onChange={(e) => setRepetir(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <Botao type="submit" larguraTotal disabled={enviando}>
          {enviando ? 'Salvando…' : 'Salvar nova senha'}
        </Botao>
      </form>
    </TelaAuth>
  )
}
