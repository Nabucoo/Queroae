// Abas com sublinhado. Quem usa guarda qual aba está ativa (estado)
// e recebe o aviso de troca pelo onTrocar.
// Sem espaço (texto grande), a aba desce para outra linha em vez de ficar cortada.
// abas: [{ id: 'integrantes', rotulo: 'Integrantes' }, ...]
export default function Abas({ abas, ativa, onTrocar }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-6 border-b border-borda contraste:border-b-2">
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
              '-mb-px shrink-0 border-b-2 py-3 text-apoio transition-colors contraste:-mb-0.5 contraste:border-b-4',
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
