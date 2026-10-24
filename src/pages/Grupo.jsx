import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Abas from '../components/Abas.jsx'
import Avatar from '../components/Avatar.jsx'
import Botao from '../components/Botao.jsx'
import { IconeVoltar, IconeCopiar, IconeSeta } from '../components/Icones.jsx'

export default function Grupo() {
  const { idGrupo } = useParams() // o número que está no endereço /grupo/:idGrupo
  const { usuario } = useAuth()
  const [grupo, setGrupo] = useState(null)
  const [integrantes, setIntegrantes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('integrantes')

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

  return (
    <Moldura voltar={voltar}>
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

function Moldura({ voltar, children }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho esquerda={voltar} />
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
