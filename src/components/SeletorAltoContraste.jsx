import { useState } from 'react'
import { altoContrasteLigado, guardarAltoContraste } from '../lib/altoContraste.js'

// Interruptor: role="switch" faz o leitor de tela anunciar "ligado" ou "desligado".
// A posição da bolinha mostra o estado, sem depender só da cor.
export default function SeletorAltoContraste() {
  const [ligado, setLigado] = useState(altoContrasteLigado)

  function alternar() {
    setLigado(!ligado)
    guardarAltoContraste(!ligado)
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        onClick={alternar}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-campo text-left focus-visible:outline-2 focus-visible:outline-destaque"
      >
        <span className="text-apoio font-medium">Alto contraste</span>
        <span
          aria-hidden="true"
          className={`flex h-7 w-12 shrink-0 rounded-full border-2 p-0.5 ${ligado ? 'justify-end border-primario bg-primario' : 'justify-start border-contorno bg-fundo'}`}
        >
          <span className={`h-5 w-5 rounded-full ${ligado ? 'bg-fundo' : 'bg-contorno'}`} />
        </span>
      </button>
      <p className="mt-1 text-nota text-suave">Usa preto e branco, com contornos em todos os elementos.</p>
    </div>
  )
}
