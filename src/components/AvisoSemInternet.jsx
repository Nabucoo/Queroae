import { useSyncExternalStore } from 'react'
import { IconeSemInternet } from './Icones.jsx'

function acompanhar(aoMudar) {
  window.addEventListener('online', aoMudar)
  window.addEventListener('offline', aoMudar)
  return () => {
    window.removeEventListener('online', aoMudar)
    window.removeEventListener('offline', aoMudar)
  }
}

// Faixa no topo enquanto o aparelho está sem internet (H1): avisa antes de a pessoa
// tentar uma ação. Ela não garante que há conexão quando some, então os erros de
// cada tela continuam tratando a falha por conta própria.
export default function AvisoSemInternet() {
  const conectado = useSyncExternalStore(acompanhar, () => navigator.onLine)
  if (conectado) return null

  return (
    <div role="status" className="sticky top-0 z-10 bg-ativo">
      <p className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-2 text-apoio font-medium">
        <IconeSemInternet className="h-4 w-4 shrink-0" />
        Você está sem internet
      </p>
    </div>
  )
}
