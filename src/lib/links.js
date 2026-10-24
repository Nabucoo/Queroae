// Ajuda com os links de referência dos presentes.

// Antes de salvar: "amazon.com.br/x" vira "https://amazon.com.br/x".
// Devolve null se o campo estiver vazio, ou lança erro se não for um link web.
export function normalizarLink(texto) {
  const limpo = texto.trim()
  if (!limpo) return null
  const comProtocolo = /^[a-z][a-z0-9+.-]*:/i.test(limpo) ? limpo : `https://${limpo}`
  if (!linkSeguro(comProtocolo)) throw new Error('Use um link de site (começando com http:// ou https://).')
  return comProtocolo
}

// Antes de mostrar: só aceita http e https.
// Isso bloqueia links perigosos como "javascript:...", que rodariam código ao clicar.
export function linkSeguro(link) {
  try {
    const url = new URL(link)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// "https://www.amazon.com.br/produto/123" → "amazon.com.br"
export function dominio(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, '')
  } catch {
    return link
  }
}
