// Painel: bloco cinza-claro com título e, opcionalmente, uma ação à direita.
export default function Painel({ titulo, acao, children, className = '' }) {
  return (
    <section className={`rounded-cartao bg-painel p-5 ${className}`}>
      {(titulo || acao) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {titulo && <h2 className="text-sm font-semibold">{titulo}</h2>}
          {acao}
        </header>
      )}
      {children}
    </section>
  )
}
