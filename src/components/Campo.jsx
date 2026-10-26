import { useId, useState } from 'react'
import { IconeOlho, IconeOlhoFechado } from './Icones.jsx'

// Campo de formulário com rótulo em cima e mensagem de erro embaixo.
// multilinha={true} vira uma caixa de texto maior (textarea).
// icone={IconeEnvelope} mostra um ícone decorativo à esquerda.
// Campos type="password" ganham sozinhos o botão "olhinho" (mostrar/ocultar).
export default function Campo({ rotulo, erro, multilinha = false, opcional = false, icone: Icone, type, ...props }) {
  const id = useId() // liga o <label> ao campo (bom para acessibilidade)
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const Elemento = multilinha ? 'textarea' : 'input'
  const ehSenha = type === 'password' && !multilinha
  const temIcone = Icone && !multilinha

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {rotulo}
        {opcional && <span className="font-normal text-suave"> (opcional)</span>}
      </label>
      <div className="relative">
        {temIcone && (
          // Decorativo: o rótulo já diz o que é o campo, então leitores de tela ignoram
          <Icone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-suave" />
        )}
        <Elemento
          id={id}
          type={ehSenha && senhaVisivel ? 'text' : type}
          aria-invalid={erro ? true : undefined}
          className={[
            'w-full rounded-campo border bg-fundo text-sm text-texto',
            'placeholder:text-suave focus:outline-2 focus:outline-offset-0 focus:outline-destaque',
            multilinha ? 'min-h-24 py-2' : 'h-10',
            temIcone ? 'pl-9' : 'pl-3', // espaço para o ícone da esquerda
            ehSenha ? 'pr-11' : 'pr-3', // espaço para o olhinho da direita
            erro ? 'border-negativo' : 'border-controle',
          ].join(' ')}
          {...props}
        />
        {ehSenha && (
          <button
            type="button" // não envia o formulário ao clicar
            onClick={() => setSenhaVisivel(!senhaVisivel)}
            aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={senhaVisivel}
            className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-suave transition-colors hover:bg-ativo hover:text-texto focus-visible:outline-2 focus-visible:outline-destaque"
          >
            {senhaVisivel ? <IconeOlhoFechado className="h-4 w-4" /> : <IconeOlho className="h-4 w-4" />}
          </button>
        )}
      </div>
      {erro && <p className="text-xs text-negativo">{erro}</p>}
    </div>
  )
}
