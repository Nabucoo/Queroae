// Cartão: o bloco branco com contorno usado em listas e opções do app inteiro.
// Mudar a aparência aqui muda todos os cartões juntos (H4).
// as: a tag ou o componente (ex.: as={Link}, as="article").
// interativo: pode ser tocado (o contorno reage ao passar o mouse e mostra o foco).
// tracejado: algo provisório, como um pedido aguardando ou uma lista vazia.
// selecionado: a opção escolhida, preenchida com a cor do botão principal.
export default function Cartao({
  as: Componente = 'div',
  interativo = false,
  tracejado = false,
  selecionado = false,
  className = '',
  ...props
}) {
  return (
    <Componente
      className={[
        'rounded-2xl border contraste:border-2',
        selecionado ? 'border-primario bg-primario text-fundo' : 'border-contorno bg-elevado',
        tracejado ? 'border-dashed' : '',
        interativo
          ? 'transition-colors hover:border-texto contraste:hover:outline-2 contraste:hover:outline-texto focus-visible:outline-2 focus-visible:outline-destaque has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-destaque'
          : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

// Mensagem no lugar de uma lista vazia
export function CartaoVazio({ children }) {
  return (
    <Cartao as="p" tracejado className="px-4 py-3 text-apoio text-suave">
      {children}
    </Cartao>
  )
}
