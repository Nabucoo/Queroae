// Ícones simples de contorno (16px), desenhados em SVG.
// currentColor = usam a mesma cor do texto ao redor.
function Icone({ children, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

export function IconeConfig(props) {
  return (
    <Icone {...props}>
      {/* engrenagem de 8 dentes (pontos calculados num círculo) */}
      <path d="M12.53 6.14 L14.47 6.69 L14.47 9.31 L12.53 9.86 L12.52 9.89 L13.50 11.65 L11.65 13.50 L9.89 12.52 L9.86 12.53 L9.31 14.47 L6.69 14.47 L6.14 12.53 L6.11 12.52 L4.35 13.50 L2.50 11.65 L3.48 9.89 L3.47 9.86 L1.53 9.31 L1.53 6.69 L3.47 6.14 L3.48 6.11 L2.50 4.35 L4.35 2.50 L6.11 3.48 L6.14 3.47 L6.69 1.53 L9.31 1.53 L9.86 3.47 L9.89 3.48 L11.65 2.50 L13.50 4.35 L12.52 6.11 Z" />
      <circle cx="8" cy="8" r="2" />
    </Icone>
  )
}

export function IconeVoltar(props) {
  return (
    <Icone {...props}>
      <path d="M10 3L5 8l5 5" />
    </Icone>
  )
}

export function IconeCopiar(props) {
  return (
    <Icone {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
    </Icone>
  )
}

export function IconeSeta(props) {
  return (
    <Icone {...props}>
      <path d="M6 3l5 5-5 5" />
    </Icone>
  )
}

export function IconeMais(props) {
  return (
    <Icone {...props}>
      <path d="M8 3v10M3 8h10" />
    </Icone>
  )
}

export function IconeChave(props) {
  return (
    <Icone {...props}>
      <circle cx="5.5" cy="10.5" r="3" />
      <path d="M7.6 8.4L13.5 2.5M11.5 4.5l1.5 1.5M10 6l1.5 1.5" />
    </Icone>
  )
}

export function IconeLapis(props) {
  return (
    <Icone {...props}>
      <path d="M11 2.5l2.5 2.5L5.5 13H3v-2.5z" />
      <path d="M9.5 4l2.5 2.5" />
    </Icone>
  )
}

export function IconeLixeira(props) {
  return (
    <Icone {...props}>
      <path d="M2.5 4.5h11M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5" />
      <path d="M4 4.5l.7 8.6a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-8.6M6.8 7v4.5M9.2 7v4.5" />
    </Icone>
  )
}

export function IconePresente(props) {
  return (
    <Icone {...props}>
      <rect x="2.5" y="6" width="11" height="3" rx="0.5" />
      <path d="M3.5 9v4.5h9V9M8 6v7.5" />
      <path d="M8 6C6.5 6 4.5 5.5 4.5 4a1.5 1.5 0 0 1 3 0V6M8 6c1.5 0 3.5-.5 3.5-2a1.5 1.5 0 0 0-3 0V6" />
    </Icone>
  )
}

export function IconeDesfazer(props) {
  return (
    <Icone {...props}>
      <path d="M5.5 3.5L2.5 6.5l3 3" />
      <path d="M2.5 6.5h7a4 4 0 0 1 0 8H7" />
    </Icone>
  )
}

export function IconeConfirmar(props) {
  return (
    <Icone {...props}>
      <path d="M3 8.5l3.2 3L13 4.5" />
    </Icone>
  )
}

export function IconeSair(props) {
  return (
    <Icone {...props}>
      <path d="M6.5 2.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" />
      <path d="M10.5 5L13.5 8l-3 3M13.5 8H6" />
    </Icone>
  )
}

export function IconeEntrar(props) {
  return (
    <Icone {...props}>
      <path d="M9.5 2.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3" />
      <path d="M6.5 5L9.5 8l-3 3M9.5 8H2" />
    </Icone>
  )
}

export function IconePessoaMais(props) {
  return (
    <Icone {...props}>
      <circle cx="6.5" cy="5" r="2.5" />
      <path d="M1.5 13.5a5 5 0 0 1 10 0M13 5v4M11 7h4" />
    </Icone>
  )
}

export function IconeEnvelope(props) {
  return (
    <Icone {...props}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="M2.5 4.5L8 8.5l5.5-4" />
    </Icone>
  )
}

export function IconeCasa(props) {
  return (
    <Icone {...props}>
      <path d="M2.5 7L8 2.5 13.5 7" />
      <path d="M4 6v7.5h3V10h2v3.5h3V6" />
    </Icone>
  )
}

export function IconePessoas(props) {
  return (
    <Icone {...props}>
      <circle cx="6" cy="5.5" r="2.3" />
      <path d="M1.5 13.5a4.5 4.5 0 0 1 9 0" />
      <path d="M10.5 3.4a2.3 2.3 0 0 1 0 4.4M12 9.4a4.5 4.5 0 0 1 2.5 4.1" />
    </Icone>
  )
}

export function IconePessoaMenos(props) {
  return (
    <Icone {...props}>
      <circle cx="6.5" cy="5" r="2.5" />
      <path d="M1.5 13.5a5 5 0 0 1 10 0M11 7h4" />
    </Icone>
  )
}

export function IconePessoa(props) {
  return (
    <Icone {...props}>
      <circle cx="8" cy="5" r="2.6" />
      <path d="M2.5 13.5a5.5 5.5 0 0 1 11 0" />
    </Icone>
  )
}

export function IconeCadeado(props) {
  return (
    <Icone {...props}>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
    </Icone>
  )
}

export function IconeOlho(props) {
  return (
    <Icone {...props}>
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="2" />
    </Icone>
  )
}

export function IconeOlhoFechado(props) {
  return (
    <Icone {...props}>
      <path d="M6.2 3.8A6.4 6.4 0 0 1 8 3.5c4 0 6.5 4.5 6.5 4.5a11 11 0 0 1-1.9 2.4M10.1 11.9a6 6 0 0 1-2.1.6C4 12.5 1.5 8 1.5 8a11 11 0 0 1 2.6-3" />
      <path d="M6.6 6.6a2 2 0 0 0 2.8 2.8M2 2l12 12" />
    </Icone>
  )
}
