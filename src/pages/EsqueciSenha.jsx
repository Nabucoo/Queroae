import { useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { campoDoErro, mensagemDeErro } from '../lib/erros.js'
import { useErrosDeCampo } from '../lib/useErrosDeCampo.js'
import { erroDeEmail } from '../lib/validacao.js'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import { IconeEnvelope } from '../components/Icones.jsx'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const { erros, refDe, mostrar, limpar, limparTodos } = useErrosDeCampo()

  async function enviarLink(e) {
    e.preventDefault()
    setErro('')
    const erroEmail = erroDeEmail(email, 'Digite o e-mail da sua conta.')
    if (erroEmail) return mostrar({ email: erroEmail })
    limparTodos()
    setEnviando(true)
    // O link do e-mail traz a pessoa de volta para a tela /nova-senha
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nova-senha`,
    })
    setEnviando(false)
    if (error) {
      const campo = campoDoErro(error)
      return campo === 'email' ? mostrar({ email: mensagemDeErro(error) }) : setErro(mensagemDeErro(error))
    }
    setEnviado(true)
  }

  const voltar = <Link to="/login" className="link">Voltar para a tela de entrada</Link>

  if (enviado) {
    return (
      <TelaAuth
        titulo="Confira seu e-mail"
        voltar={{ para: '/login', rotulo: 'Voltar para a tela de entrada' }}
        subtitulo={`Se existir uma conta com ${email}, você vai receber um link para criar uma nova senha.`}
        rodape={voltar}
      />
    )
  }

  return (
    <TelaAuth
      titulo="Esqueceu a senha?"
      voltar={{ para: '/login', rotulo: 'Voltar para a tela de entrada' }}
      subtitulo="Digite seu e-mail e enviaremos um link para você criar uma nova."
      rodape={voltar}
    >
      <form onSubmit={enviarLink} noValidate className="flex flex-col gap-4">
        <Campo rotulo="E-mail" icone={IconeEnvelope} type="email" autoComplete="email" required value={email}
          ref={refDe('email')} erro={erros.email} onChange={(e) => { setEmail(e.target.value); limpar('email') }} />
        <Aviso>{erro}</Aviso>
        <Botao type="submit" icone={IconeEnvelope} larguraTotal disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar link'}
        </Botao>
      </form>
    </TelaAuth>
  )
}
