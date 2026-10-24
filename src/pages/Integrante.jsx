import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Avatar from '../components/Avatar.jsx'
import Botao from '../components/Botao.jsx'
import CartaoPresente from '../components/CartaoPresente.jsx'
import MinhaLista from '../components/MinhaLista.jsx'
import { IconeVoltar } from '../components/Icones.jsx'

export default function Integrante() {
  const { idGrupo, idUsuario } = useParams()
  const { usuario } = useAuth()
  const ehVoce = idUsuario === usuario.id

  const [integrante, setIntegrante] = useState(null)
  const [presentes, setPresentes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('') // ex.: "Alguém já escolheu este presente."
  const [ocupado, setOcupado] = useState(null) // id do presente sendo marcado/desmarcado

  // Busca a lista com as escolhas (o RLS só deixa ver se você NÃO é o dono)
  const buscarPresentes = useCallback(async (idUsuarioGrupo) => {
    const { data, error } = await supabase
      .from('presente')
      .select('id_presente, nome, descricao, link, escolha_presente(id_escolha_presente, id_presenteador, usuario(nome))')
      .eq('id_usuario_grupo', idUsuarioGrupo)
      .order('created_at')
    if (error) return setErro(mensagemDeErro(error))
    // Cada presente tem no máximo uma escolha; deixamos como objeto ou null
    setPresentes(data.map((p) => ({ ...p, escolha: [p.escolha_presente].flat()[0] ?? null })))
  }, [])

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
      else {
        setIntegrante(data)
        // Na sua própria página, a lista de dono (MinhaLista) busca sozinha
        if (data && !ehVoce) await buscarPresentes(data.id_usuario_grupo)
      }
      setCarregando(false)
    }
    buscar()
  }, [idGrupo, idUsuario, ehVoce, buscarPresentes])

  async function vouComprar(presente) {
    setAviso('')
    setOcupado(presente.id_presente)
    const { error } = await supabase
      .from('escolha_presente')
      .insert({ id_presente: presente.id_presente, id_presenteador: usuario.id })
    if (error) {
      // 23505 = duplicado: alguém marcou um pouco antes de você
      setAviso(error.code === '23505' ? 'Alguém já escolheu este presente.' : mensagemDeErro(error))
    }
    await buscarPresentes(integrante.id_usuario_grupo) // atualiza a lista de qualquer jeito
    setOcupado(null)
  }

  async function desmarcar(presente) {
    setAviso('')
    setOcupado(presente.id_presente)
    const { error } = await supabase
      .from('escolha_presente')
      .delete()
      .eq('id_escolha_presente', presente.escolha.id_escolha_presente)
      .eq('id_presenteador', usuario.id) // só a própria escolha
    if (error) setAviso(mensagemDeErro(error))
    await buscarPresentes(integrante.id_usuario_grupo)
    setOcupado(null)
  }

  const voltar = (
    <BotaoIcone as={Link} to={`/grupo/${idGrupo}`} rotulo="Voltar para o grupo">
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
                {!ehVoce && <p className="mt-1 text-sm text-suave">{resumo(presentes)}</p>}
              </div>
            </div>

            <h2 className="mt-10 text-base font-semibold">Lista de presentes</h2>

            {ehVoce ? (
              // Regra da surpresa: na sua própria página, nada de escolhas
              <MinhaLista idUsuarioGrupo={integrante.id_usuario_grupo} />
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {aviso && <p role="alert" className="rounded-campo bg-negativo-claro px-3 py-2 text-sm text-negativo">{aviso}</p>}

                {presentes.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-controle px-4 py-3 text-sm text-suave">
                    {integrante.usuario.nome.split(' ')[0]} ainda não adicionou presentes à lista.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {presentes.map((p) => {
                      const minha = p.escolha?.id_presenteador === usuario.id
                      return (
                        <li key={p.id_presente}>
                          <CartaoPresente
                            presente={p}
                            riscado={Boolean(p.escolha)}
                            rodape={
                              p.escolha && (
                                <p className={`mt-2 text-xs ${minha ? 'font-medium text-destaque' : 'text-suave'}`}>
                                  {minha ? 'Você vai comprar' : `${p.escolha.usuario?.nome ?? 'Alguém'} vai comprar`}
                                </p>
                              )
                            }
                            acoes={
                              !p.escolha ? (
                                <Botao onClick={() => vouComprar(p)} disabled={ocupado === p.id_presente}>
                                  {ocupado === p.id_presente ? 'Marcando…' : 'Vou comprar'}
                                </Botao>
                              ) : minha ? (
                                <Botao variante="secundario" onClick={() => desmarcar(p)} disabled={ocupado === p.id_presente}>
                                  {ocupado === p.id_presente ? 'Desmarcando…' : 'Desmarcar'}
                                </Botao>
                              ) : null
                            }
                          />
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
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
