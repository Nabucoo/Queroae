import { useId, useState } from 'react'
import Avatar from './Avatar.jsx'
import Cartao from './Cartao.jsx'
import ListaDoIntegrante from './ListaDoIntegrante.jsx'
import { resumoPresentes } from '../lib/resumoPresentes.js'
import { IconeSeta } from './Icones.jsx'

// Card de OUTRO integrante na aba Integrantes (você não aparece lá).
// Clicar abre/fecha a lista de presentes.
// A lista só é buscada na primeira vez que o card abre.
export default function CartaoIntegrante({ integrante, ehAdmin }) {
  const [aberto, setAberto] = useState(false)
  const [presentes, setPresentes] = useState(integrante.presente)
  const idConteudo = useId() // liga o botão ao conteúdo (acessibilidade)

  const nome = integrante.usuario.nome

  return (
    <Cartao>
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        aria-controls={idConteudo}
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-painel focus-visible:outline-2 focus-visible:outline-destaque"
      >
        <Avatar nome={nome} id={integrante.id_usuario} />
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-corpo font-medium">
            <span className="truncate">{nome}</span>
            {ehAdmin && <span className="shrink-0 rounded-full bg-ativo px-2 py-0.5 contraste:border contraste:border-texto text-selo font-normal text-suave">Admin</span>}
          </p>
          <p className="num mt-0.5 text-nota text-suave">
            {resumoPresentes(presentes)}
          </p>
        </div>
        <IconeSeta className={`ml-auto h-4 w-4 shrink-0 text-suave transition-transform ${aberto ? 'rotate-90' : ''}`} />
      </button>

      {/* Só monta a lista quando abre: assim os presentes são buscados sob demanda */}
      {aberto && (
        <div id={idConteudo} className="border-t border-linha px-4 pt-4 pb-4">
          <ListaDoIntegrante idUsuarioGrupo={integrante.id_usuario_grupo} nome={nome} onMudou={setPresentes} />
        </div>
      )}
    </Cartao>
  )
}
