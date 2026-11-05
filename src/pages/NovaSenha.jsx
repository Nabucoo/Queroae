import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { campoDoErro, mensagemDeErro } from '../lib/erros.js'
import { useErrosDeCampo } from '../lib/useErrosDeCampo.js'
import { erroDeRepeticao, erroDeSenhaNova, soErros } from '../lib/validacao.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import TelaAuth, { Aviso } from '../components/TelaAuth.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import { TelaAbrindo } from '../components/Esqueleto.jsx'
import { IconeCadeado, IconeConfirmar } from '../components/Icones.jsx'

// A pessoa chega aqui pelo link do e-mail. O Supabase lê o link
// e cria uma sessão temporária, que permite trocar a senha.
export default function NovaSenha() {
  const { sessao, carregando } = useAuth()
  const navegar = useNavigate()
  const [senha, setSenha] = useState('')
  const [repetir, setRepetir] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { erros, refDe, mostrar, limpar, limparTodos } = useErrosDeCampo()

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const novos = soErros({ senha: erroDeSenhaNova(senha), repetir: erroDeRepeticao(senha, repetir) })
    if (Object.keys(novos).length > 0) return mostrar(novos)
    limparTodos()

    setEnviando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setEnviando(false)
    if (error) {
      return campoDoErro(error) === 'senha' ? mostrar({ senha: mensagemDeErro(error) }) : setErro(mensagemDeErro(error))
    }
    navegar('/', { replace: true })
  }

  if (carregando) return <TelaAbrindo />

  if (!sessao) {
    return (
      <TelaAuth
        titulo="Este link não funciona mais"
        voltar={{ para: '/login', rotulo: 'Voltar para a tela de entrada' }}
        subtitulo="Peça um novo link para criar sua senha."
        rodape={<Link to="/esqueci-senha" className="link">Pedir novo link</Link>}
      />
    )
  }

  return (
    <TelaAuth titulo="Nova senha" subtitulo="Escolha a senha que você vai usar daqui em diante.">
      <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
        <Campo rotulo="Nova senha" icone={IconeCadeado} type="password" autoComplete="new-password" required value={senha}
          ref={refDe('senha')} erro={erros.senha} onChange={(e) => { setSenha(e.target.value); limpar('senha') }} />
        <Campo rotulo="Repita a nova senha" icone={IconeCadeado} type="password" autoComplete="new-password" required value={repetir}
          ref={refDe('repetir')} erro={erros.repetir} onChange={(e) => { setRepetir(e.target.value); limpar('repetir') }} />
        <Aviso>{erro}</Aviso>
        <Botao type="submit" icone={IconeConfirmar} larguraTotal disabled={enviando}>
          {enviando ? 'Salvando…' : 'Salvar nova senha'}
        </Botao>
      </form>
    </TelaAuth>
  )
}
