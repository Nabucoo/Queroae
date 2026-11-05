import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Painel from '../components/Painel.jsx'
import Avatar from '../components/Avatar.jsx'
import EstadoDeErro from '../components/EstadoDeErro.jsx'
import { Barra, Carregando, EsqueletoPresentes } from '../components/Esqueleto.jsx'
import ListaDoIntegrante from '../components/ListaDoIntegrante.jsx'
import MinhaLista from '../components/MinhaLista.jsx'
import { resumoPresentes } from '../lib/resumoPresentes.js'
import { IconeVoltar } from '../components/Icones.jsx'

export default function Integrante() {
  const { idGrupo, idUsuario } = useParams()
  const { usuario } = useAuth()
  const ehVoce = idUsuario === usuario.id

  const [integrante, setIntegrante] = useState(null)
  const [presentes, setPresentes] = useState(null) // só para o resumo do topo
  const [carregando, setCarregando] = useState(true)
  const [falha, setFalha] = useState(null) // a busca não funcionou (é diferente de a pessoa não estar no grupo)
  const [versao, setVersao] = useState(0) // somar 1 busca de novo ("Tentar de novo")

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const { data, error } = await supabase
        .from('usuario_grupo')
        .select('id_usuario_grupo, id_usuario, usuario(nome)')
        .eq('id_grupo', idGrupo)
        .eq('id_usuario', idUsuario)
        .maybeSingle()
      setFalha(error)
      if (!error) setIntegrante(data)
      setCarregando(false)
    }
    buscar()
  }, [idGrupo, idUsuario, versao])

  const tentarDeNovo = useCallback(() => setVersao((v) => v + 1), [])

  // Se viemos da Home (pelo "bilhete" state do link), voltar leva para a Home,
  // na aba "Vou comprar" (de onde o link saiu); senão (ex.: endereço colado),
  // leva para o grupo.
  const veioDaHome = useLocation().state?.de === 'home'
  const voltar = (
    <BotaoIcone
      as={Link}
      to={veioDaHome ? '/?aba=presentes' : `/grupo/${idGrupo}`}
      rotulo={veioDaHome ? 'Voltar para o início' : 'Voltar para o grupo'}
    >
      <IconeVoltar className="h-5 w-5" />
    </BotaoIcone>
  )

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho voltar={voltar} />
      <main>
        {carregando ? (
          <>
            <Carregando className="mt-6 flex items-center gap-4">
              <Barra className="h-20 w-20 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Barra className="h-[2.125rem] w-3/4 rounded-full" />
                <Barra className="h-4 w-1/2 rounded-full" />
              </div>
            </Carregando>
            <Painel titulo="Lista de presentes" className="mt-8"><EsqueletoPresentes /></Painel>
          </>
        ) : falha ? (
          <Painel className="mt-6">
            <EstadoDeErro falha={falha} acao="abrir esta lista" onTentar={tentarDeNovo} />
          </Painel>
        ) : !integrante ? (
          <>
            <h1 className="mt-8 text-titulo font-semibold">Integrante não encontrado</h1>
            <p className="mt-2 text-apoio text-suave">Esta pessoa não participa deste grupo.</p>
          </>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-4">
              <Avatar nome={integrante.usuario.nome} id={integrante.id_usuario} tamanho="g" />
              <div className="min-w-0">
                <h1 className="text-titulo font-semibold break-words">
                  {integrante.usuario.nome}
                  {ehVoce && <span className="font-normal text-suave"> (você)</span>}
                </h1>
                {!ehVoce && presentes && <p className="mt-1 text-apoio text-suave">{resumoPresentes(presentes)}</p>}
              </div>
            </div>

            <Painel titulo="Lista de presentes" className="mt-8">
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
            </Painel>
          </>
        )}
      </main>
    </div>
  )
}
