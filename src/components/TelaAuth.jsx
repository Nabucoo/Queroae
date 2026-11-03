import { Link } from 'react-router'
import Cabecalho, { BotaoIcone } from './Cabecalho.jsx'
import { IconeVoltar } from './Icones.jsx'

// Moldura comum das telas de login, cadastro, senha e "página não encontrada".
// voltar={{ para: '/login', rotulo: 'Voltar para o login' }} mostra a seta de
// voltar no topo: a saída visível para quem entrou na tela errada.
// O cabeçalho fica preso no topo (igual às telas logadas) e o conteúdo vem logo
// abaixo, com um espaço fixo: assim ele não fica solto no meio de celulares altos
// e continua visível quando o teclado abre (o teclado cobre a parte de baixo).
export default function TelaAuth({ titulo, subtitulo, children, rodape, voltar }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col px-4">
      <Cabecalho
        voltar={voltar && (
          <BotaoIcone as={Link} to={voltar.para} rotulo={voltar.rotulo}>
            <IconeVoltar className="h-5 w-5" />
          </BotaoIcone>
        )}
      />
      <main className="pt-8 pb-10">
        <h1 className="text-2xl font-semibold">{titulo}</h1>
        {subtitulo && <p className="mt-2 text-sm text-suave">{subtitulo}</p>}
        {children && <div className="mt-6">{children}</div>}
        {rodape && <div className="mt-6 flex flex-col gap-3 text-sm">{rodape}</div>}
      </main>
    </div>
  )
}

// Caixa de aviso (erro em vermelho, informação em cinza)
export function Aviso({ tipo = 'erro', children }) {
  if (!children) return null
  const cor = tipo === 'erro' ? 'bg-negativo-claro text-negativo' : 'bg-painel text-texto'
  return (
    <p role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-campo px-3 py-2 text-sm ${cor}`}>
      {children}
    </p>
  )
}
