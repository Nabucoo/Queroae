import { Link, useLocation, useNavigate } from 'react-router'
import { SimboloCompleto } from '../components/Logo.jsx'
import Botao from '../components/Botao.jsx'
import ModalConviteInvalido from '../components/ModalConviteInvalido.jsx'
import { IconeEntrar, IconePessoaMais } from '../components/Icones.jsx'

// Porta de entrada para quem não está logado. Quase todo mundo chega pela
// primeira vez por um convite da família, então "Criar conta" é a ação principal.
export default function BoasVindas() {
  // Quem abriu um link de convite inválido chega aqui com este aviso
  const conviteInvalido = useLocation().state?.conviteInvalido
  const navegar = useNavigate()

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10 text-center">
      {/* Decorativa: o nome logo abaixo já diz o que é */}
      <SimboloCompleto className="mx-auto h-28 w-28" />
      <h1 className="mt-2 text-titulo-grande font-semibold">QueroAê</h1>
      <p className="mt-2 text-corpo font-medium text-destaque">O fim do “nossa… que lindo, obrigado”.</p>
      <p className="mt-4 text-apoio text-suave">
        Monte sua lista de desejos e veja a da sua família. Ninguém sabe quem vai dar o quê.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Botao as={Link} to="/cadastro" icone={IconePessoaMais} larguraTotal>Criar conta</Botao>
        <Botao as={Link} to="/login" variante="secundario" icone={IconeEntrar} larguraTotal>Já tenho conta</Botao>
      </div>

      <Link to="/privacidade" state={{ de: 'boas-vindas' }} className="mt-8 text-nota font-medium text-destaque hover:underline">
        Política de privacidade
      </Link>

      {conviteInvalido && <ModalConviteInvalido onFechar={() => navegar('/boas-vindas', { replace: true })} />}
    </main>
  )
}
