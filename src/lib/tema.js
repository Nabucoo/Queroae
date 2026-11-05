// Aparência escolhida em Perfil > Aparência e acessibilidade: claro, escuro ou automático.
// Fica guardada no aparelho, como o tamanho do texto, e vale também antes do login.
// As cores do tema escuro estão em src/index.css. O script no <head> do index.html
// repete a leitura abaixo para a tela não piscar em branco ao abrir: se mudar a
// chave aqui, mude lá também.
const CHAVE = 'queroae:tema'
const ESCURO_NO_SISTEMA = '(prefers-color-scheme: dark)'

// Cor da barra do navegador em cada tema
const COR_DA_BARRA = { claro: '#2552c4', escuro: '#141413' }

export const TEMA_PADRAO = 'automatico'

export const TEMAS = [
  { id: 'claro', rotulo: 'Claro' },
  { id: 'escuro', rotulo: 'Escuro' },
  { id: 'automatico', rotulo: 'Automático' },
]

export function lerTema() {
  try {
    const guardado = localStorage.getItem(CHAVE)
    return TEMAS.some((t) => t.id === guardado) ? guardado : TEMA_PADRAO
  } catch {
    return TEMA_PADRAO // aparelho sem acesso ao armazenamento
  }
}

// O CSS olha o atributo na tag <html>; sem ele, vale o tema claro
export function aplicarTema(id) {
  const escuro = id === 'escuro' || (id === 'automatico' && window.matchMedia(ESCURO_NO_SISTEMA).matches)
  if (escuro) document.documentElement.dataset.tema = 'escuro'
  else delete document.documentElement.dataset.tema
  const altoContraste = document.documentElement.dataset.contraste === 'alto'
  const cor = altoContraste ? (escuro ? '#000000' : '#ffffff') : escuro ? COR_DA_BARRA.escuro : COR_DA_BARRA.claro
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', cor)
}

export function guardarTema(id) {
  aplicarTema(id)
  try {
    localStorage.setItem(CHAVE, id)
  } catch {
    // Sem armazenamento: vale até fechar o app
  }
}

// Aplica ao abrir o app e acompanha o celular, se a escolha for "Automático"
export function iniciarTema() {
  aplicarTema(lerTema())
  window.matchMedia(ESCURO_NO_SISTEMA).addEventListener('change', () => aplicarTema(lerTema()))
}
