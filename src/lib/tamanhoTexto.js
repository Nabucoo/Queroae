// Tamanho do texto escolhido em Perfil > Aparência e acessibilidade.
// Fica guardado no aparelho: quem precisa de letra maior precisa dela também na
// tela de login, antes de entrar na conta.
// Os tamanhos de cada nível estão em src/index.css.
const CHAVE = 'queroae:tamanho-texto'

export const TAMANHO_PADRAO = 'medio'

// amostra: tamanho do corpo do texto em cada nível, para o "Aa" das opções
export const TAMANHOS_TEXTO = [
  { id: 'pequeno', rotulo: 'Pequeno', amostra: 'calc(15rem / 16)' },
  { id: 'medio', rotulo: 'Médio', amostra: 'calc(17rem / 16)' },
  { id: 'grande', rotulo: 'Grande', amostra: 'calc(19rem / 16)' },
  { id: 'muito-grande', rotulo: 'Muito grande', amostra: 'calc(23rem / 16)' },
]

export function lerTamanhoTexto() {
  try {
    const guardado = localStorage.getItem(CHAVE)
    return TAMANHOS_TEXTO.some((t) => t.id === guardado) ? guardado : TAMANHO_PADRAO
  } catch {
    return TAMANHO_PADRAO // aparelho sem acesso ao armazenamento
  }
}

// Muda o texto do app inteiro: o CSS olha este atributo na tag <html>
export function aplicarTamanhoTexto(id) {
  if (id === TAMANHO_PADRAO) delete document.documentElement.dataset.tamanhoTexto
  else document.documentElement.dataset.tamanhoTexto = id
}

export function guardarTamanhoTexto(id) {
  aplicarTamanhoTexto(id)
  try {
    localStorage.setItem(CHAVE, id)
  } catch {
    // Sem armazenamento: vale até fechar o app
  }
}
