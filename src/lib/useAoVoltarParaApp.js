import { useEffect } from 'react'

// Roda a função quando a pessoa volta para o app (ex.: saiu para o WhatsApp e
// voltou) ou quando a internet volta. Assim um pedido aprovado ou recém-chegado
// aparece sem recarregar.
export function useAoVoltarParaApp(funcao) {
  useEffect(() => {
    function aoMudar() {
      if (document.visibilityState === 'visible') funcao()
    }
    document.addEventListener('visibilitychange', aoMudar)
    window.addEventListener('online', funcao)
    return () => {
      document.removeEventListener('visibilitychange', aoMudar)
      window.removeEventListener('online', funcao)
    }
  }, [funcao])
}
