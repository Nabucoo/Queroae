import { Link } from 'react-router'
import Logo from './Logo.jsx'

// Barra do topo de todas as telas (menos a capa de boas-vindas), em 3 colunas:
// seta de voltar (opcional) | logo, sempre no centro | ação (opcional).
// As colunas dos lados têm a mesma largura (1fr), então a logo fica no mesmo
// ponto em todas as telas, com ou sem seta, qualquer que seja a ação.
export default function Cabecalho({ voltar, direita }) {
  return (
    // mt-4/sm:mt-6: espaço acima da barra (logo e botões descem juntos, alinhados)
    <header className="mt-4 grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 sm:mt-6">
      {/* -ml-2: alinha a seta (e não o círculo do hover) com o texto abaixo */}
      <div className="-ml-2 flex">{voltar}</div>
      {/* A logo leva ao início: a Home, ou as boas-vindas para quem não está logado.
          flex: sem isso o link se comporta como texto e a logo sobe uns pixels */}
      <Link to="/" aria-label="QueroAê, início" className="flex">
        <Logo />
      </Link>
      <div className="flex justify-end">{direita}</div>
    </header>
  )
}

// Botão redondo só com ícone (ex.: configurações, voltar).
// perigo: ícone vermelho, para ações destrutivas (ex.: sair do grupo).
export function BotaoIcone({ rotulo, as: Componente = 'button', perigo = false, className = '', ...props }) {
  const cores = perigo
    ? 'text-negativo hover:bg-negativo-claro'
    : 'text-suave hover:bg-ativo hover:text-texto'
  return (
    <Componente
      aria-label={rotulo}
      title={rotulo}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-destaque ${cores} ${className}`}
      {...props}
    />
  )
}
