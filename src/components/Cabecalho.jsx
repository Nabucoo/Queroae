import { Link } from 'react-router'
import Logo from './Logo.jsx'

// Barra do topo das telas logadas: à esquerda (voltar ou logo), à direita uma ação.
export default function Cabecalho({ esquerda, direita }) {
  return (
    // mt-4/sm:mt-6: espaço acima da barra (logo e botão descem juntos, alinhados)
    <header className="mt-4 flex h-14 items-center justify-between gap-3 sm:mt-6">
      {esquerda ?? (
        <Link to="/" aria-label="QueroAê, início">
          <Logo />
        </Link>
      )}
      {direita}
    </header>
  )
}

// Botão redondo só com ícone (ex.: configurações, voltar)
export function BotaoIcone({ rotulo, as: Componente = 'button', ...props }) {
  return (
    <Componente
      aria-label={rotulo}
      title={rotulo}
      className="flex h-10 w-10 items-center justify-center rounded-full text-suave transition-colors hover:bg-ativo hover:text-texto focus-visible:outline-2 focus-visible:outline-destaque"
      {...props}
    />
  )
}
