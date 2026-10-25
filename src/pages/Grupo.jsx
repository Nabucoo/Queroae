import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Abas from '../components/Abas.jsx'
import CartaoIntegrante from '../components/CartaoIntegrante.jsx'
import Botao from '../components/Botao.jsx'
import MinhaLista from '../components/MinhaLista.jsx'
import ModalEditarGrupo from '../components/ModalEditarGrupo.jsx'
import ModalConfirmar from '../components/ModalConfirmar.jsx'
import ModalIntegrantes from '../components/ModalIntegrantes.jsx'
import { IconeConfig, IconeConfirmar, IconeCopiar, IconeLixeira, IconePessoaMenos, IconeSair, IconeVoltar } from '../components/Icones.jsx'

export default function Grupo() {
  const { idGrupo } = useParams() // o número que está no endereço /grupo/:idGrupo
  const { usuario } = useAuth()
  const [grupo, setGrupo] = useState(null)
  const [integrantes, setIntegrantes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('integrantes')
  const [modal, setModal] = useState(null) // 'editar' | 'integrantes' | 'remover' | 'excluir' | 'sair' | null
  const [removendo, setRemovendo] = useState(null) // integrante que o admin quer remover
  const navegar = useNavigate()

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const [resGrupo, resIntegrantes] = await Promise.all([
        // maybeSingle: devolve null (sem erro) se o grupo não existir ou não for seu
        supabase.from('grupo').select('id_grupo, nome, descricao, codigo_convite, id_admin')
          .eq('id_grupo', idGrupo).maybeSingle(),
        // presente(count): quantos presentes cada um tem (para o card fechado)
        supabase.from('usuario_grupo').select('id_usuario_grupo, id_usuario, usuario(nome), presente(count)')
          .eq('id_grupo', idGrupo).order('created_at'),
      ])
      const falha = resGrupo.error || resIntegrantes.error
      if (falha) setErro(mensagemDeErro(falha))
      else {
        setGrupo(resGrupo.data)
        setIntegrantes(resIntegrantes.data)
      }
      setCarregando(false)
    }
    buscar()
  }, [idGrupo])

  // Admin: apaga o grupo (o banco apaga junto integrantes, listas e escolhas)
  async function excluirGrupo() {
    const { data, error } = await supabase.from('grupo').delete().eq('id_grupo', idGrupo).select('id_grupo')
    if (error) return mensagemDeErro(error)
    if (data.length === 0) return 'Não foi possível excluir. Só o admin pode excluir o grupo.'
    navegar('/', { replace: true })
  }

  // Integrante sai do grupo. Sua lista é apagada junto, e um trigger no banco
  // libera os presentes que ele tinha escolhido aqui (vale também para remoção).
  async function sairDoGrupo() {
    const { data, error } = await supabase
      .from('usuario_grupo').delete()
      .eq('id_grupo', idGrupo).eq('id_usuario', usuario.id)
      .select('id_usuario')
    if (error) return mensagemDeErro(error)
    if (data.length === 0) return 'Não foi possível sair do grupo.'
    navegar('/', { replace: true })
  }

  // Admin remove outra pessoa. O banco só permite se você for o admin
  // e não for você mesmo; o trigger libera os presentes que ela escolheu.
  async function removerIntegrante() {
    const { data, error } = await supabase
      .from('usuario_grupo').delete()
      .eq('id_usuario_grupo', removendo.id_usuario_grupo)
      .select('id_usuario')
    if (error) return mensagemDeErro(error)
    if (data.length === 0) return 'Não foi possível remover. Só o admin pode remover integrantes.'
    setIntegrantes((atual) => atual.filter((p) => p.id_usuario_grupo !== removendo.id_usuario_grupo))
    setRemovendo(null)
    setModal('integrantes') // volta para a lista, caso queira remover mais alguém
  }

  const voltar = (
    <BotaoIcone as={Link} to="/" rotulo="Voltar para o início">
      <IconeVoltar className="h-5 w-5" />
    </BotaoIcone>
  )

  if (carregando) return <Moldura voltar={voltar}><p className="mt-8 text-sm text-suave">Carregando…</p></Moldura>

  if (erro || !grupo) {
    return (
      <Moldura voltar={voltar}>
        <h1 className="mt-8 text-2xl font-semibold">Grupo não encontrado</h1>
        <p className="mt-2 text-sm text-suave">{erro || 'Este grupo não existe ou você não participa dele.'}</p>
      </Moldura>
    )
  }

  const souAdmin = grupo.id_admin === usuario.id
  // Minha "participação" neste grupo: é a ela que meus presentes ficam ligados
  const minhaParticipacao = integrantes.find((p) => p.id_usuario === usuario.id)
  // Na aba Integrantes aparecem só os outros (sua lista fica na aba "Minha lista")
  const outros = integrantes.filter((p) => p.id_usuario !== usuario.id)
  const acaoTopo = souAdmin ? (
    <BotaoIcone rotulo="Editar grupo" onClick={() => setModal('editar')}>
      <IconeConfig className="h-5 w-5" />
    </BotaoIcone>
  ) : (
    <Botao variante="texto" icone={IconeSair} onClick={() => setModal('sair')}>Sair do grupo</Botao>
  )

  return (
    <Moldura voltar={voltar} direita={acaoTopo}>
      {souAdmin && (
        <ModalEditarGrupo
          aberto={modal === 'editar'}
          onFechar={() => setModal(null)}
          grupo={grupo}
          onSalvo={(atualizado) => { setGrupo(atualizado); setModal(null) }}
          onGerenciarIntegrantes={() => setModal('integrantes')}
          onPedirExclusao={() => setModal('excluir')}
        />
      )}
      {souAdmin && (
        <ModalIntegrantes
          aberto={modal === 'integrantes'}
          onFechar={() => setModal(null)}
          onVoltar={() => setModal('editar')}
          integrantes={outros}
          onPedirRemocao={(p) => { setRemovendo(p); setModal('remover') }}
        />
      )}
      {/* Segunda confirmação antes de remover (prevenção de erros) */}
      <ModalConfirmar
        aberto={modal === 'remover'}
        onFechar={() => { setRemovendo(null); setModal('integrantes') }}
        titulo="Remover do grupo?"
        rotuloConfirmar="Remover"
        iconeConfirmar={IconePessoaMenos}
        onConfirmar={removerIntegrante}
      >
        <p>
          <strong>{removendo?.usuario.nome}</strong> vai sair de <strong>{grupo.nome}</strong>. A lista de presentes
          dessa pessoa neste grupo será apagada, e os presentes que ela escolheu voltam a ficar livres.
        </p>
      </ModalConfirmar>
      <ModalConfirmar
        aberto={modal === 'excluir'}
        onFechar={() => setModal(null)}
        titulo="Excluir grupo?"
        rotuloConfirmar="Excluir grupo"
        iconeConfirmar={IconeLixeira}
        onConfirmar={excluirGrupo}
      >
        <p>O grupo <strong>{grupo.nome}</strong> será apagado para todos, junto com as listas de presentes e as escolhas. Não dá para desfazer.</p>
      </ModalConfirmar>
      <ModalConfirmar
        aberto={modal === 'sair'}
        onFechar={() => setModal(null)}
        titulo="Sair do grupo?"
        rotuloConfirmar="Sair do grupo"
        iconeConfirmar={IconeSair}
        onConfirmar={sairDoGrupo}
      >
        <p>Você vai sair de <strong>{grupo.nome}</strong>. Sua lista de presentes deste grupo será apagada e os presentes que você escolheu voltam a ficar livres.</p>
      </ModalConfirmar>

      <div className="mt-6">
        <h1 className="text-2xl font-semibold">{grupo.nome}</h1>
        {grupo.descricao && <Descricao texto={grupo.descricao} />}
      </div>

      <CodigoConvite codigo={grupo.codigo_convite} />

      <div className="mt-8">
        <Abas
          abas={[
            { id: 'integrantes', rotulo: `Integrantes (${outros.length})` },
            { id: 'lista', rotulo: 'Minha lista de presentes' },
          ]}
          ativa={aba}
          onTrocar={setAba}
        />

        {aba === 'integrantes' ? (
          outros.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-controle px-4 py-3 text-sm text-suave">
              Por enquanto, só você está no grupo. Copie o código de convite acima e mande para quem você quer chamar.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {outros.map((p) => (
                <li key={p.id_usuario}>
                  <CartaoIntegrante integrante={p} ehAdmin={p.id_usuario === grupo.id_admin} />
                </li>
              ))}
            </ul>
          )
        ) : (
          minhaParticipacao && (
            <div className="mt-6">
              <MinhaLista idUsuarioGrupo={minhaParticipacao.id_usuario_grupo} />
            </div>
          )
        )}
      </div>
    </Moldura>
  )
}

function Moldura({ voltar, direita, children }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho esquerda={voltar} direita={direita} />
      <main>{children}</main>
    </div>
  )
}

// Descrição que mostra 2 linhas e abre o resto com "Ver mais"
function Descricao({ texto }) {
  const [aberta, setAberta] = useState(false)
  const longa = texto.length > 120 || texto.includes('\n')
  return (
    <div className="mt-2">
      <p className={`whitespace-pre-line text-sm text-suave ${!aberta && longa ? 'line-clamp-2' : ''}`}>{texto}</p>
      {longa && (
        <button type="button" onClick={() => setAberta(!aberta)} className="mt-1 text-sm font-medium text-destaque hover:underline">
          {aberta ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  )
}

// Mostra o código de convite com botão de copiar
function CodigoConvite({ codigo }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    await navigator.clipboard.writeText(codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000) // volta ao normal depois de 2s
  }

  return (
    <div className="mt-6 flex items-center justify-between gap-3 rounded-cartao bg-painel px-5 py-4">
      <div>
        <p className="text-xs text-suave">Código de convite</p>
        <p className="num mt-0.5 text-lg font-medium tracking-wide">{codigo}</p>
      </div>
      <Botao variante="secundario" icone={copiado ? IconeConfirmar : IconeCopiar} onClick={copiar} aria-live="polite">
        {copiado ? 'Copiado!' : 'Copiar'}
      </Botao>
    </div>
  )
}
