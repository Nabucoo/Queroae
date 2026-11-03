import { Link } from 'react-router'
import TelaAuth from '../components/TelaAuth.jsx'
import Botao from '../components/Botao.jsx'
import { IconeCasa } from '../components/Icones.jsx'

// Aparece quando o endereço não existe (ex.: /qualquercoisa)
export default function NaoEncontrada() {
  return (
    <TelaAuth
      titulo="Página não encontrada"
      subtitulo="Esse endereço não existe ou mudou. Volte para o início e continue de lá."
    >
      <Botao as={Link} to="/" icone={IconeCasa}>Ir para o início</Botao>
    </TelaAuth>
  )
}
