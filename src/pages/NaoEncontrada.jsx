import { Link } from 'react-router'
import Logo from '../components/Logo.jsx'
import Botao from '../components/Botao.jsx'

// Aparece quando o endereço não existe (ex.: /qualquercoisa)
export default function NaoEncontrada() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <Logo />
      <h1 className="mt-8 text-2xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 text-sm text-suave">
        Esse endereço não existe ou mudou. Volte para o início e continue de lá.
      </p>
      <div className="mt-6">
        <Botao as={Link} to="/">Ir para o início</Botao>
      </div>
    </main>
  )
}
