import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Botao from './Botao.jsx'
import CartaoPresente from './CartaoPresente.jsx'
import EstadoDeErro from './EstadoDeErro.jsx'
import { EsqueletoPresentes } from './Esqueleto.jsx'
import { soltarConfetes } from '../lib/confete.js'
import { IconeDesfazer, IconePresente } from './Icones.jsx'

// Lista de presentes de OUTRA pessoa, com "Vou comprar" e "Desmarcar".
// Usada na página do integrante e no card que expande da aba Integrantes.
// (Para a sua própria lista, use MinhaLista: ela nunca consulta escolhas.)
// onMudou recebe a lista sempre que ela muda (a página usa para o resumo).
export default function ListaDoIntegrante({ idUsuarioGrupo, nome, onMudou }) {
  const { usuario } = useAuth()
  const [presentes, setPresentes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [falha, setFalha] = useState(null) // a lista não carregou na primeira vez
  const jaCarregou = useRef(false)
  const [aviso, setAviso] = useState('') // ex.: "Alguém já escolheu este presente."
  const [ocupado, setOcupado] = useState(null) // id do presente sendo marcado/desmarcado

  // Busca a lista com as escolhas (o RLS só deixa ver se você NÃO é o dono)
  const buscar = useCallback(async () => {
    const { data, error } = await supabase
      .from('presente')
      .select('id_presente, nome, descricao, link, escolha_presente(id_escolha_presente, id_presenteador, usuario(nome))')
      .eq('id_usuario_grupo', idUsuarioGrupo)
      .order('created_at')
    if (error) {
      // Com a lista na tela, só avisa: ela continua visível
      if (jaCarregou.current) setAviso(mensagemDeErro(error))
      else setFalha(error)
    } else {
      jaCarregou.current = true
      setFalha(null)
      // Cada presente tem no máximo uma escolha; deixamos como objeto ou null
      const lista = data.map((p) => ({ ...p, escolha: [p.escolha_presente].flat()[0] ?? null }))
      setPresentes(lista)
      onMudou?.(lista)
    }
    setCarregando(false)
  }, [idUsuarioGrupo, onMudou])

  useEffect(() => {
    buscar()
  }, [buscar])

  const tentarDeNovo = useCallback(() => {
    setFalha(null)
    setCarregando(true)
    buscar()
  }, [buscar])

  // botao: o elemento clicado, de onde os confetes vão sair
  async function vouComprar(presente, botao) {
    setAviso('')
    setOcupado(presente.id_presente)
    const { error } = await supabase
      .from('escolha_presente')
      .insert({ id_presente: presente.id_presente, id_presenteador: usuario.id })
    if (error) {
      // 23505 = duplicado: alguém marcou um pouco antes de você
      setAviso(error.code === '23505' ? 'Alguém já escolheu este presente.' : mensagemDeErro(error))
    } else {
      soltarConfetes(botao) // deu certo: festa!
    }
    await buscar() // atualiza a lista de qualquer jeito
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
    await buscar()
    setOcupado(null)
  }

  if (carregando) return <EsqueletoPresentes quantidade={1} />
  if (falha) return <EstadoDeErro falha={falha} acao="carregar esta lista" onTentar={tentarDeNovo} />

  return (
    <div className="flex flex-col gap-3">
      {aviso && <p role="alert" className="rounded-campo bg-negativo-claro px-3 py-2 text-apoio text-negativo">{aviso}</p>}

      {presentes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-controle px-4 py-3 text-apoio text-suave">
          {nome.split(' ')[0]} ainda não adicionou presentes à lista.
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
                      <p className={`mt-2 text-nota ${minha ? 'font-medium text-destaque' : 'text-suave'}`}>
                        {minha ? 'Você vai comprar' : `${p.escolha.usuario?.nome ?? 'Alguém'} vai comprar`}
                      </p>
                    )
                  }
                  acoes={
                    !p.escolha ? (
                      <Botao icone={IconePresente} onClick={(e) => vouComprar(p, e.currentTarget)} disabled={ocupado === p.id_presente}>
                        {ocupado === p.id_presente ? 'Marcando…' : 'Vou comprar'}
                      </Botao>
                    ) : minha ? (
                      <Botao variante="secundario" icone={IconeDesfazer} onClick={() => desmarcar(p)} disabled={ocupado === p.id_presente}>
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
  )
}
