import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { campoDoErro, mensagemDeErro } from '../lib/erros.js'
import { lerConvitePendente } from '../lib/convitePendente.js'
import { guardarRascunhoCadastro, lerRascunhoCadastro, limparRascunhoCadastro } from '../lib/rascunhoCadastro.js'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import { IconeCadeado, IconeEnvelope, IconePessoa, IconePessoaMais } from '../components/Icones.jsx'

export default function Cadastro() {
  // Quem veio de um convite volta para ele, e não para as boas-vindas
  const convite = lerConvitePendente()
  const voltar = convite
    ? { para: `/convite/${convite}`, rotulo: 'Voltar para o convite' }
    : { para: '/boas-vindas', rotulo: 'Voltar para o início' }
  // Quem foi ler a política volta com o formulário como deixou
  const [nome, setNome] = useState(() => lerRascunhoCadastro()?.nome ?? '')
  const [email, setEmail] = useState(() => lerRascunhoCadastro()?.email ?? '')
  const [senha, setSenha] = useState(() => lerRascunhoCadastro()?.senha ?? '')
  const [confirmar, setConfirmar] = useState(() => lerRascunhoCadastro()?.confirmar ?? '')
  const [erros, setErros] = useState({}) // erro de cada campo: { email: '...', senha: '...' }
  const [erroGeral, setErroGeral] = useState('') // erro que não é de nenhum campo (ex.: sem internet)
  const [enviando, setEnviando] = useState(false)
  const [confirmarEmail, setConfirmarEmail] = useState(false)

  // Só vale para esta volta: se a pessoa sair e abrir o cadastro depois, começa vazio
  useEffect(() => limparRascunhoCadastro(), [])

  // Para levar o foco ao primeiro campo com erro (na ordem da tela)
  const refNome = useRef(null)
  const refEmail = useRef(null)
  const refSenha = useRef(null)
  const refConfirmar = useRef(null)

  function mostrarErros(novos) {
    setErros(novos)
    const ordem = [['nome', refNome], ['email', refEmail], ['senha', refSenha], ['confirmar', refConfirmar]]
    const primeiro = ordem.find(([campo]) => novos[campo])
    primeiro?.[1].current?.focus()
  }

  // Ao digitar num campo, o erro dele some (ele pode já ter sido corrigido)
  function mudar(campo, setValor) {
    return (e) => {
      setValor(e.target.value)
      if (erros[campo]) setErros({ ...erros, [campo]: undefined })
    }
  }

  async function cadastrar(e) {
    e.preventDefault()
    setErroGeral('')
    const novos = validar({ nome, email, senha, confirmar })
    if (Object.keys(novos).length > 0) return mostrarErros(novos)
    setErros({})

    setEnviando(true)
    // O nome vai junto; um trigger no banco cria a linha na tabela usuario.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: senha,
      options: {
        data: { nome: nome.trim() },
        // O link do e-mail pode abrir em outro navegador, que não lembra o convite;
        // por isso o endereço do convite vai dentro dele.
        ...(convite && { emailRedirectTo: `${window.location.origin}/convite/${convite}` }),
      },
    })
    setEnviando(false)

    if (error) {
      const campo = campoDoErro(error)
      return campo ? mostrarErros({ [campo]: mensagemDeErro(error) }) : setErroGeral(mensagemDeErro(error))
    }
    // Com confirmação de e-mail ligada, um e-mail já usado volta "sem identidades"
    if (data.user?.identities?.length === 0) return mostrarErros({ email: mensagemDeErro({ code: 'email_exists' }) })
    // Sem sessão = o Supabase pediu confirmação por e-mail
    if (!data.session) setConfirmarEmail(true)
    // Com sessão, a RotaPublica leva para a Home sozinha.
  }

  if (confirmarEmail) {
    return (
      <TelaAuth
        titulo="Confira seu e-mail"
        voltar={voltar}
        subtitulo={convite
          ? `Enviamos um link de confirmação para ${email}. Clique nele para continuar seu convite. Se o app pedir, entre com sua senha.`
          : `Enviamos um link de confirmação para ${email}. Clique nele e depois entre com sua senha.`}
        rodape={<Link to="/login" className="font-medium text-destaque hover:underline">Voltar para a tela de entrada</Link>}
      />
    )
  }

  return (
    <TelaAuth
      titulo="Criar conta"
      voltar={voltar}
      rodape={
        <>
          <p className="text-suave">
            Já tem conta? <Link to="/login" className="font-medium text-destaque hover:underline">Entrar</Link>
          </p>
          <Link to="/privacidade" state={{ de: 'cadastro' }} onClick={() => guardarRascunhoCadastro({ nome, email, senha, confirmar })} className="text-nota font-medium text-destaque hover:underline">Política de privacidade</Link>
        </>
      }
    >
      {/* noValidate: desliga o balão de erro do navegador (cada um tem o seu, fora do
          estilo do app). A checagem é feita em validar() e o erro aparece no campo. */}
      <form onSubmit={cadastrar} noValidate className="flex flex-col gap-4">
        <Campo rotulo="Nome" icone={IconePessoa} autoComplete="name" required maxLength={60} value={nome}
          ref={refNome} erro={erros.nome} onChange={mudar('nome', setNome)} />
        <Campo rotulo="E-mail" icone={IconeEnvelope} type="email" autoComplete="email" required value={email}
          ref={refEmail} erro={erros.email} onChange={mudar('email', setEmail)} />
        <Campo
          rotulo="Senha"
          icone={IconeCadeado}
          type="password"
          autoComplete="new-password"
          required
          placeholder="Pelo menos 8 caracteres"
          value={senha}
          ref={refSenha}
          erro={erros.senha}
          onChange={mudar('senha', setSenha)}
        />
        <Campo
          rotulo="Confirmar senha"
          icone={IconeCadeado}
          type="password"
          autoComplete="new-password"
          required
          value={confirmar}
          ref={refConfirmar}
          erro={erros.confirmar}
          onChange={mudar('confirmar', setConfirmar)}
        />
        {/* Só erros que não são de nenhum campo (ex.: sem internet) */}
        <Aviso>{erroGeral}</Aviso>
        <Botao type="submit" icone={IconePessoaMais} larguraTotal disabled={enviando}>
          {enviando ? 'Criando…' : 'Criar conta'}
        </Botao>
      </form>
    </TelaAuth>
  )
}

// Confere o formulário antes de enviar. Devolve o erro de cada campo
// (vazio = tudo certo). Mensagens no formato: o que aconteceu + o que fazer.
const formatoDeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ nome, email, senha, confirmar }) {
  const erros = {}
  if (!nome.trim()) erros.nome = 'Digite seu nome. É assim que você aparece para sua família.'

  if (!email.trim()) erros.email = 'Digite seu e-mail. Você vai usá-lo para entrar no app.'
  else if (!formatoDeEmail.test(email.trim())) erros.email = mensagemDeErro({ code: 'validation_failed' })

  if (!senha) erros.senha = 'Crie uma senha com pelo menos 8 caracteres.'
  else if (senha.length < 8) erros.senha = 'A senha está curta. Use pelo menos 8 caracteres.'

  // Pega erro de digitação antes de criar a conta (a senha aparece como bolinhas)
  if (!confirmar) erros.confirmar = 'Repita a senha para confirmar.'
  else if (senha !== confirmar) erros.confirmar = 'As senhas não são iguais. Toque no olho para conferir o que digitou.'

  return erros
}
