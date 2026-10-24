// Explosão de confetes saindo de um elemento (ex.: o botão "Vou comprar").
// Usa a Web Animations API do próprio navegador, sem biblioteca.
// Os confetes ficam numa camada fixa por cima da página, então a animação
// continua mesmo que o botão suma da tela logo depois.

const CORES = ['#e8775a', '#e0a526', '#3fb39a', '#e06a9e', '#2552c4', '#4a9fd8'] // logo e confetes do app
const QUANTIDADE = 26

const aleatorio = (min, max) => min + Math.random() * (max - min)

export function soltarConfetes(elemento) {
  // Respeita quem pediu "reduzir movimento" nas configurações do sistema
  if (!elemento || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return []

  // Ponto de partida: o centro do botão
  const caixa = elemento.getBoundingClientRect()
  const camada = document.createElement('div')
  camada.setAttribute('aria-hidden', 'true')
  Object.assign(camada.style, {
    position: 'fixed',
    left: `${caixa.left + caixa.width / 2}px`,
    top: `${caixa.top + caixa.height / 2}px`,
    width: '0',
    height: '0',
    pointerEvents: 'none', // não atrapalha cliques
    zIndex: '9999',
  })
  document.body.appendChild(camada)

  const animacoes = []
  for (let i = 0; i < QUANTIDADE; i++) {
    const pedaco = document.createElement('span')
    const redondo = Math.random() < 0.35
    Object.assign(pedaco.style, {
      position: 'absolute',
      width: redondo ? '7px' : '6px',
      height: redondo ? '7px' : '10px',
      borderRadius: redondo ? '50%' : '1.5px',
      background: CORES[i % CORES.length],
      left: '-3px',
      top: '-4px',
    })
    camada.appendChild(pedaco)

    // Cada pedaço sai num ângulo para cima, sobe, e cai com a "gravidade"
    const angulo = aleatorio(-160, -20) * (Math.PI / 180)
    const forca = aleatorio(60, 130)
    const x = Math.cos(angulo) * forca
    const y = Math.sin(angulo) * forca
    const giro = aleatorio(-540, 540)

    animacoes.push(
      pedaco.animate(
        [
          // explosão: sai rápido e desacelera
          { transform: 'translate(0, 0) rotate(0deg) scale(0.6)', opacity: 1, easing: 'cubic-bezier(0.15, 0.8, 0.35, 1)' },
          // queda: começa devagar e acelera (gravidade), ainda bem visível
          { transform: `translate(${x}px, ${y}px) rotate(${giro / 2}deg) scale(1)`, opacity: 1, offset: 0.35, easing: 'cubic-bezier(0.5, 0, 0.9, 0.6)' },
          { transform: `translate(${x * 1.2}px, ${y + 70}px) rotate(${giro * 0.8}deg) scale(1)`, opacity: 1, offset: 0.8 },
          // e só some no final
          { transform: `translate(${x * 1.3}px, ${y + 100}px) rotate(${giro}deg) scale(0.9)`, opacity: 0 },
        ],
        { duration: aleatorio(1000, 1400), fill: 'forwards' }, // ritmo de cada trecho definido acima
      ),
    )
  }

  // Quando todos terminarem, remove a camada da página
  Promise.all(animacoes.map((a) => a.finished)).then(() => camada.remove()).catch(() => camada.remove())
  return animacoes
}
