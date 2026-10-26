import { Link } from 'react-router'
import Botao from '../components/Botao.jsx'
import { IconeEntrar, IconePessoaMais } from '../components/Icones.jsx'

// Porta de entrada para quem não está logado. Quase todo mundo chega pela
// primeira vez por um convite da família, então "Criar conta" é a ação principal.
export default function BoasVindas() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10 text-center">
      {/* Decorativa: o nome logo abaixo já diz o que é */}
      <img src="/marca/queroae-simbolo-completo.svg" alt="" className="mx-auto h-28 w-28" />
      <h1 className="mt-2 text-3xl font-semibold">QueroAê</h1>
      <p className="mt-2 text-base font-medium text-destaque">O fim do “nossa… que lindo, obrigado”.</p>
      <p className="mt-4 text-sm text-suave">
        Monte sua lista de desejos e veja a da sua família. Ninguém sabe quem vai dar o quê.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Botao as={Link} to="/cadastro" icone={IconePessoaMais} larguraTotal>Criar conta</Botao>
        <Botao as={Link} to="/login" variante="secundario" icone={IconeEntrar} larguraTotal>Já tenho conta</Botao>
      </div>

      <Link to="/privacidade" className="mt-8 text-xs font-medium text-destaque hover:underline">
        Política de privacidade
      </Link>
    </main>
  )
}
