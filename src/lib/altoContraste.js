// Alto contraste, escolhido em Perfil > Aparência e acessibilidade.
// Sem escolha da pessoa, segue o ajuste do aparelho ("Aumentar contraste" no iPhone).
// Fica guardado no aparelho e vale também antes do login.
// As cores estão em src/index.css. O script no <head> do index.html repete a leitura
// abaixo para a tela não piscar ao abrir: se mudar a chave aqui, mude lá também.
import { aplicarTema, lerTema } from './tema.js'

const CHAVE = 'queroae:alto-contraste'
const PEDIDO_PELO_APARELHO = '(prefers-contrast: more)'

function lerEscolha() {
  try {
    return localStorage.getItem(CHAVE)
  } catch {
    return null // aparelho sem acesso ao armazenamento
  }
}

export function altoContrasteLigado() {
  const escolha = lerEscolha()
  if (escolha === 'ligado') return true
  if (escolha === 'desligado') return false
  return window.matchMedia(PEDIDO_PELO_APARELHO).matches
}

// O CSS olha o atributo na tag <html>. O tema entra junto por causa da cor da barra.
function aplicar() {
  if (altoContrasteLigado()) document.documentElement.dataset.contraste = 'alto'
  else delete document.documentElement.dataset.contraste
  aplicarTema(lerTema())
}

export function guardarAltoContraste(ligado) {
  try {
    localStorage.setItem(CHAVE, ligado ? 'ligado' : 'desligado')
  } catch {
    document.documentElement.dataset.contraste = ligado ? 'alto' : ''
    return // Sem armazenamento: vale até fechar o app
  }
  aplicar()
}

// Aplica ao abrir o app e acompanha o aparelho enquanto não houver escolha
export function iniciarAltoContraste() {
  aplicar()
  window.matchMedia(PEDIDO_PELO_APARELHO).addEventListener('change', aplicar)
}
