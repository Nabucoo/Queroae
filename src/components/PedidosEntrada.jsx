import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useAoVoltarParaApp } from '../lib/useAoVoltarParaApp.js'
import Painel from './Painel.jsx'
import Avatar from './Avatar.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'

// Só o admin vê este bloco: pedidos para entrar no grupo, com Aprovar e Recusar.
// Fica vazio (e some) quando não há pedidos. Só mostra nome e e-mail de quem
// pediu: nada de presentes nem escolhas.
// onAprovado: avisa a tela do grupo para atualizar a lista de integrantes.
export default function PedidosEntrada({ idGrupo, onAprovado }) {
  const [pedidos, setPedidos] = useState([])
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState('') // ex.: "Marina agora faz parte do grupo."
  const [ocupado, setOcupado] = useState(null) // { id, acao } do pedido em andamento

  const buscar = useCallback(async () => {
    const { data, error } = await supabase.rpc('pedidos_do_grupo', { p_id_grupo: idGrupo })
    if (error) setErro(mensagemDeErro(error))
    else setPedidos(data)
  }, [idGrupo])

  useEffect(() => {
    buscar()
  }, [buscar])

  useAoVoltarParaApp(buscar)

  async function decidir(pedido, acao) {
    setErro('')
    setResultado('')
    setOcupado({ id: pedido.id_pedido, acao })
    const funcao = acao === 'aprovar' ? 'aprovar_pedido' : 'recusar_pedido'
    const { error } = await supabase.rpc(funcao, { p_id_pedido: pedido.id_pedido })
    if (error) {
      setErro(mensagemDeErro(error))
    } else if (acao === 'aprovar') {
      setResultado(`${pedido.nome} agora faz parte do grupo.`)
      await onAprovado()
    } else {
      setResultado(`O pedido de ${pedido.nome} foi recusado.`)
    }
    await buscar() // atualiza de qualquer jeito: o pedido pode ter sido cancelado
    setOcupado(null)
  }

  if (pedidos.length === 0 && !erro && !resultado) return null

  return (
    <div className="mt-6 flex flex-col gap-3">
      {resultado && <Aviso tipo="info">{resultado}</Aviso>}
      <Aviso>{erro}</Aviso>
      {pedidos.length > 0 && (
        <Painel titulo={`Pedidos para entrar (${pedidos.length})`}>
          <ul className="flex flex-col gap-2">
            {pedidos.map((p) => {
              const esteOcupado = ocupado?.id === p.id_pedido
              return (
                <li key={p.id_pedido} className="flex flex-col gap-3 rounded-2xl border border-borda bg-elevado p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar nome={p.nome} id={p.id_usuario} tamanho="p" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium break-words">{p.nome}</p>
                      <p className="text-xs break-all text-suave">{p.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Botao variante="secundario" disabled={esteOcupado} onClick={() => decidir(p, 'recusar')}>
                      {esteOcupado && ocupado.acao === 'recusar' ? 'Recusando…' : 'Recusar'}
                    </Botao>
                    <Botao disabled={esteOcupado} onClick={() => decidir(p, 'aprovar')}>
                      {esteOcupado && ocupado.acao === 'aprovar' ? 'Aprovando…' : 'Aprovar'}
                    </Botao>
                  </div>
                </li>
              )
            })}
          </ul>
        </Painel>
      )}
    </div>
  )
}
