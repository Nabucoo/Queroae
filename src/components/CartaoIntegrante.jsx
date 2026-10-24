import { useCallback, useId, useState } from 'react'
import Avatar from './Avatar.jsx'
import ListaDoIntegrante from './ListaDoIntegrante.jsx'
import MinhaLista from './MinhaLista.jsx'
import { IconeSeta } from './Icones.jsx'

// Card de um integrante na aba Integrantes. Clicar abre/fecha a lista de presentes.
// A lista só é buscada na primeira vez que o card abre.
export default function CartaoIntegrante({ integrante, ehVoce, ehAdmin }) {
  const [aberto, setAberto] = useState(false)
  const [qtd, setQtd] = useState(integrante.presente[0]?.count ?? 0)
  const idConteudo = useId() // liga o botão ao conteúdo (acessibilidade)

  // Mantém a contagem certa depois de marcar/desmarcar (useCallback evita buscar em loop)
  const aoMudar = useCallback((lista) => setQtd(lista.length), [])

  const nome = integrante.usuario.nome

  return (
    <div className="rounded-2xl border border-borda bg-elevado">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        aria-controls={idConteudo}
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-painel focus-visible:outline-2 focus-visible:outline-destaque"
      >
        <Avatar nome={nome} id={integrante.id_usuario} />
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="truncate">
              {nome}
              {ehVoce && <span className="font-normal text-suave"> (você)</span>}
            </span>
            {ehAdmin && <span className="shrink-0 rounded-full bg-ativo px-2 py-0.5 text-xs font-normal text-suave">Admin</span>}
          </p>
          <p className="num mt-0.5 text-xs text-suave">
            {ehVoce ? 'Sua lista' : qtd === 1 ? '1 presente' : `${qtd} presentes`}
          </p>
        </div>
        <IconeSeta className={`ml-auto h-4 w-4 shrink-0 text-suave transition-transform ${aberto ? 'rotate-90' : ''}`} />
      </button>

      {/* Só monta a lista quando abre: assim os presentes são buscados sob demanda */}
      {aberto && (
        <div id={idConteudo} className="border-t border-linha px-4 pt-4 pb-4">
          {ehVoce ? (
            // Regra da surpresa: no seu próprio card, a lista de dono (sem escolhas)
            <MinhaLista idUsuarioGrupo={integrante.id_usuario_grupo} />
          ) : (
            <ListaDoIntegrante idUsuarioGrupo={integrante.id_usuario_grupo} nome={nome} onMudou={aoMudar} />
          )}
        </div>
      )}
    </div>
  )
}
