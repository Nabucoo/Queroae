import { useId } from 'react'

// Campo de formulário com rótulo em cima e mensagem de erro embaixo.
// multilinha={true} vira uma caixa de texto maior (textarea).
export default function Campo({ rotulo, erro, multilinha = false, opcional = false, ...props }) {
  const id = useId() // liga o <label> ao campo (bom para acessibilidade)
  const Elemento = multilinha ? 'textarea' : 'input'

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {rotulo}
        {opcional && <span className="font-normal text-suave"> (opcional)</span>}
      </label>
      <Elemento
        id={id}
        aria-invalid={erro ? true : undefined}
        className={[
          'w-full rounded-campo border bg-fundo px-3 text-sm text-texto',
          'placeholder:text-suave focus:outline-2 focus:outline-offset-0 focus:outline-destaque',
          multilinha ? 'min-h-24 py-2' : 'h-10',
          erro ? 'border-negativo' : 'border-controle',
        ].join(' ')}
        {...props}
      />
      {erro && <p className="text-xs text-negativo">{erro}</p>}
    </div>
  )
}
