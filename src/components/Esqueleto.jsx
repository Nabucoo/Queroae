import Logo from './Logo.jsx'

// Peças de carregamento (H1): barras no formato do que vai aparecer, para a tela
// não dar um salto quando os dados chegam. A pulsação para para quem pediu menos
// movimento no aparelho.
export function Barra({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-ativo motion-reduce:animate-none ${className}`} />
}

// Avisa o leitor de tela. As barras dentro dele são só visuais.
export function Carregando({ className = '', children }) {
  return <div role="status" aria-label="Carregando" className={className}>{children}</div>
}

// Cartões de uma linha (grupos e integrantes)
export function EsqueletoCartoes({ quantidade = 2 }) {
  return (
    <Carregando className="flex flex-col gap-2">
      {Array.from({ length: quantidade }, (_, i) => <Barra key={i} className="h-[3.9375rem]" />)}
    </Carregando>
  )
}

// Cartões de presente: nome, descrição e botão
export function EsqueletoPresentes({ quantidade = 2 }) {
  return (
    <Carregando className="flex flex-col gap-2">
      {Array.from({ length: quantidade }, (_, i) => (
        <div key={i} className="flex flex-col gap-2.5 rounded-2xl border border-borda bg-elevado p-4">
          <Barra className="h-[1.125rem] w-3/5 rounded-full" />
          <Barra className="h-3.5 w-5/6 rounded-full" />
          <Barra className="h-[2.375rem] w-[7.5rem] rounded-full" />
        </div>
      ))}
    </Carregando>
  )
}

// Ao abrir o app ou um link: ainda não se sabe qual tela vem depois, então só a logo
export function TelaAbrindo() {
  return (
    <Carregando className="flex justify-center pt-16">
      <Logo />
    </Carregando>
  )
}
