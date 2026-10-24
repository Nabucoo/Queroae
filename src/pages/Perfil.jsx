import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Avatar from '../components/Avatar.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import ModalConfirmar from '../components/ModalConfirmar.jsx'
import { Aviso } from '../components/TelaAuth.jsx'
import { IconeConfirmar, IconeLixeira, IconeSair, IconeVoltar } from '../components/Icones.jsx'

export default function Perfil() {
  const { usuario, perfil, recarregarPerfil, sair } = useAuth()
  const navegar = useNavigate()

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho
        esquerda={
          <BotaoIcone as={Link} to="/" rotulo="Voltar para o início">
            <IconeVoltar className="h-5 w-5" />
          </BotaoIcone>
        }
        direita={<Botao variante="texto" icone={IconeSair} onClick={sair}>Sair</Botao>}
      />

      <main>
        <div className="mt-6 flex items-center gap-4">
          <Avatar nome={perfil?.nome ?? ''} id={usuario.id} tamanho="g" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold break-words">{perfil?.nome ?? 'Perfil'}</h1>
            <p className="mt-1 truncate text-sm text-suave">{usuario.email}</p>
          </div>
        </div>

        {/* key: o formulário é recriado só quando o perfil termina de carregar
            (não a cada nome salvo, senão a mensagem "Salvo" sumiria na hora) */}
        <EditarNome key={perfil?.id_usuario ?? 'carregando'} nomeAtual={perfil?.nome ?? ''} idUsuario={usuario.id} onSalvo={recarregarPerfil} />

        <ApagarConta idUsuario={usuario.id} onApagada={async () => { await sair(); navegar('/login', { replace: true }) }} />
      </main>
    </div>
  )
}

function EditarNome({ nomeAtual, idUsuario, onSalvo }) {
  const [nome, setNome] = useState(nomeAtual)
  const [erro, setErro] = useState('')
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setSalvo(false)
    setEnviando(true)
    const { error } = await supabase.from('usuario').update({ nome: nome.trim() }).eq('id_usuario', idUsuario)
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))
    setSalvo(true)
    onSalvo() // atualiza o nome no app inteiro (saudação da Home, etc.)
  }

  const mudou = nome.trim() !== nomeAtual && nome.trim() !== ''

  return (
    <section className="mt-10 rounded-cartao bg-painel p-5">
      <h2 className="text-sm font-semibold">Seu nome</h2>
      <p className="mt-1 text-sm text-suave">É assim que você aparece para os integrantes dos seus grupos.</p>
      <form onSubmit={salvar} className="mt-5 flex flex-col gap-4">
        <Campo rotulo="Nome" required maxLength={60} autoComplete="name" value={nome}
          onChange={(e) => { setNome(e.target.value); setSalvo(false) }} />
        <Aviso>{erro}</Aviso>
        <div className="flex items-center justify-end gap-3">
          {salvo && <span role="status" className="text-sm text-suave">Salvo</span>}
          <Botao type="submit" icone={IconeConfirmar} disabled={!mudou || enviando}>{enviando ? 'Salvando…' : 'Salvar'}</Botao>
        </div>
      </form>
    </section>
  )
}

function ApagarConta({ idUsuario, onApagada }) {
  const [gruposAdmin, setGruposAdmin] = useState(null) // null = carregando
  const [confirmando, setConfirmando] = useState(false)

  // Grupos em que sou admin, com os integrantes, para mostrar o que vai acontecer.
  // (Quem decide de verdade é a Edge Function; aqui é só a prévia.)
  useEffect(() => {
    supabase
      .from('grupo')
      .select('id_grupo, nome, usuario_grupo(id_usuario_grupo, id_usuario, created_at, usuario(nome))')
      .eq('id_admin', idUsuario)
      .then(({ data }) => setGruposAdmin((data ?? []).map((g) => ({ ...g, sucessor: integranteMaisAntigo(g, idUsuario) }))))
  }, [idUsuario])

  async function apagar() {
    // Chama a Edge Function; o login vai junto automaticamente
    const { error } = await supabase.functions.invoke('apagar-conta', { method: 'POST' })
    if (error) {
      // Tenta ler a mensagem que a função mandou
      const corpo = await error.context?.json?.().catch(() => null)
      return corpo?.erro ?? 'Não foi possível apagar a conta agora. Tente novamente.'
    }
    await onApagada()
  }

  return (
    <section className="mt-10 border-t border-borda pt-8">
      <h2 className="text-sm font-semibold text-negativo">Apagar conta</h2>
      <p className="mt-1 text-sm text-suave">
        Apaga seu login, seu perfil, suas listas de presentes e os presentes que você escolheu. Não dá para desfazer.
      </p>

      {gruposAdmin?.length > 0 && <ResumoGruposAdmin grupos={gruposAdmin} />}

      <Botao variante="perigo" icone={IconeLixeira} className="mt-4" disabled={gruposAdmin === null} onClick={() => setConfirmando(true)}>
        Apagar minha conta
      </Botao>

      <ModalConfirmar
        aberto={confirmando}
        onFechar={() => setConfirmando(false)}
        titulo="Apagar sua conta?"
        rotuloConfirmar="Apagar para sempre"
        iconeConfirmar={IconeLixeira}
        onConfirmar={apagar}
      >
        <p>Sua conta, suas listas e suas escolhas de presentes serão apagadas para sempre. Os presentes que você escolheu voltam a ficar livres.</p>
        {gruposAdmin?.length > 0 && <ResumoGruposAdmin grupos={gruposAdmin} />}
      </ModalConfirmar>
    </section>
  )
}

// Mostra, para cada grupo em que sou admin, para quem ele passa (ou se será excluído)
function ResumoGruposAdmin({ grupos }) {
  return (
    <div className="mt-4 rounded-campo bg-painel px-4 py-3 text-sm">
      <p>Você é admin destes grupos. Ao apagar sua conta:</p>
      <ul className="mt-2 flex flex-col gap-1">
        {grupos.map((g) => (
          <li key={g.id_grupo}>
            <Link to={`/grupo/${g.id_grupo}`} className="font-medium hover:underline">{g.nome}</Link>
            {g.sucessor ? (
              <span className="text-suave"> → passa para {g.sucessor.usuario.nome}</span>
            ) : (
              <span className="text-negativo"> → será excluído (você é o único integrante)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Mesma regra da Edge Function: quem entrou primeiro, sem contar eu
function integranteMaisAntigo(grupo, idUsuario) {
  const outros = grupo.usuario_grupo.filter((p) => p.id_usuario !== idUsuario)
  outros.sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id_usuario_grupo - b.id_usuario_grupo)
  return outros[0] ?? null
}
