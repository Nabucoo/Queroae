// Marca do QueroAê: uma etiqueta de presente + o nome.
// mostrarNome={false} mostra só o símbolo.
export default function Logo({ mostrarNome = true }) {
  return (
    <span className="inline-flex items-center gap-2 text-texto">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path
          d="M11 6h15a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H11l-7-10z"
          className="fill-destaque"
        />
        <circle cx="11.5" cy="16" r="2.2" className="fill-fundo" />
      </svg>
      {mostrarNome && <span className="text-lg font-semibold">QueroAê</span>}
    </span>
  )
}
