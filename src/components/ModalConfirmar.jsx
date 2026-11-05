import { useState } from 'react'
import Modal from './Modal.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'

// Pergunta "tem certeza?" antes de uma ação sem volta.
// onConfirmar deve devolver uma mensagem de erro (texto) se algo falhar.
export default function ModalConfirmar({ aberto, onFechar, titulo, children, rotuloConfirmar, iconeConfirmar, onConfirmar }) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function confirmar() {
    setErro('')
    setEnviando(true)
    const mensagem = await onConfirmar()
    setEnviando(false)
    if (mensagem) setErro(mensagem)
  }

  function fechar() {
    setErro('')
    onFechar()
  }

  return (
    <Modal aberto={aberto} onFechar={fechar} titulo={titulo}>
      <div className="flex flex-col gap-4 text-corpo">
        {children}
        <Aviso>{erro}</Aviso>
        <div className="mt-2 flex flex-wrap justify-end gap-3">
          <Botao variante="secundario" onClick={fechar}>Cancelar</Botao>
          <Botao variante="perigo" icone={iconeConfirmar} onClick={confirmar} disabled={enviando}>
            {enviando ? 'Aguarde…' : rotuloConfirmar}
          </Botao>
        </div>
      </div>
    </Modal>
  )
}
