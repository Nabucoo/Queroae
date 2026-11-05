import { useCallback, useEffect, useRef, useState } from 'react'
import { IconeConfirmar } from './Icones.jsx'

const TEMPO_VISIVEL = 4000
const TEMPO_DA_SAIDA = 200 // igual à duração da transição abaixo

// Controla o aviso: mostrar('texto') faz ele aparecer e sumir sozinho.
// Um aviso novo substitui o anterior e recomeça a contagem.
export function useAvisoFlutuante() {
  const [aviso, setAviso] = useState({ texto: '', visivel: false })
  const relogios = useRef([])

  const limparRelogios = useCallback(() => {
    relogios.current.forEach(clearTimeout)
    relogios.current = []
  }, [])

  const mostrar = useCallback((texto) => {
    limparRelogios()
    setAviso({ texto, visivel: true })
    relogios.current = [
      setTimeout(() => setAviso((a) => ({ ...a, visivel: false })), TEMPO_VISIVEL),
      setTimeout(() => setAviso({ texto: '', visivel: false }), TEMPO_VISIVEL + TEMPO_DA_SAIDA),
    ]
  }, [limparRelogios])

  useEffect(() => limparRelogios, [limparRelogios])

  return [aviso, mostrar]
}

// Confirmação rápida no fim da tela (H1). Fica sempre na página, vazia, porque o
// leitor de tela só anuncia o que muda dentro de uma área que já existe.
// Sem cliques nele: não atrapalha o que estiver por baixo.
export default function AvisoFlutuante({ aviso }) {
  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-5 z-20 px-4">
      {aviso.texto && (
        <p
          className={[
            'mx-auto flex min-h-11 max-w-[calc(42rem-2rem)] items-center gap-2.5 rounded-2xl bg-ativo px-4 py-2.5',
            'text-apoio font-medium break-words text-texto shadow-[0_0.5rem_1.5rem_-0.5rem_rgba(0,0,0,0.4)]',
            'transition duration-200 starting:translate-y-3 starting:opacity-0 motion-reduce:transition-none',
            aviso.visivel ? 'opacity-100' : 'translate-y-3 opacity-0',
          ].join(' ')}
        >
          <IconeConfirmar className="h-4 w-4 shrink-0" />
          <span className="min-w-0">{aviso.texto}</span>
        </p>
      )}
    </div>
  )
}
