// Marca do QueroAê: o balão do "Quero!" embrulhado como presente, com laço coral.
// Versão simplificada (sem confetes), que fica nítida em tamanhos pequenos.
// Os arquivos para reutilizar fora do app estão em public/marca/.
// mostrarNome={false} mostra só o símbolo.
export default function Logo({ mostrarNome = true }) {
  return (
    <span className="inline-flex items-center gap-2 text-texto">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
        {/* balão de fala */}
        <path
          d="M18 14h30a10 10 0 0 1 10 10v16a10 10 0 0 1-10 10H26l-12 9 2-9.4A10 10 0 0 1 8 40V24a10 10 0 0 1 10-10z"
          className="fill-destaque"
        />
        {/* fitas do embrulho */}
        <rect x="31" y="14" width="4" height="36" className="fill-fundo" />
        <rect x="8" y="30" width="50" height="4" className="fill-fundo" />
        {/* laço: duas voltas de fita e o nó */}
        <g className="stroke-laco" fill="none" strokeWidth="3" strokeLinejoin="round">
          <path d="M33 12.5C28 4 19 4 19.5 9.5C20 14 28 13.5 33 12.5Z" />
          <path d="M33 12.5C38 4 47 4 46.5 9.5C46 14 38 13.5 33 12.5Z" />
        </g>
        <rect x="30.5" y="9.5" width="5" height="6" rx="2" className="fill-laco" />
      </svg>
      {mostrarNome && <span className="text-lg font-semibold">QueroAê</span>}
    </span>
  )
}
