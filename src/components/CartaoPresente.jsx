import { linkSeguro, dominio } from '../lib/links.js'

// Um presente da lista: nome, descrição e link.
// "acoes" é o espaço dos botões (editar/remover, ou "vou comprar" na etapa 7).
// riscado e rodape servem para a página de outro integrante.
export default function CartaoPresente({ presente, acoes, riscado = false, rodape }) {
  const temLink = presente.link && linkSeguro(presente.link)

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-borda bg-elevado p-4 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <h3 className={`text-corpo font-medium break-words ${riscado ? 'text-suave line-through' : ''}`}>
          {presente.nome}
        </h3>
        {presente.descricao && (
          <p className="mt-1 text-apoio whitespace-pre-line break-words text-suave">{presente.descricao}</p>
        )}
        {temLink && (
          <a
            href={presente.link}
            target="_blank"
            rel="noopener noreferrer" // a página aberta não consegue mexer na nossa
            className="mt-2 inline-block text-corpo font-medium text-destaque hover:underline"
          >
            Ver referência em {dominio(presente.link)}
          </a>
        )}
        {rodape}
      </div>
      {acoes && <div className="flex shrink-0 flex-wrap gap-2">{acoes}</div>}
    </article>
  )
}
