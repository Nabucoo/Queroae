import { useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import { IconeEnvelope } from '../components/Icones.jsx'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function enviarLink(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    // O link do e-mail traz a pessoa de volta para a tela /nova-senha
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`,
    })
    setEnviando(false)
    if (error) setErro(mensagemDeErro(error))
    else setEnviado(true)
  }

  const voltar = <Link to="/login" className="font-medium text-destaque hover:underline">Voltar para o login</Link>

  if (enviado) {
    return (
      <TelaAuth
        titulo="Confira seu e-mail"
        subtitulo={`Se existir uma conta com ${email}, você vai receber um link para criar uma nova senha.`}
        rodape={voltar}
      />
    )
  }

  return (
    <TelaAuth
      titulo="Esqueceu a senha?"
      subtitulo="Digite seu e-mail e enviaremos um link para você criar uma nova."
      rodape={voltar}
    >
      <form onSubmit={enviarLink} className="flex flex-col gap-4">
        <Campo rotulo="E-mail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <Botao type="submit" icone={IconeEnvelope} larguraTotal disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar link'}
        </Botao>
      </form>
    </TelaAuth>
  )
}
