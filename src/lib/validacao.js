import { mensagemDeErro } from './erros.js'

// Regras repetidas nos formulários. Cada uma devolve a mensagem de erro, no formato
// "o que aconteceu + o que fazer", ou undefined se estiver tudo certo.
const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const TAMANHO_MINIMO_DA_SENHA = 8

export function erroDeEmail(email, seVazio = 'Digite seu e-mail.') {
  if (!email.trim()) return seVazio
  if (!FORMATO_DE_EMAIL.test(email.trim())) return mensagemDeErro({ code: 'validation_failed' })
}

export function erroDeSenhaNova(senha, seVazia = 'Crie uma senha com pelo menos 8 caracteres.') {
  if (!senha) return seVazia
  if (senha.length < TAMANHO_MINIMO_DA_SENHA) return 'A senha está curta. Use pelo menos 8 caracteres.'
}

export function erroDeRepeticao(senha, repetida) {
  if (!repetida) return 'Repita a senha para confirmar.'
  if (senha !== repetida) return 'As senhas não são iguais. Toque no olho para conferir o que digitou.'
}

export function erroDeNomeDoGrupo(nome) {
  if (!nome.trim()) return 'Dê um nome ao grupo. É assim que as pessoas vão reconhecê-lo.'
}

// Tira do objeto os campos sem erro: { nome: undefined } vira {}
export function soErros(erros) {
  return Object.fromEntries(Object.entries(erros).filter(([, mensagem]) => mensagem))
}
