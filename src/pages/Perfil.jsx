import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { ehFalhaDeConexao, mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Avatar from '../components/Avatar.jsx'
import AvisoFlutuante, { useAvisoFlutuante } from '../components/AvisoFlutuante.jsx'
import Campo from '../components/Campo.jsx'
import Botao from '../components/Botao.jsx'
import Modal from '../components/Modal.jsx'
import ModalConfirmar from '../components/ModalConfirmar.jsx'
import Painel from '../components/Painel.jsx'
import SeletorAparencia from '../components/SeletorAparencia.jsx'
import SeletorTamanhoTexto from '../components/SeletorTamanhoTexto.jsx'
import { Aviso } from '../components/TelaAuth.jsx'
import { IconeAjuda, IconeConfirmar, IconeEscudo, IconeLapis, IconeLixeira, IconeSair, IconeVoltar } from '../components/Icones.jsx'

export default function Perfil() {
  const { usuario, perfil, recarregarPerfil, sair } = useAuth()
  const [editandoNome, setEditandoNome] = useState(false)
  const [aviso, mostrarAviso] = useAvisoFlutuante()

  function aoSalvarNome() {
    setEditandoNome(false)
    mostrarAviso('Nome atualizado')
    recarregarPerfil() // atualiza o nome no app inteiro (saudação da Home, etc.)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho
        voltar={
          <BotaoIcone as={Link} to="/" rotulo="Voltar para o início">
            <IconeVoltar className="h-5 w-5" />
          </BotaoIcone>
        }
        direita={
          <BotaoIcone as={Link} to="/ajuda" state={{ de: 'perfil' }} rotulo="Ajuda">
            <IconeAjuda className="h-5 w-5" />
          </BotaoIcone>
        }
      />

      <main className="flex flex-col gap-6">
        <div className="mt-6 flex items-center gap-4">
          <Avatar nome={perfil?.nome ?? ''} id={usuario.id} tamanho="g" />
          <div className="min-w-0 flex-1">
            <h1 className="text-titulo font-semibold break-words">{perfil?.nome ?? 'Perfil'}</h1>
            <p className="mt-1 truncate text-apoio text-suave">{usuario.email}</p>
          </div>
          {perfil && (
            <BotaoIcone rotulo="Editar nome" className="shrink-0" onClick={() => setEditandoNome(true)}>
              <IconeLapis className="h-5 w-5" />
            </BotaoIcone>
          )}
        </div>

        <Painel>
          <h2 className="text-corpo font-semibold">Aparência e acessibilidade</h2>
          <p className="mt-1 text-apoio text-suave">Muda na hora e fica salvo neste aparelho.</p>
          <SeletorAparencia />
          <SeletorTamanhoTexto />
        </Painel>

        <Painel titulo="Ajuda e informações">
          <div className="flex flex-col gap-2">
            <Botao as={Link} to="/ajuda" state={{ de: 'perfil' }} variante="secundario" icone={IconeAjuda} larguraTotal>
              Perguntas frequentes
            </Botao>
            <Botao as={Link} to="/privacidade" state={{ de: 'perfil' }} variante="secundario" icone={IconeEscudo} larguraTotal>
              Política de privacidade
            </Botao>
          </div>
        </Painel>

        <Painel titulo="Sair e apagar">
          <div className="flex flex-col gap-2">
            <Botao variante="perigo" icone={IconeSair} larguraTotal onClick={() => sair('/login')}>
              Sair da conta
            </Botao>
            {/* Conta apagada: a pessoa não tem mais conta, então vai para as boas-vindas */}
            <ApagarConta idUsuario={usuario.id} onApagada={() => sair('/boas-vindas')} />
          </div>
        </Painel>
      </main>

      {/* Só existe enquanto está aberta: o campo sempre começa com o nome salvo */}
      {editandoNome && (
        <ModalEditarNome
          nomeAtual={perfil.nome}
          idUsuario={usuario.id}
          onFechar={() => setEditandoNome(false)}
          onSalvo={aoSalvarNome}
        />
      )}
      <AvisoFlutuante aviso={aviso} />
    </div>
  )
}

function ModalEditarNome({ nomeAtual, idUsuario, onFechar, onSalvo }) {
  const [nome, setNome] = useState(nomeAtual)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    const { error } = await supabase.from('usuario').update({ nome: nome.trim() }).eq('id_usuario', idUsuario)
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))
    onSalvo()
  }

  const mudou = nome.trim() !== nomeAtual && nome.trim() !== ''

  return (
    <Modal aberto onFechar={onFechar} titulo="Editar nome">
      <p className="text-apoio text-suave">É assim que você aparece para os integrantes dos seus grupos.</p>
      <form onSubmit={salvar} className="mt-4 flex flex-col gap-4">
        <Campo rotulo="Nome" required maxLength={60} autoComplete="name" value={nome}
          onChange={(e) => setNome(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <div className="mt-2 flex flex-wrap justify-end gap-3">
          <Botao variante="secundario" onClick={onFechar}>Cancelar</Botao>
          <Botao type="submit" icone={IconeConfirmar} disabled={!mudou || enviando}>{enviando ? 'Salvando…' : 'Salvar'}</Botao>
        </div>
      </form>
    </Modal>
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
      if (ehFalhaDeConexao(error)) return mensagemDeErro(error)
      // Tenta ler a mensagem que a função mandou
      const corpo = await error.context?.json?.().catch(() => null)
      return corpo?.erro ?? 'Não foi possível apagar a conta agora. Tente novamente.'
    }
    await onApagada()
  }

  return (
    <>
      {/* A explicação e os grupos afetados aparecem na confirmação, na hora de decidir */}
      <Botao variante="perigo" icone={IconeLixeira} larguraTotal disabled={gruposAdmin === null} onClick={() => setConfirmando(true)}>
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
    </>
  )
}

// Mostra, para cada grupo em que sou admin, para quem ele passa (ou se será excluído)
function ResumoGruposAdmin({ grupos }) {
  return (
    <div className="mt-4 rounded-campo bg-painel px-4 py-3 text-corpo">
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
