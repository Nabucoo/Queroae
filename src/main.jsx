import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { aplicarTamanhoTexto, lerTamanhoTexto } from './lib/tamanhoTexto.js'
import { iniciarTema } from './lib/tema.js'

// Antes de desenhar a primeira tela, para o texto não mudar de tamanho na frente da pessoa
aplicarTamanhoTexto(lerTamanhoTexto())
iniciarTema()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
