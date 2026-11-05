import { useCallback, useRef, useState } from 'react'

// Erros de formulário junto do campo, no lugar do balão do navegador (H9).
// Cada formulário usa noValidate e confere os dados por conta própria.
// mostrar({ email: '...' }) exibe os erros e leva o foco ao primeiro; por isso, os
// erros devem ser escritos na ordem da tela. Mudar um campo apaga o erro dele.
export function useErrosDeCampo() {
  const [erros, setErros] = useState({})
  const campos = useRef({})

  const refDe = useCallback((campo) => (elemento) => {
    campos.current[campo] = elemento
  }, [])

  function mostrar(novos) {
    setErros(novos)
    const primeiro = Object.keys(novos).find((campo) => novos[campo])
    campos.current[primeiro]?.focus()
  }

  function limpar(campo) {
    setErros((atuais) => (atuais[campo] ? { ...atuais, [campo]: undefined } : atuais))
  }

  function limparTodos() {
    setErros({})
  }

  return { erros, refDe, mostrar, limpar, limparTodos }
}
