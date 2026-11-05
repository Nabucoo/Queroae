// "3 presentes · 1 livre": resumo da lista de OUTRA pessoa.
// REGRA DA SURPRESA: nunca usar na lista da própria pessoa. O banco não entrega ao
// dono as escolhas dos presentes dele, então os dele sempre pareceriam livres.
// escolha_presente pode vir como objeto, lista ou null, conforme a consulta.
export function resumoPresentes(presentes) {
  const total = presentes.length
  if (total === 0) return 'Nenhum presente'

  const livres = presentes.filter((p) => [p.escolha_presente].flat().filter(Boolean).length === 0).length
  const quantidade = total === 1 ? '1 presente' : `${total} presentes`
  if (livres === 0) return `${quantidade} · ${total === 1 ? 'já escolhido' : 'todos escolhidos'}`
  return `${quantidade} · ${livres === 1 ? '1 livre' : `${livres} livres`}`
}
