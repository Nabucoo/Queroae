// Guarda no aparelho o código do convite enquanto a pessoa faz login ou cadastro.
// A Home lê o código depois do login e abre a janela do pedido.
// try/catch: o navegador pode bloquear o armazenamento (ex.: modo privado);
// nesse caso o app só não lembra o convite, e a pessoa pode abrir o link de novo.
const CHAVE = 'queroae:convite-pendente'

export function guardarConvitePendente(codigo) {
  try {
    localStorage.setItem(CHAVE, codigo)
  } catch {
    // sem armazenamento: segue sem lembrar
  }
}

export function lerConvitePendente() {
  try {
    return localStorage.getItem(CHAVE)
  } catch {
    return null
  }
}

export function limparConvitePendente() {
  try {
    localStorage.removeItem(CHAVE)
  } catch {
    // sem armazenamento: nada a limpar
  }
}
