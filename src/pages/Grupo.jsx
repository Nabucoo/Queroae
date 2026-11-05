import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Painel from '../components/Painel.jsx'
import Abas from '../components/Abas.jsx'
import EstadoDeErro from '../components/EstadoDeErro.jsx'
import { Barra, Carregando, EsqueletoCartoes } from '../components/Esqueleto.jsx'
import CartaoIntegrante from '../components/CartaoIntegrante.jsx'
import Botao from '../components/Botao.jsx'
import MinhaLista from '../components/MinhaLista.jsx'
import ModalEditarGrupo from '../components/ModalEditarGrupo.jsx'
import ModalConfirmar from '../components/ModalConfirmar.jsx'
import ModalIntegrantes from '../components/ModalIntegrantes.jsx'
import PedidosEntrada from '../components/PedidosEntrada.jsx'
import { Aviso } from '../components/TelaAuth.jsx'
import { IconeCompartilhar, IconeConfig, IconeConfirmar, IconeCopiar, IconeLixeira, IconePessoaMenos, IconeSair, IconeVoltar } from '../components/Icones.jsx'

// presente(count): quantos presentes cada um tem (para o card fechado)
function pedirIntegrantes(idGrupo) {
  return supabase.from('usuario_grupo').select('id_usuario_grupo, id_usuario, usuario(nome), presente(count)')
    .eq('id_grupo', idGrupo).order('created_at')
}

export default function Grupo() {
  const { idGrupo } = useParams() // o número que está no endereço /grupo/:idGrupo
  const { usuario } = useAuth()
  const [grupo, setGrupo] = useState(null)
  const [integrantes, setIntegrantes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [falha, setFalha] = useState(null) // a busca não funcionou (é diferente de o grupo não existir)
  const [versao, setVersao] = useState(0) // somar 1 busca de novo ("Tentar de novo")
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
        pedirIntegrantes(idGrupo),
      ])
      const falhaBusca = resGrupo.error || resIntegrantes.error
      setFalha(falhaBusca)
      if (!falhaBusca) {
        setGrupo(resGrupo.data)
        setIntegrantes(resIntegrantes.data)
      }
      setCarregando(false)
    }
    buscar()
  }, [idGrupo, versao])

  const tentarDeNovo = useCallback(() => setVersao((v) => v + 1), [])

  // Depois de aprovar um pedido: a pessoa já aparece na lista, sem recarregar a tela
  const atualizarIntegrantes = useCallback(async () => {
    const { data, error } = await pedirIntegrantes(idGrupo)
    if (!error) setIntegrantes(data)
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

  if (carregando) return <Moldura voltar={voltar}><EsqueletoGrupo aba={aba} onTrocarAba={setAba} /></Moldura>

  if (falha) {
    return (
      <Moldura voltar={voltar}>
        <Painel className="mt-6">
          <EstadoDeErro falha={falha} acao="abrir este grupo" onTentar={tentarDeNovo} />
        </Painel>
      </Moldura>
    )
  }

  if (!grupo) {
    return (
      <Moldura voltar={voltar}>
        <h1 className="mt-8 text-titulo font-semibold">Grupo não encontrado</h1>
        <p className="mt-2 text-apoio text-suave">Este grupo não existe ou você não participa dele.</p>
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
    // Só o ícone, em vermelho: cabe ao lado da logo centralizada e se diferencia
    // da engrenagem do admin. A confirmação "Sair do grupo?" evita toque errado.
    <BotaoIcone perigo rotulo="Sair do grupo" onClick={() => setModal('sair')}>
      <IconeSair className="h-5 w-5" />
    </BotaoIcone>
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
        <h1 className="text-titulo font-semibold break-words">{grupo.nome}</h1>
        {grupo.descricao && <Descricao texto={grupo.descricao} />}
      </div>

      {/* Acima do convite: tem alguém esperando. Some quando não há pedidos. */}
      {souAdmin && <PedidosEntrada idGrupo={grupo.id_grupo} onAprovado={atualizarIntegrantes} />}

      <CartaoConvite nomeGrupo={grupo.nome} codigo={grupo.codigo_convite} />

      {/* Abas e lista dentro do painel: o mesmo padrão da Home */}
      <Painel className="mt-8">
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
            <p className="mt-4 rounded-2xl border border-dashed border-controle px-4 py-3 text-apoio text-suave">
              Por enquanto, só você está no grupo. Toque em Compartilhar e mande o convite para quem você quer chamar.
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
            <div className="mt-4">
              <MinhaLista idUsuarioGrupo={minhaParticipacao.id_usuario_grupo} />
            </div>
          )
        )}
      </Painel>
    </Moldura>
  )
}

// Mesma disposição da tela pronta: título, convite e lista com as abas
function EsqueletoGrupo({ aba, onTrocarAba }) {
  return (
    <>
      <Carregando className="mt-6 flex flex-col gap-6">
        <Barra className="h-[2.125rem] w-2/3 rounded-full" />
        <div className="flex items-center justify-between gap-3 rounded-cartao bg-painel px-5 py-4">
          <div className="flex flex-1 flex-col gap-2">
            <Barra className="h-[1.125rem] w-3/4 rounded-full" />
            <Barra className="h-3.5 w-1/2 rounded-full" />
          </div>
          <Barra className="h-[2.375rem] w-[7.5rem] shrink-0 rounded-full" />
        </div>
      </Carregando>
      <Painel className="mt-8">
        <Abas
          abas={[
            { id: 'integrantes', rotulo: 'Integrantes' },
            { id: 'lista', rotulo: 'Minha lista de presentes' },
          ]}
          ativa={aba}
          onTrocar={onTrocarAba}
        />
        <div className="mt-4"><EsqueletoCartoes quantidade={3} /></div>
      </Painel>
    </>
  )
}

function Moldura({ voltar, direita, children }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho voltar={voltar} direita={direita} />
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
      <p className={`whitespace-pre-line text-apoio text-suave ${!aberta && longa ? 'line-clamp-2' : ''}`}>{texto}</p>
      {longa && (
        <button type="button" onClick={() => setAberta(!aberta)} className="mt-1 text-corpo font-medium text-destaque hover:underline">
          {aberta ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  )
}

// Cartão de convite: Compartilhar manda a mensagem com o link, e o código fica
// menor, para quem preferir digitar. Ocupa a mesma altura do cartão antigo, então
// a lista de integrantes não desce.
function CartaoConvite({ nomeGrupo, codigo }) {
  const [copiado, setCopiado] = useState(null) // 'convite' | 'codigo' | null
  const [falhaAoCopiar, setFalhaAoCopiar] = useState(false)

  const link = `${window.location.origin}/convite/${codigo}`
  const mensagem = `Entra no nosso grupo “${nomeGrupo}” no QueroAê: ${link}`

  async function copiar(texto, qual) {
    setFalhaAoCopiar(false)
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(qual)
      setTimeout(() => setCopiado(null), 2000) // volta ao normal depois de 2s
    } catch {
      setFalhaAoCopiar(true) // sem permissão: mostra o link para copiar à mão
    }
  }

  async function compartilhar() {
    // Sem a janela de compartilhar do aparelho, copia a mensagem
    if (!navigator.share) return copiar(mensagem, 'convite')
    try {
      // O link vai dentro do texto: alguns apps ignoram o campo "url" separado
      await navigator.share({ text: mensagem })
    } catch (falha) {
      // AbortError = a pessoa só fechou a janela: não é um erro
      if (falha.name !== 'AbortError') copiar(mensagem, 'convite')
    }
  }

  return (
    <div className="mt-6 rounded-cartao bg-painel px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-corpo font-semibold">Convidar pessoas</p>
          <button
            type="button"
            onClick={() => copiar(codigo, 'codigo')}
            aria-label={`Copiar o código ${codigo}`}
            className="num flex min-h-6 items-center gap-1 rounded text-nota text-suave hover:text-texto focus-visible:outline-2 focus-visible:outline-destaque"
          >
            {copiado === 'codigo' ? 'Código copiado!' : <>Código {codigo}</>}
            {copiado === 'codigo' ? <IconeConfirmar className="h-3 w-3" /> : <IconeCopiar className="h-3 w-3" />}
          </button>
        </div>
        <Botao icone={copiado === 'convite' ? IconeConfirmar : IconeCompartilhar} className="shrink-0" onClick={compartilhar}>
          {copiado === 'convite' ? 'Copiado!' : 'Compartilhar'}
        </Botao>
      </div>
      {/* Anuncia o resultado de copiar para quem usa leitor de tela */}
      <p role="status" className="sr-only">{copiado && 'Copiado.'}</p>
      {falhaAoCopiar && (
        <div className="mt-3">
          <Aviso>Não conseguimos copiar. Selecione e envie este link: <span className="break-all">{link}</span></Aviso>
        </div>
      )}
    </div>
  )
}
