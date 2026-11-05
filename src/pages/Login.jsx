import { useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { lerConvitePendente } from '../lib/convitePendente.js'
import { useErrosDeCampo } from '../lib/useErrosDeCampo.js'
import { erroDeEmail, soErros } from '../lib/validacao.js'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import { IconeCadeado, IconeEntrar, IconeEnvelope } from '../components/Icones.jsx'

export default function Login() {
  // Quem veio de um convite volta para ele, e não para as boas-vindas
  const convite = lerConvitePendente()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { erros, refDe, mostrar, limpar, limparTodos } = useErrosDeCampo()

  async function entrar(e) {
    e.preventDefault() // impede o formulário de recarregar a página
    setErro('')
    const novos = soErros({
      email: erroDeEmail(email),
      senha: senha ? undefined : 'Digite sua senha.',
    })
    if (Object.keys(novos).length > 0) return mostrar(novos)
    limparTodos()
    setEnviando(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
    setEnviando(false)
    if (error) setErro(mensagemDeErro(error))
    // Se deu certo, não precisa fazer nada: o AuthContext percebe o login
    // e a RotaPublica leva para a Home sozinha.
  }

  return (
    <TelaAuth
      titulo="Entrar"
      voltar={convite ? { para: `/convite/${convite}`, rotulo: 'Voltar para o convite' } : { para: '/boas-vindas', rotulo: 'Voltar para o início' }}
      subtitulo="Listas de presentes do seu grupo, com a surpresa garantida."
      rodape={
        <>
          <p className="text-suave">
            Ainda não tem conta? <Link to="/cadastro" className="link">Criar conta</Link>
          </p>
          <Link to="/esqueci-senha" className="link">
            Esqueceu a senha?
          </Link>
        </>
      }
    >
                  {/* noValidate: o erro aparece junto do campo, e não no balão do navegador */}
      <form onSubmit={entrar} noValidate className="flex flex-col gap-4">
        <Campo rotulo="E-mail" icone={IconeEnvelope} type="email" autoComplete="email" required value={email}
          ref={refDe('email')} erro={erros.email} onChange={(e) => { setEmail(e.target.value); limpar('email') }} />
        <Campo rotulo="Senha" icone={IconeCadeado} type="password" autoComplete="current-password" required value={senha}
          ref={refDe('senha')} erro={erros.senha} onChange={(e) => { setSenha(e.target.value); limpar('senha') }} />
        <Aviso>{erro}</Aviso>
        <Botao type="submit" icone={IconeEntrar} larguraTotal disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </Botao>
      </form>
    </TelaAuth>
  )
}
