// Botão reutilizável.
// variante: "primario" (quase preto), "secundario" (cinza) ou "perigo"
//           (vermelho claro, para ações destrutivas e para "sair").
const estilos = {
  primario: 'bg-primario text-fundo hover:bg-texto/85 contraste:border-2 contraste:border-primario contraste:hover:bg-fundo contraste:hover:text-texto',
  secundario: 'bg-ativo text-texto hover:bg-controle contraste:border-2 contraste:border-texto contraste:hover:bg-texto contraste:hover:text-fundo',
  perigo: 'bg-negativo-claro text-negativo hover:bg-negativo/15 contraste:border-2 contraste:border-negativo contraste:hover:bg-negativo contraste:hover:text-fundo',
}

export default function Botao({
  as: Componente = 'button', // as={Link} faz o botão virar um link com a mesma aparência
  variante = 'primario',
  larguraTotal = false,
  className = '',
  type = 'button',
  icone: Icone, // ex.: icone={IconeMais} — aparece à esquerda do texto
  children,
  ...props // o resto (onClick, disabled...) vai direto para o elemento
}) {
  return (
    <Componente
      type={Componente === 'button' ? type : undefined}
      className={[
        'inline-flex min-h-[2.375rem] items-center justify-center gap-2 rounded-full px-4 py-2 text-center',
        'text-corpo font-medium transition-colors active:scale-[0.98] contraste:active:scale-100',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque',
        // No alto contraste, desligado é tracejado, sem transparência
        'disabled:cursor-not-allowed disabled:opacity-60 contraste:disabled:border-dashed contraste:disabled:bg-fundo contraste:disabled:text-texto contraste:disabled:opacity-100',
        estilos[variante],
        larguraTotal ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {Icone && <Icone className="h-4 w-4 shrink-0" />}
      {children}
    </Componente>
  )
}
