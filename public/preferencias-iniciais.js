// Aplica o tema e o alto contraste antes da primeira pintura, para a tela não piscar.
// Fica em um arquivo, e não dentro do index.html, porque a política de segurança do
// site (vercel.json) não permite scripts embutidos na página.
// O restante da lógica está em src/lib/tema.js e src/lib/altoContraste.js.
try {
  var tema = localStorage.getItem('queroae:tema')
  if (tema === 'escuro' || (tema !== 'claro' && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.dataset.tema = 'escuro'
  }
  var contraste = localStorage.getItem('queroae:alto-contraste')
  if (contraste === 'ligado' || (contraste !== 'desligado' && matchMedia('(prefers-contrast: more)').matches)) {
    document.documentElement.dataset.contraste = 'alto'
  }
} catch {
  // Sem acesso ao armazenamento: o app confere de novo ao abrir
}
