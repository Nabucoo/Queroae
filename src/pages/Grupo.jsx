import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Abas from '../components/Abas.jsx'
import Avatar from '../components/Avatar.jsx'
import Botao from '../components/Botao.jsx'
import ModalEditarGrupo from '../components/ModalEditarGrupo.jsx'
import ModalConfirmar from '../components/ModalConfirmar.jsx'
import { IconeVoltar, IconeCopiar, IconeSeta, IconeConfig } from '../components/Icones.jsx'

export default function Grupo() {
  const { idGrupo } = useParams() // o número que está no endereço /grupo/:idGrupo
  const { usuario } = useAuth()
  const [grupo, setGrupo] = useState(null)
  const [integrantes, setIntegrantes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('integrantes')
  const [modal, setModal] = useState(null) // 'editar' | 'excluir' | 'sair' | null
  const navegar = useNavigate()

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const [resGrupo, resIntegrantes] = await Promise.all([
        // maybeSingle: devolve null (sem erro) se o grupo não existir ou não for seu
        supabase.from('grupo').select('id_grupo, nome, descricao, codigo_convite, id_admin')
          .eq('id_grupo', idGrupo).maybeSingle(),
        supabase.from('usuario_grupo').select('id_usuario, usuario(nome)')
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

  // Integrante: libera os presentes que escolheu neste grupo e depois sai
  async function sairDoGrupo() {
    // 1. Acha minhas escolhas em presentes deste grupo
    //    (!inner = só traz as que batem com o filtro do grupo)
    const { data: minhas, error: erroBusca } = await supabase
      .from('escolha_presente')
      .select('id_escolha_presente, presente!inner(usuario_grupo!inner(id_grupo))')
      .eq('id_presenteador', usuario.id)
      .eq('presente.usuario_grupo.id_grupo', idGrupo)
    if (erroBusca) return mensagemDeErro(erroBusca)

    // 2. Desmarca essas escolhas
    if (minhas.length > 0) {
      const ids = minhas.map((e) => e.id_escolha_presente)
      const { error } = await supabase.from('escolha_presente').delete().in('id_escolha_presente', ids)
      if (error) return mensagemDeErro(error)
    }

    // 3. Sai do grupo (minha lista de presentes é apagada junto)
    const { data, error } = await supabase
      .from('usuario_grupo').delete()
      .eq('id_grupo', idGrupo).eq('id_usuario', usuario.id)
      .select('id_usuario')
    if (error) return mensagemDeErro(error)
    if (data.length === 0) return 'Não foi possível sair do grupo.'
    navegar('/', { replace: true })
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
  const acaoTopo = souAdmin ? (
    <BotaoIcone rotulo="Editar grupo" onClick={() => setModal('editar')}>
      <IconeConfig className="h-5 w-5" />
    </BotaoIcone>
  ) : (
    <Botao variante="texto" onClick={() => setModal('sair')}>Sair do grupo</Botao>
  )

  return (
    <Moldura voltar={voltar} direita={acaoTopo}>
      {souAdmin && (
        <ModalEditarGrupo
          aberto={modal === 'editar'}
          onFechar={() => setModal(null)}
          grupo={grupo}
          onSalvo={(atualizado) => { setGrupo(atualizado); setModal(null) }}
          onPedirExclusao={() => setModal('excluir')}
        />
      )}
      <ModalConfirmar
        aberto={modal === 'excluir'}
        onFechar={() => setModal(null)}
        titulo="Excluir grupo?"
        rotuloConfirmar="Excluir grupo"
        onConfirmar={excluirGrupo}
      >
        <p>O grupo <strong>{grupo.nome}</strong> será apagado para todos, junto com as listas de presentes e as escolhas. Não dá para desfazer.</p>
      </ModalConfirmar>
      <ModalConfirmar
        aberto={modal === 'sair'}
        onFechar={() => setModal(null)}
        titulo="Sair do grupo?"
        rotuloConfirmar="Sair do grupo"
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
            { id: 'integrantes', rotulo: `Integrantes (${integrantes.length})` },
            { id: 'lista', rotulo: 'Minha lista de presentes' },
          ]}
          ativa={aba}
          onTrocar={setAba}
        />

        {aba === 'integrantes' ? (
          <ul className="mt-2 flex flex-col">
            {integrantes.map((p) => (
              <li key={p.id_usuario}>
                <Link
                  to={`/grupo/${grupo.id_grupo}/integrante/${p.id_usuario}`}
                  className="flex items-center gap-3 border-b border-linha py-3 transition-colors last:border-0 hover:bg-painel focus-visible:outline-2 focus-visible:outline-destaque"
                >
                  <Avatar nome={p.usuario.nome} id={p.id_usuario} />
                  <span className="min-w-0 truncate text-sm font-medium">
                    {p.usuario.nome}
                    {p.id_usuario === usuario.id && <span className="font-normal text-suave"> (você)</span>}
                  </span>
                  {p.id_usuario === grupo.id_admin && (
                    <span className="shrink-0 rounded-full bg-ativo px-2 py-0.5 text-xs text-suave">Admin</span>
                  )}
                  <IconeSeta className="ml-auto h-4 w-4 shrink-0 text-suave" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-suave">Sua lista de presentes chega na próxima etapa.</p>
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
      <Botao variante="secundario" onClick={copiar} aria-live="polite">
        <IconeCopiar />
        {copiado ? 'Copiado!' : 'Copiar'}
      </Botao>
    </div>
  )
}
