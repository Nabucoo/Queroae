import { useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(e) {
    e.preventDefault() // impede o formulário de recarregar a página
    setErro('')
    setEnviando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setEnviando(false)
    if (error) setErro(mensagemDeErro(error))
    // Se deu certo, não precisa fazer nada: o AuthContext percebe o login
    // e a RotaPublica leva para a Home sozinha.
  }

  return (
    <TelaAuth
      titulo="Entrar"
      subtitulo="Listas de presentes do seu grupo, com a surpresa garantida."
      rodape={
        <>
          <p className="text-suave">
            Ainda não tem conta? <Link to="/cadastro" className="font-medium text-destaque hover:underline">Criar conta</Link>
          </p>
          <Link to="/esqueci-senha" className="font-medium text-destaque hover:underline">
            Esqueceu a senha?
          </Link>
        </>
      }
    >
      <form onSubmit={entrar} className="flex flex-col gap-4">
        <Campo rotulo="E-mail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Campo rotulo="Senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <Botao type="submit" larguraTotal disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </Botao>
      </form>
    </TelaAuth>
  )
}
