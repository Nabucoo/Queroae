import { useState } from 'react'
import { TAMANHOS_TEXTO, guardarTamanhoTexto, lerTamanhoTexto } from '../lib/tamanhoTexto.js'
import Cartao from './Cartao.jsx'
import { IconeConfirmar } from './Icones.jsx'

// Opções de rádio: o teclado e o leitor de tela já sabem usar. A mudança vale na
// hora, então a própria tela mostra o resultado. A escolhida tem a cor do botão
// principal e o visto, para não depender só da cor.
export default function SeletorTamanhoTexto() {
  const [atual, setAtual] = useState(lerTamanhoTexto)

  function escolher(id) {
    setAtual(id)
    guardarTamanhoTexto(id)
  }

  return (
    <fieldset className="mt-5">
      <legend className="text-apoio font-medium">Tamanho do texto</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {TAMANHOS_TEXTO.map((tamanho) => {
          const escolhido = tamanho.id === atual
          return (
            <Cartao
                key={tamanho.id}
                as="label"
                interativo
                selecionado={escolhido}
                className="relative flex min-h-11 cursor-pointer flex-col items-start justify-center gap-1 p-3"
              >
              <input
                type="radio"
                name="tamanho-texto"
                className="sr-only"
                checked={escolhido}
                onChange={() => escolher(tamanho.id)}
              />
              <span aria-hidden="true" className="font-semibold" style={{ fontSize: tamanho.amostra }}>Aa</span>
              <span className="text-apoio">{tamanho.rotulo}</span>
              {escolhido && <IconeConfirmar className="absolute top-3 right-3 h-4 w-4" />}
            </Cartao>
          )
        })}
      </div>
    </fieldset>
  )
}
