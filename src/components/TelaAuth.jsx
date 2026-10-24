import Logo from './Logo.jsx'

// Moldura comum das telas de login, cadastro e senha.
export default function TelaAuth({ titulo, subtitulo, children, rodape }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <Logo />
      <h1 className="mt-8 text-2xl font-semibold">{titulo}</h1>
      {subtitulo && <p className="mt-2 text-sm text-suave">{subtitulo}</p>}
      <div className="mt-6">{children}</div>
      {rodape && <div className="mt-6 flex flex-col gap-3 text-sm">{rodape}</div>}
    </main>
  )
}

// Caixa de aviso (erro em vermelho, informação em cinza)
export function Aviso({ tipo = 'erro', children }) {
  if (!children) return null
  const cor = tipo === 'erro' ? 'bg-negativo-claro text-negativo' : 'bg-painel text-texto'
  return (
    <p role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-campo px-3 py-2 text-sm ${cor}`}>
      {children}
    </p>
  )
}
