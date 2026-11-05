import { useState } from 'react'
import { TEMAS, guardarTema, lerTema } from '../lib/tema.js'
import { IconeConfirmar } from './Icones.jsx'

// Opções de rádio, como o tamanho do texto. As opções descem de linha quando o
// texto grande não cabe, e a escolhida também tem o visto, e não só a borda.
export default function SeletorAparencia() {
  const [atual, setAtual] = useState(lerTema)

  function escolher(id) {
    setAtual(id)
    guardarTema(id)
  }

  return (
    <fieldset className="mt-5">
      <legend className="text-apoio font-medium">Aparência</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {TEMAS.map((tema) => {
          const escolhido = tema.id === atual
          return (
            <label
              key={tema.id}
              className={[
                'flex min-h-11 grow cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-elevado px-3 py-2',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-destaque',
                escolhido ? 'border-texto' : 'border-borda hover:border-controle',
              ].join(' ')}
            >
              <input
                type="radio"
                name="aparencia"
                className="sr-only"
                checked={escolhido}
                onChange={() => escolher(tema.id)}
              />
              <span className="text-apoio">{tema.rotulo}</span>
              {escolhido && <IconeConfirmar className="h-4 w-4 shrink-0" />}
            </label>
          )
        })}
      </div>
      <p className="mt-2 text-nota text-suave">Automático acompanha o ajuste do aparelho.</p>
    </fieldset>
  )
}
