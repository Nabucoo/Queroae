import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Painel from '../components/Painel.jsx'
import Botao from '../components/Botao.jsx'
import Avatar from '../components/Avatar.jsx'
import ModalCriarGrupo from '../components/ModalCriarGrupo.jsx'
import ModalEntrarGrupo from '../components/ModalEntrarGrupo.jsx'
import { IconeConfig, IconeSeta } from '../components/Icones.jsx'

export default function Home() {
  const { usuario, perfil } = useAuth()
  const [grupos, setGrupos] = useState([])
  const [escolhas, setEscolhas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(null) // 'criar' | 'entrar' | null

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

      // Promise.all faz os dois pedidos ao mesmo tempo
      const [resGrupos, resEscolhas] = await Promise.all([pedidoGrupos, pedidoEscolhas])
      const falha = resGrupos.error || resEscolhas.error
      if (falha) setErro(mensagemDeErro(falha))
      else {
        setGrupos(resGrupos.data.map((linha) => linha.grupo))
        setEscolhas(resEscolhas.data)
      }
      setCarregando(false)
    }
    buscar()
  }, [usuario.id])

  const primeiroNome = perfil?.nome?.split(' ')[0]

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16">
      <Cabecalho
        direita={
          <BotaoIcone as={Link} to="/perfil" rotulo="Configurações do perfil">
            <IconeConfig className="h-5 w-5" />
          </BotaoIcone>
        }
      />

      <main>
        <div className="mt-8 mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl">Olá{primeiroNome ? `, ${primeiroNome}` : ''}</h1>
          {!carregando && !erro && (
            <p className="mt-2 text-base text-suave">{fraseDoDia(grupos.length, escolhas.length)}</p>
          )}
        </div>

        {erro && <p role="alert" className="mb-4 rounded-campo bg-negativo-claro px-3 py-2 text-sm text-negativo">{erro}</p>}

        <div className="grid items-start gap-4 md:grid-cols-2">
          <Painel
            titulo={<>Grupos que estou participando <Contagem n={grupos.length} carregando={carregando} /></>}
          >
            <div className="mb-4 flex flex-wrap gap-3">
              <Botao onClick={() => setModal('criar')}>Criar grupo novo</Botao>
              <Botao variante="secundario" onClick={() => setModal('entrar')}>Entrar com código</Botao>
            </div>
            {carregando ? (
              <Esqueleto />
            ) : grupos.length === 0 ? (
              <Vazio>Você ainda não participa de nenhum grupo. Crie um ou entre com o código que alguém te mandou.</Vazio>
            ) : (
              <ul className="flex flex-col gap-2">
                {grupos.map((g) => (
                  <li key={g.id_grupo}>
                    <CartaoLink to={`/grupo/${g.id_grupo}`}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{g.nome}</p>
                        <p className="mt-0.5 text-xs text-suave">
                          <span className="num">{g.usuario_grupo[0].count}</span>{' '}
                          {g.usuario_grupo[0].count === 1 ? 'integrante' : 'integrantes'}
                          {g.id_admin === usuario.id && ' · você é admin'}
                        </p>
                      </div>
                    </CartaoLink>
                  </li>
                ))}
              </ul>
            )}
          </Painel>

          <Painel
            titulo={<>Presentes que escolhi comprar <Contagem n={escolhas.length} carregando={carregando} /></>}
          >
            {carregando ? (
              <Esqueleto />
            ) : escolhas.length === 0 ? (
              <Vazio>Quando você marcar “vou comprar” num presente da lista de alguém, ele aparece aqui.</Vazio>
            ) : (
              <ul className="flex flex-col gap-2">
                {escolhas.map(({ id_escolha_presente, presente }) => {
                  const dono = presente.usuario_grupo
                  return (
                    <li key={id_escolha_presente}>
                      <CartaoLink to={`/grupo/${dono.grupo.id_grupo}/integrante/${dono.id_usuario}`}>
                        <Avatar nome={dono.usuario.nome} id={dono.id_usuario} tamanho="p" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{presente.nome}</p>
                          <p className="mt-0.5 truncate text-xs text-suave">
                            Para {dono.usuario.nome} · {dono.grupo.nome}
                          </p>
                        </div>
                      </CartaoLink>
                    </li>
                  )
                })}
              </ul>
            )}
          </Painel>
        </div>
      </main>

      <ModalCriarGrupo aberto={modal === 'criar'} onFechar={() => setModal(null)} />
      <ModalEntrarGrupo
        aberto={modal === 'entrar'}
        onFechar={() => setModal(null)}
        idsMeusGrupos={grupos.map((g) => g.id_grupo)}
      />
    </div>
  )
}

// A frase abaixo da saudação, montada a partir dos dados
function fraseDoDia(qtdGrupos, qtdEscolhas) {
  if (qtdGrupos === 0) return 'Comece criando um grupo ou entrando com um código de convite.'
  if (qtdEscolhas === 0) return 'Você ainda não escolheu nenhum presente para comprar.'
  return qtdEscolhas === 1 ? 'Você vai dar 1 presente.' : `Você vai dar ${qtdEscolhas} presentes.`
}

function Contagem({ n, carregando }) {
  if (carregando) return null
  return <span className="num ml-1 rounded-full bg-ativo px-2 py-0.5 text-xs font-medium text-suave">{n}</span>
}

// Cartão clicável de uma linha (grupo ou presente)
function CartaoLink({ to, children }) {
  return (
    <Link
      to={to}
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
