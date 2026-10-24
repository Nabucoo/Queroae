import { useAuth } from '../contexts/AuthContext.jsx'
import Logo from '../components/Logo.jsx'
import Botao from '../components/Botao.jsx'

// Home provisória: só confirma quem está logado. A Home de verdade vem na etapa 5.
export default function Home() {
  const { usuario, perfil, sair } = useAuth()
  const primeiroNome = perfil?.nome?.split(' ')[0]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <Logo />
      <div>
        <h1 className="font-serif text-4xl">Olá{primeiroNome ? `, ${primeiroNome}` : ''}</h1>
        <p className="mt-2 text-sm text-suave">Você entrou como {usuario.email}.</p>
      </div>
      <div>
        <Botao variante="secundario" onClick={sair}>Sair</Botao>
      </div>
    </main>
  )
}
