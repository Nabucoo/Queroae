import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Avatar from '../components/Avatar.jsx'
import ListaDoIntegrante from '../components/ListaDoIntegrante.jsx'
import MinhaLista from '../components/MinhaLista.jsx'
import { IconeVoltar } from '../components/Icones.jsx'

export default function Integrante() {
  const { idGrupo, idUsuario } = useParams()
  const { usuario } = useAuth()
  const ehVoce = idUsuario === usuario.id

  const [integrante, setIntegrante] = useState(null)
  const [presentes, setPresentes] = useState(null) // só para o resumo do topo
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const { data, error } = await supabase
        .from('usuario_grupo')
        .select('id_usuario_grupo, id_usuario, usuario(nome)')
        .eq('id_grupo', idGrupo)
        .eq('id_usuario', idUsuario)
        .maybeSingle()
      if (error) setErro(mensagemDeErro(error))
      else setIntegrante(data)
      setCarregando(false)
    }
    buscar()
  }, [idGrupo, idUsuario])

  // Se viemos da Home (pelo "bilhete" state do link), voltar leva para a Home;
  // senão (ex.: endereço colado), leva para o grupo.
  const veioDaHome = useLocation().state?.de === 'home'
  const voltar = (
    <BotaoIcone
      as={Link}
      to={veioDaHome ? '/' : `/grupo/${idGrupo}`}
      rotulo={veioDaHome ? 'Voltar para o início' : 'Voltar para o grupo'}
    >
      <IconeVoltar className="h-5 w-5" />
    </BotaoIcone>
  )

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho esquerda={voltar} />
      <main>
        {carregando ? (
          <p className="mt-8 text-sm text-suave">Carregando…</p>
        ) : erro || !integrante ? (
          <>
            <h1 className="mt-8 text-2xl font-semibold">Integrante não encontrado</h1>
            <p className="mt-2 text-sm text-suave">{erro || 'Esta pessoa não participa deste grupo.'}</p>
          </>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-4">
              <Avatar nome={integrante.usuario.nome} id={integrante.id_usuario} tamanho="g" />
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold break-words">
                  {integrante.usuario.nome}
                  {ehVoce && <span className="font-normal text-suave"> (você)</span>}
                </h1>
                {!ehVoce && presentes && <p className="mt-1 text-sm text-suave">{resumo(presentes)}</p>}
              </div>
            </div>

            <h2 className="mt-10 mb-4 text-base font-semibold">Lista de presentes</h2>

            {ehVoce ? (
              // Regra da surpresa: na sua própria página, nada de escolhas
              <MinhaLista idUsuarioGrupo={integrante.id_usuario_grupo} />
            ) : (
              // setPresentes é estável (não muda entre desenhos), seguro como onMudou
              <ListaDoIntegrante
                idUsuarioGrupo={integrante.id_usuario_grupo}
                nome={integrante.usuario.nome}
                onMudou={setPresentes}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

// "3 presentes · 1 ainda livre"
function resumo(presentes) {
  const total = presentes.length
  if (total === 0) return 'Nenhum presente na lista'
  const livres = presentes.filter((p) => !p.escolha).length
  const parte1 = total === 1 ? '1 presente' : `${total} presentes`
  const parte2 = livres === 0 ? 'todos já escolhidos' : livres === 1 ? '1 ainda livre' : `${livres} ainda livres`
  return `${parte1} · ${parte2}`
}
