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
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v1.8M8 12.7v1.8M14.5 8h-1.8M3.3 8H1.5M12.6 3.4l-1.3 1.3M4.7 11.3l-1.3 1.3M12.6 12.6l-1.3-1.3M4.7 4.7L3.4 3.4" />
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
