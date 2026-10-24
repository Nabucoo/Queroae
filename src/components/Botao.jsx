// Botão reutilizável.
// variante: "primario" (quase preto), "secundario" (branco com borda),
//           "texto" (só o texto) ou "perigo" (vermelho, para ações destrutivas).
const estilos = {
  primario: 'bg-primario text-fundo hover:bg-texto/85',
  secundario: 'bg-fundo text-texto border border-controle hover:bg-painel',
  texto: 'text-texto hover:bg-ativo',
  perigo: 'bg-fundo text-negativo border border-negativo/40 hover:bg-negativo-claro',
}

export default function Botao({
  variante = 'primario',
  larguraTotal = false,
  className = '',
  type = 'button',
  ...props // o resto (onClick, disabled, children...) vai direto para o <button>
}) {
  return (
    <button
      type={type}
      className={[
        'inline-flex h-[38px] items-center justify-center gap-2 rounded-full px-4',
        'text-sm font-medium transition-colors active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque',
        'disabled:cursor-not-allowed disabled:opacity-60',
        estilos[variante],
        larguraTotal ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
