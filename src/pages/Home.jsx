import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAoVoltarParaApp } from '../lib/useAoVoltarParaApp.js'
import { lerConvitePendente, limparConvitePendente } from '../lib/convitePendente.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Painel from '../components/Painel.jsx'
import Abas from '../components/Abas.jsx'
import Botao from '../components/Botao.jsx'
import Avatar from '../components/Avatar.jsx'
import Modal from '../components/Modal.jsx'
import ModalCriarGrupo from '../components/ModalCriarGrupo.jsx'
import ModalEntrarGrupo from '../components/ModalEntrarGrupo.jsx'
import ModalConvite from '../components/ModalConvite.jsx'
import { IconeChave, IconeConfig, IconeMais, IconeSeta } from '../components/Icones.jsx'

export default function Home() {
  const { usuario, perfil } = useAuth()
  const [grupos, setGrupos] = useState([])
  const [escolhas, setEscolhas] = useState([])
  const [pedidos, setPedidos] = useState([]) // meus pedidos para entrar em grupos
  const [contagens, setContagens] = useState({}) // { idGrupo: nº de pedidos } dos grupos em que sou admin
  const [versao, setVersao] = useState(0) // somar 1 busca tudo de novo, sem piscar a tela
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(null) // 'adicionar' | 'criar' | 'entrar' | null
  // A aba aberta fica no endereço (/?aba=presentes): assim, quem sai para a lista
  // de alguém e toca em voltar cai na mesma aba.
  const [params, setParams] = useSearchParams()
  const aba = params.get('aba') === 'presentes' ? 'presentes' : 'grupos'
  // replace: trocar de aba não cria um passo a mais no "voltar" do navegador
  const trocarAba = (id) => setParams(id === 'presentes' ? { aba: 'presentes' } : {}, { replace: true })
  // Quem chega por um link de convite (/convite/:codigo) vem para cá com o código
  // no "bilhete" da navegação. Quem abriu o link sem login e entrou depois tem o
  // código guardado no aparelho. Fechar a janela limpa os dois e fica na Home.
  const bilheteConvite = useLocation().state?.convite
  const [conviteGuardado, setConviteGuardado] = useState(lerConvitePendente)
  const codigoConvite = bilheteConvite ?? conviteGuardado
  const navegar = useNavigate()

  // O convite já chegou aqui: não precisa abrir de novo na próxima vez
  useEffect(() => {
    if (codigoConvite) limparConvitePendente()
  }, [codigoConvite])

  function fecharConvite() {
    setConviteGuardado(null)
    navegar('/', { replace: true })
  }

  const atualizar = useCallback(() => setVersao((v) => v + 1), [])
  useAoVoltarParaApp(atualizar)

  // Busca os dados quando a tela abre
  useEffect(() => {
    async function buscar() {
      // Meus grupos, com o número de integrantes de cada um
      const pedidoGrupos = supabase
        .from('usuario_grupo')
        .select('grupo(id_grupo, nome, id_admin, usuario_grupo(count))')
        .eq('id_usuario', usuario.id)
        .order('created_at', { ascending: false })

      // Presentes que eu marquei, com quem vai ganhar e de qual grupo
      const pedidoEscolhas = supabase
        .from('escolha_presente')
        .select(`id_escolha_presente,
          presente(id_presente, nome, link,
            usuario_grupo(id_usuario, usuario(nome), grupo(id_grupo, nome)))`)
        .eq('id_presenteador', usuario.id)
        .order('created_at', { ascending: false })

      // Promise.all faz todos os pedidos ao mesmo tempo
      const [resGrupos, resEscolhas, resPedidos, resContagens] = await Promise.all([
        pedidoGrupos,
        pedidoEscolhas,
        supabase.rpc('meus_pedidos'),
        supabase.rpc('contagem_pedidos'),
      ])
      const falha = resGrupos.error || resEscolhas.error || resPedidos.error || resContagens.error
      if (falha) setErro(mensagemDeErro(falha))
      else {
        setGrupos(resGrupos.data.map((linha) => linha.grupo))
        setEscolhas(resEscolhas.data)
        setPedidos(resPedidos.data)
        setContagens(Object.fromEntries(resContagens.data.map((c) => [c.id_grupo, c.total])))
        setErro('')
      }
      setCarregando(false)
    }
    buscar()
  }, [usuario.id, versao])

  // Cancelar um pedido pendente ou dispensar o aviso de recusa
  async function descartarPedido(idPedido) {
    const { error } = await supabase.rpc('descartar_pedido', { p_id_pedido: idPedido })
    if (error) return setErro(mensagemDeErro(error))
    setErro('')
    setPedidos((atual) => atual.filter((p) => p.id_pedido !== idPedido))
  }

  const primeiroNome = perfil?.nome?.split(' ')[0]

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho
        direita={
          <BotaoIcone as={Link} to="/perfil" rotulo="Configurações do perfil">
            <IconeConfig className="h-5 w-5" />
          </BotaoIcone>
        }
      />

      <main>
        {/* "Olá," fino; o nome em negrito na cor de destaque */}
        <h1 className="mt-8 mb-8 font-serif text-4xl font-light tracking-[-0.01em] italic sm:text-5xl">
          Olá{primeiroNome && <>, <span className="font-bold text-destaque">{primeiroNome}</span></>}
        </h1>

        {erro && <p role="alert" className="mb-4 rounded-campo bg-negativo-claro px-3 py-2 text-sm text-negativo">{erro}</p>}

        {/* Um card só, com as duas listas em abas (mesmo padrão da tela do Grupo).
            O número em cada aba mostra o que tem na outra sem precisar abrir. */}
        <Painel>
          <Abas
            abas={[
              { id: 'grupos', rotulo: carregando ? 'Grupos' : `Grupos (${grupos.length})` },
              { id: 'presentes', rotulo: carregando ? 'Vou comprar' : `Vou comprar (${escolhas.length})` },
            ]}
            ativa={aba}
            onTrocar={trocarAba}
          />

          <div className="mt-4">
            {aba === 'grupos' ? (
              <ListaGrupos
                grupos={grupos}
                pedidos={pedidos}
                contagens={contagens}
                onDescartarPedido={descartarPedido}
                carregando={carregando}
                idUsuario={usuario.id}
                onAdicionar={() => setModal('adicionar')}
                onCriar={() => setModal('criar')}
                onEntrar={() => setModal('entrar')}
              />
            ) : (
              <ListaPresentes escolhas={escolhas} carregando={carregando} />
            )}
          </div>
        </Painel>
      </main>

      {/* "+ Adicionar": uma porta só, que leva para a escolha explicada */}
      <Modal aberto={modal === 'adicionar'} onFechar={() => setModal(null)} titulo="Adicionar grupo">
        <OpcoesDeGrupo onEntrar={() => setModal('entrar')} onCriar={() => setModal('criar')} />
      </Modal>
      <ModalCriarGrupo aberto={modal === 'criar'} onFechar={() => setModal(null)} />
      <ModalEntrarGrupo aberto={modal === 'entrar'} onFechar={() => setModal(null)} />
      {codigoConvite && <ModalConvite codigo={codigoConvite} onFechar={fecharConvite} onPedido={atualizar} />}
    </div>
  )
}

function ListaGrupos({ grupos, pedidos, contagens, onDescartarPedido, carregando, idUsuario, onAdicionar, onCriar, onEntrar }) {
  if (carregando) return <Esqueleto />

  // Pedidos ficam antes dos grupos, separados: eles ainda não abrem nada
  const blocoPedidos = pedidos.length > 0 && (
    <ul className="mb-4 flex flex-col gap-2">
      {pedidos.map((p) => (
        <li key={p.id_pedido}><CartaoPedido pedido={p} onDescartar={onDescartarPedido} /></li>
      ))}
    </ul>
  )

  // Sem grupos, escolher "entrar ou criar" é a tarefa da tela: as duas opções
  // aparecem direto, cada uma explicando para que serve.
  if (grupos.length === 0) {
    return (
      <>
        {blocoPedidos}
        <p className="mb-3 text-sm text-suave">Você ainda não participa de nenhum grupo. Como quer começar?</p>
        <OpcoesDeGrupo onEntrar={onEntrar} onCriar={onCriar} />
      </>
    )
  }

  // Com grupos, a lista é o principal; criar e entrar viram um "+ Adicionar" no título.
  return (
    <>
      {blocoPedidos}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Seus grupos</h2>
        <Botao variante="secundario" icone={IconeMais} onClick={onAdicionar}>Adicionar</Botao>
      </div>
      <ul className="flex flex-col gap-2">
        {grupos.map((g) => (
          <li key={g.id_grupo}>
            <CartaoLink to={`/grupo/${g.id_grupo}`}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{g.nome}</p>
                <p className="mt-0.5 text-xs text-suave">
                  <span className="num">{g.usuario_grupo[0].count}</span>{' '}
                  {g.usuario_grupo[0].count === 1 ? 'integrante' : 'integrantes'}
                  {g.id_admin === idUsuario && ' · você é admin'}
                </p>
                {contagens[g.id_grupo] > 0 && (
                  <span className="num mt-1 inline-block rounded-full bg-destaque px-2 py-0.5 text-xs font-medium text-fundo">
                    {contagens[g.id_grupo] === 1 ? '1 pedido' : `${contagens[g.id_grupo]} pedidos`}
                  </span>
                )}
              </div>
            </CartaoLink>
          </li>
        ))}
      </ul>
    </>
  )
}

// Um pedido meu para entrar em um grupo: aguardando ou recusado.
// A situação vem escrita, e não só na cor (acessibilidade).
function CartaoPedido({ pedido, onDescartar }) {
  const [enviando, setEnviando] = useState(false)
  const recusado = pedido.situacao === 'recusado'

  async function descartar() {
    setEnviando(true)
    await onDescartar(pedido.id_pedido)
    setEnviando(false)
  }

  return (
    <article className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-contorno bg-elevado p-4">
      <h3 className="text-sm font-semibold break-words">{pedido.nome_grupo}</h3>
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${recusado ? 'bg-negativo-claro text-negativo' : 'bg-ativo text-texto'}`}>
        {recusado ? 'Pedido não aprovado' : 'Aguardando aprovação'}
      </span>
      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-xs text-suave">{recusado ? 'Se foi engano, fale com quem te convidou.' : 'Avise quem te convidou.'}</p>
        <Botao variante={recusado ? 'secundario' : 'texto'} className="shrink-0" disabled={enviando} onClick={descartar}>
          {recusado ? 'Dispensar' : enviando ? 'Cancelando…' : 'Cancelar pedido'}
        </Botao>
      </div>
    </article>
  )
}

// As duas formas de ter um grupo, explicadas. "Tenho um código" vem primeiro:
// quase todo mundo chega ao app por um convite.
function OpcoesDeGrupo({ onEntrar, onCriar }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <OpcaoGrupo icone={IconeChave} cor="bg-confete-5 text-confete-5-tinta" titulo="Tenho um código" onClick={onEntrar}>
        Recebi um convite de alguém da família ou da turma.
      </OpcaoGrupo>
      <OpcaoGrupo icone={IconeMais} cor="bg-confete-1 text-confete-1-tinta" titulo="Criar um grupo" onClick={onCriar}>
        Para organizar o Natal, um aniversário ou um amigo secreto.
      </OpcaoGrupo>
    </div>
  )
}

function OpcaoGrupo({ icone: Icone, cor, titulo, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-2xl border border-borda bg-elevado p-4 text-left transition-colors hover:border-controle focus-visible:outline-2 focus-visible:outline-destaque"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${cor}`}>
        <Icone className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold">{titulo}</span>
      <span className="text-xs text-suave">{children}</span>
    </button>
  )
}

// Presentes que escolhi comprar, separados por grupo (na ordem em que aparecem:
// o grupo com a escolha mais recente vem primeiro)
function ListaPresentes({ escolhas, carregando }) {
  if (carregando) return <Esqueleto />
  if (escolhas.length === 0) {
    return <Vazio>Quando você marcar “vou comprar” num presente da lista de alguém, ele aparece aqui.</Vazio>
  }

  const porGrupo = new Map()
  for (const escolha of escolhas) {
    const grupo = escolha.presente.usuario_grupo.grupo
    if (!porGrupo.has(grupo.id_grupo)) porGrupo.set(grupo.id_grupo, { nome: grupo.nome, itens: [] })
    porGrupo.get(grupo.id_grupo).itens.push(escolha)
  }

  return (
    <div className="flex flex-col gap-5">
      {[...porGrupo.entries()].map(([idGrupo, { nome, itens }]) => (
        <section key={idGrupo}>
          <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
            <h3 className="truncate text-sm font-semibold">{nome}</h3>
            <span className="num shrink-0 text-xs text-suave">{itens.length} {itens.length === 1 ? 'presente' : 'presentes'}</span>
          </div>
          <ul className="flex flex-col gap-2">
            {itens.map(({ id_escolha_presente, presente }) => {
              const dono = presente.usuario_grupo
              return (
                <li key={id_escolha_presente}>
                  {/* state: avisa a página do integrante que viemos da Home (para o botão voltar) */}
                  <CartaoLink to={`/grupo/${idGrupo}/integrante/${dono.id_usuario}`} state={{ de: 'home' }}>
                    <Avatar nome={dono.usuario.nome} id={dono.id_usuario} tamanho="p" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{presente.nome}</p>
                      {/* O grupo já está no título da seção */}
                      <p className="mt-0.5 truncate text-xs text-suave">Para {dono.usuario.nome}</p>
                    </div>
                  </CartaoLink>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

// Cartão clicável de uma linha (grupo ou presente)
function CartaoLink({ to, state, children }) {
  return (
    <Link
      to={to}
      state={state}
      className="flex min-h-[63px] items-center gap-3 rounded-2xl border border-borda bg-elevado px-4 py-3 transition-colors hover:border-controle focus-visible:outline-2 focus-visible:outline-destaque"
    >
      {children}
      <IconeSeta className="ml-auto h-4 w-4 shrink-0 text-suave" />
    </Link>
  )
}

function Vazio({ children }) {
  return <p className="rounded-2xl border border-dashed border-controle px-4 py-3 text-sm text-suave">{children}</p>
}

// Enquanto carrega: barras cinza no tamanho dos cartões
function Esqueleto() {
  return (
    <div className="flex flex-col gap-2" aria-label="Carregando">
      <div className="h-[63px] rounded-2xl bg-ativo" />
      <div className="h-[63px] rounded-2xl bg-ativo" />
    </div>
  )
}
