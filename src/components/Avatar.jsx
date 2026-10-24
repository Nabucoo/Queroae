// Círculo com as iniciais da pessoa (o projeto não usa foto).
// Cada pessoa ganha sempre a mesma cor de "confete", calculada a partir do id.
const confetes = [
  'bg-confete-1 text-confete-1-tinta',
  'bg-confete-2 text-confete-2-tinta',
  'bg-confete-3 text-confete-3-tinta',
  'bg-confete-4 text-confete-4-tinta',
  'bg-confete-5 text-confete-5-tinta',
  'bg-confete-6 text-confete-6-tinta',
]

const tamanhos = {
  p: 'h-8 w-8 text-xs',
  m: 'h-12 w-12 text-base',
  g: 'h-20 w-20 text-2xl',
}

// "Maria Clara Souza" → "MS"; "Lucas" → "L"
export function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  const primeira = partes[0][0]
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

// Transforma o id num número de 0 a 5 (sempre o mesmo para o mesmo id)
function indiceDaCor(id = '') {
  let soma = 0
  for (const letra of String(id)) soma = (soma * 31 + letra.charCodeAt(0)) % 9973
  return soma % confetes.length
}

export default function Avatar({ nome, id, tamanho = 'm' }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        tamanhos[tamanho],
        confetes[indiceDaCor(id ?? nome)],
      ].join(' ')}
    >
      {iniciais(nome)}
    </span>
  )
}
