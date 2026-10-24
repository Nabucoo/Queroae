import { useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import { IconePessoaMais } from '../components/Icones.jsx'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [confirmarEmail, setConfirmarEmail] = useState(false)

  async function cadastrar(e) {
    e.preventDefault()
    setErro('')
    if (senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.')

    setEnviando(true)
    // O nome vai junto; um trigger no banco cria a linha na tabela usuario.
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome: nome.trim() } },
    })
    setEnviando(false)

    if (error) return setErro(mensagemDeErro(error))
    // Com confirmação de e-mail ligada, um e-mail já usado volta "sem identidades"
    if (data.user?.identities?.length === 0) return setErro('Já existe uma conta com este e-mail.')
    // Sem sessão = o Supabase pediu confirmação por e-mail
    if (!data.session) setConfirmarEmail(true)
    // Com sessão, a RotaPublica leva para a Home sozinha.
  }

  if (confirmarEmail) {
    return (
      <TelaAuth
        titulo="Confira seu e-mail"
        subtitulo={`Enviamos um link de confirmação para ${email}. Clique nele e depois entre com sua senha.`}
        rodape={<Link to="/login" className="font-medium text-destaque hover:underline">Voltar para o login</Link>}
      />
    )
  }

  return (
    <TelaAuth
      titulo="Criar conta"
      rodape={
        <p className="text-suave">
          Já tem conta? <Link to="/login" className="font-medium text-destaque hover:underline">Entrar</Link>
        </p>
      }
    >
      <form onSubmit={cadastrar} className="flex flex-col gap-4">
        <Campo rotulo="Nome" autoComplete="name" required value={nome} onChange={(e) => setNome(e.target.value)} />
        <Campo rotulo="E-mail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Campo
          rotulo="Senha"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Pelo menos 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Aviso>{erro}</Aviso>
        <Botao type="submit" icone={IconePessoaMais} larguraTotal disabled={enviando}>
          {enviando ? 'Criando…' : 'Criar conta'}
        </Botao>
      </form>
    </TelaAuth>
  )
}
