// O que a pessoa digitou no cadastro enquanto ela lê a política de privacidade.
// Fica só na memória, de propósito: tem a senha, e nada disso pode ir para o
// armazenamento do navegador. Recarregar ou fechar a página apaga tudo.
let rascunho = null

export function guardarRascunhoCadastro(dados) {
  rascunho = dados
}

export function lerRascunhoCadastro() {
  return rascunho
}

export function limparRascunhoCadastro() {
  rascunho = null
}
