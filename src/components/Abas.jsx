// Abas com sublinhado. Quem usa guarda qual aba está ativa (estado)
// e recebe o aviso de troca pelo onTrocar.
// abas: [{ id: 'integrantes', rotulo: 'Integrantes' }, ...]
export default function Abas({ abas, ativa, onTrocar }) {
  return (
    <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-borda">
      {abas.map((aba) => {
        const selecionada = aba.id === ativa
        return (
          <button
            key={aba.id}
            role="tab"
            type="button"
            aria-selected={selecionada}
            onClick={() => onTrocar(aba.id)}
            className={[
              '-mb-px shrink-0 border-b-2 py-3 text-sm transition-colors',
              'focus-visible:outline-2 focus-visible:outline-destaque',
              selecionada
                ? 'border-texto font-medium text-texto'
                : 'border-transparent text-suave hover:text-texto',
            ].join(' ')}
          >
            {aba.rotulo}
          </button>
        )
      })}
    </div>
  )
}
