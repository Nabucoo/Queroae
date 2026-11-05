// Botão reutilizável.
// variante: "primario" (quase preto), "secundario" (cinza) ou "perigo"
//           (vermelho claro, para ações destrutivas e para "sair").
const estilos = {
  primario: 'bg-primario text-fundo hover:bg-texto/85',
  secundario: 'bg-ativo text-texto hover:bg-controle',
  perigo: 'bg-negativo-claro text-negativo hover:bg-negativo/15',
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
        'inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full px-4 py-2 text-center',
        'text-corpo font-medium transition-colors active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque',
        'disabled:cursor-not-allowed disabled:opacity-60',
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
