import Modal from './Modal.jsx'
import Avatar from './Avatar.jsx'
import Botao from './Botao.jsx'
import { IconePessoaMenos } from './Icones.jsx'

// Só o admin abre esta janela (Editar grupo › Gerenciar integrantes).
// Lista os OUTROS integrantes; "Remover" pede confirmação antes de agir.
export default function ModalIntegrantes({ aberto, onFechar, onVoltar, integrantes, onPedirRemocao }) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Gerenciar integrantes">
      {integrantes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-controle px-4 py-3 text-sm text-suave">
          Ainda não há outros integrantes no grupo.
        </p>
      ) : (
        <ul className="flex flex-col">
          {integrantes.map((p) => (
            <li key={p.id_usuario} className="flex items-center gap-3 border-b border-linha py-3 last:border-0">
              <Avatar nome={p.usuario.nome} id={p.id_usuario} tamanho="p" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.usuario.nome}</span>
              <Botao variante="perigo" icone={IconePessoaMenos} onClick={() => onPedirRemocao(p)}>
                Remover
              </Botao>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5 flex justify-end">
        <Botao variante="texto" onClick={onVoltar}>Voltar</Botao>
      </div>
    </Modal>
  )
}
