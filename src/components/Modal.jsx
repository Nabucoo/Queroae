import { useEffect, useRef } from 'react'

// Janela que abre por cima da tela. Usa o <dialog> do próprio navegador,
// que já fecha com a tecla Esc e prende o foco dentro dele.
export default function Modal({ aberto, onFechar, titulo, children }) {
  const ref = useRef(null) // "ref" = um jeito de mexer direto no elemento HTML

  // useEffect roda depois que a tela é desenhada: abre ou fecha o <dialog>
  useEffect(() => {
    const dialogo = ref.current
    if (aberto && !dialogo.open) dialogo.showModal()
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      onClose={onFechar}
      // Clicar no fundo escuro (fora da caixa) também fecha
      onClick={(e) => e.target === ref.current && onFechar()}
      className={[
        'm-auto w-[calc(100%-2rem)] max-w-md rounded-cartao bg-fundo p-0 text-texto',
        // sombra permitida: o modal flutua sobre a tela  taste-skill-ignore
        'shadow-[0_16px_48px_-8px_rgba(15,15,15,0.16)] backdrop:bg-texto/40',
      ].join(' ')}
    >
      <div className="p-6">
        <header className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-suave hover:bg-ativo hover:text-texto"
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
