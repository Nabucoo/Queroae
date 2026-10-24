// Traduz os erros do Supabase para mensagens amigáveis em português.
const porCodigo = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).',
  user_already_exists: 'Já existe uma conta com este e-mail.',
  email_exists: 'Já existe uma conta com este e-mail.',
  weak_password: 'Senha fraca: use pelo menos 6 caracteres.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  over_email_send_rate_limit: 'Muitos e-mails enviados. Aguarde alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  validation_failed: 'Confira os dados digitados.',
  email_provider_disabled: 'Cadastro por e-mail desativado no momento. Tente mais tarde.',
  signup_disabled: 'Novos cadastros estão desativados no momento. Tente mais tarde.',
  session_not_found: 'Sua sessão expirou. Entre novamente.',
  // Erros do banco (Postgres)
  23505: 'Esse registro já existe.',
  42501: 'Você não tem permissão para fazer isso.',
}

export function mensagemDeErro(erro) {
  if (!erro) return ''
  if (porCodigo[erro.code]) return porCodigo[erro.code]
  // P0001 = mensagem escrita por nós nas funções do banco (já em português)
  if (erro.code === 'P0001') return erro.message
  if (erro.message === 'Failed to fetch') return 'Sem conexão com o servidor. Verifique sua internet.'
  console.error(erro) // ajuda a investigar erros que ainda não traduzimos
  return 'Algo deu errado. Tente novamente.'
}
