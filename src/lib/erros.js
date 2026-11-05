// Traduz os erros do Supabase para mensagens amigáveis em português.
// Formato (H9): o que aconteceu + o que fazer.
const porCodigo = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).',
  user_already_exists: 'Já existe uma conta com este e-mail. Entre pela tela de login ou use outro e-mail.',
  email_exists: 'Já existe uma conta com este e-mail. Entre pela tela de login ou use outro e-mail.',
  weak_password: 'Senha fraca: use pelo menos 8 caracteres.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  over_email_send_rate_limit: 'Muitos e-mails enviados. Aguarde alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  // No cadastro e no "esqueci a senha", aparece quando o e-mail está em formato inválido
  validation_failed: 'Este e-mail não parece válido. Confira se está escrito certo (ex.: nome@exemplo.com).',
  email_provider_disabled: 'Cadastro por e-mail desativado no momento. Tente mais tarde.',
  signup_disabled: 'Novos cadastros estão desativados no momento. Tente mais tarde.',
  session_not_found: 'Sua sessão expirou. Entre novamente.',
  // Erros do banco (Postgres)
  23505: 'Esse registro já existe.',
  23514: 'Algum texto ficou longo demais. Encurte e tente de novo.', // limite de tamanho do banco
  42501: 'Você não tem permissão para fazer isso.',
}

// Erros que são "culpa" de um campo do formulário: a mensagem aparece embaixo
// dele, e não no aviso geral (H9). Devolve o nome do campo, ou null.
const campoPorCodigo = {
  user_already_exists: 'email',
  email_exists: 'email',
  weak_password: 'senha',
  validation_failed: 'email',
}

export function campoDoErro(erro) {
  return campoPorCodigo[erro?.code] ?? null
}

// Cada navegador descreve a falha de rede de um jeito, e o Supabase pode acrescentar
// "TypeError: " na frente. "Load failed" é a mensagem do iPhone.
const TEXTOS_DE_CONEXAO = ['Failed to fetch', 'Load failed', 'NetworkError when attempting to fetch resource.']

// O pedido nem chegou ao servidor: sem internet ou servidor fora do ar
export function ehFalhaDeConexao(erro) {
  if (!erro) return false
  if (erro.name === 'FunctionsFetchError') return true
  if (erro.name === 'AuthRetryableFetchError' && erro.status === 0) return true
  return TEXTOS_DE_CONEXAO.includes((erro.message ?? '').replace(/^TypeError: /, ''))
}

export function mensagemDeErro(erro) {
  if (!erro) return ''
  if (porCodigo[erro.code]) return porCodigo[erro.code]
  // P0001 = mensagem escrita por nós nas funções do banco (já em português)
  if (erro.code === 'P0001') return erro.message
  if (ehFalhaDeConexao(erro)) return 'Sem conexão com o servidor. Confira sua internet e tente de novo.'
  console.error(erro) // ajuda a investigar erros que ainda não traduzimos
  return 'Não foi possível concluir agora. Espere um instante e tente de novo.'
}
