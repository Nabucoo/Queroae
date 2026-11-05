import { useEffect, useRef } from 'react'

// Janela que abre por cima da tela. Usa o <dialog> do próprio navegador,
// que já fecha com a tecla Esc e prende o foco dentro dele.
export default function Modal({ aberto, onFechar, titulo, children }) {
  const ref = useRef(null) // "ref" = um jeito de mexer direto no elemento HTML
  const deveriaEstarAberto = useRef(aberto)

  // useEffect roda depois que a tela é desenhada: abre ou fecha o <dialog>
  useEffect(() => {
    deveriaEstarAberto.current = aberto
    const dialogo = ref.current
    if (aberto && !dialogo.open) {
      dialogo.showModal()
      // Sozinho, o navegador colocaria o foco no X, que apareceria com contorno ao abrir.
      // Na própria janela, o leitor de tela anuncia o título, e o Tab segue para o X.
      dialogo.focus()
    }
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      // Só avisa quando a PESSOA fechou (ex.: tecla Esc), não quando o app fechou
      onClose={() => deveriaEstarAberto.current && onFechar()}
      // Clicar no fundo escuro (fora da caixa) também fecha
      onClick={(e) => e.target === ref.current && onFechar()}
      className={[
        'm-auto w-[calc(100%-2rem)] max-w-md rounded-cartao bg-janela p-0 text-texto outline-none contraste:border-2 contraste:border-texto',
        'shadow-[0_1rem_3rem_-0.5rem_rgba(15,15,15,0.16)]', // sombra ok: o modal flutua (taste-skill-ignore)
      ].join(' ')}
    >
      <div className="p-6">
        <header className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-subtitulo font-semibold">{titulo}</h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-suave hover:bg-ativo hover:text-texto focus-visible:outline-2 focus-visible:outline-destaque"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}
