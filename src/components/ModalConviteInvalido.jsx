import Modal from './Modal.jsx'
import Botao from './Botao.jsx'

// Aviso de link de convite inválido. Abre por cima da tela em que a pessoa já
// está: a Home, se ela está logada, ou as boas-vindas, se não está.
export default function ModalConviteInvalido({ onFechar }) {
  return (
    <Modal aberto onFechar={onFechar} titulo="Este convite não é válido">
      <p className="text-left text-sm text-suave">
        O grupo pode ter sido excluído ou o link veio incompleto. Peça um novo link para quem convidou você.
      </p>
      <div className="mt-6 flex justify-end">
        <Botao onClick={onFechar}>Entendi</Botao>
      </div>
    </Modal>
  )
}
