import { Link, useLocation } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'
import { EMAIL_CONTATO } from '../lib/contato.js'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import Cartao from '../components/Cartao.jsx'
import Painel from '../components/Painel.jsx'
import { IconeSeta, IconeVoltar } from '../components/Icones.jsx'

// De onde se pode abrir a ajuda (os botões mandam state={{ de: '...' }}).
const ORIGENS = {
  home: { para: '/', rotulo: 'Voltar para o início' },
  presentes: { para: '/?aba=presentes', rotulo: 'Voltar para o início' },
  perfil: { para: '/perfil', rotulo: 'Voltar para o perfil' },
}

// As perguntas vêm agrupadas por tarefa. "aberta" deixa a resposta visível ao entrar:
// a primeira dúvida de quem chega e a regra principal do app.
// Ao mudar uma regra do app, confira se a resposta daqui continua certa.
const GRUPOS = [
  {
    titulo: 'Grupos',
    perguntas: [
      {
        pergunta: 'Como entro em um grupo?',
        aberta: true,
        resposta: <>Abra o link que recebeu ou, na tela inicial, toque em <Destaque>Adicionar</Destaque> e depois em <Destaque>Tenho um código</Destaque>. Em seguida, o admin do grupo aprova seu pedido.</>,
      },
      {
        pergunta: 'Por que preciso de aprovação?',
        resposta: 'Para só entrar quem o admin do grupo conhece. Ele vê seu nome e seu e-mail para decidir. O app não manda notificação, então avise quem te convidou.',
      },
      {
        pergunta: 'Meu pedido não foi aprovado. E agora?',
        resposta: 'Se foi engano, fale com quem te convidou. Para pedir de novo, dispense o aviso na tela inicial e abra o convite outra vez.',
      },
      {
        pergunta: 'Como crio um grupo?',
        resposta: <>Na tela inicial, toque em <Destaque>Adicionar</Destaque> e depois em <Destaque>Criar um grupo</Destaque>. Quem cria o grupo é o admin dele.</>,
      },
      {
        pergunta: 'Como convido alguém?',
        resposta: <>Dentro do grupo, toque em <Destaque>Compartilhar</Destaque> para mandar o convite, ou passe o código que aparece ao lado.</>,
      },
      {
        pergunta: 'Como saio de um grupo?',
        resposta: 'Dentro do grupo, toque no botão vermelho de sair, no topo. Sua lista daquele grupo é apagada, e os presentes que você escolheu voltam a ficar livres. O admin não tem essa opção, mas pode excluir o grupo.',
      },
    ],
  },
  {
    titulo: 'Presentes',
    perguntas: [
      {
        pergunta: 'Como monto minha lista?',
        resposta: <>Dentro do grupo, abra <Destaque>Minha lista de presentes</Destaque> e toque em <Destaque>Adicionar novo presente</Destaque>. Cada grupo tem a sua lista.</>,
      },
      {
        pergunta: 'Como marco o que vou comprar?',
        resposta: <>Dentro do grupo, toque no nome da pessoa e em <Destaque>Vou comprar</Destaque>. O presente aparece na aba <Destaque>Vou comprar</Destaque> da tela inicial.</>,
      },
      {
        pergunta: 'Mudei de ideia. Como desmarco?',
        resposta: <>Na lista da pessoa, toque em <Destaque>Desmarcar</Destaque>. O presente volta a ficar livre para os outros.</>,
      },
    ],
  },
  {
    titulo: 'Surpresa',
    perguntas: [
      {
        pergunta: 'Consigo ver quem escolheu meus presentes?',
        aberta: true,
        resposta: 'Não. Na sua lista, você nunca vê se um presente foi escolhido nem por quem. É assim que a surpresa fica garantida.',
      },
      {
        pergunta: 'Quem vê as escolhas, então?',
        resposta: 'Os outros integrantes do grupo. Assim, duas pessoas não compram o mesmo presente.',
      },
    ],
  },
  {
    titulo: 'Conta',
    perguntas: [
      {
        pergunta: 'Esqueci minha senha. O que faço?',
        resposta: <>Na tela de entrar, toque em <Destaque>Esqueceu a senha?</Destaque>.</>,
      },
      {
        pergunta: 'Como mudo o tamanho do texto, a aparência ou o contraste?',
        resposta: <>No Perfil, em <Destaque>Aparência e acessibilidade</Destaque>. A mudança vale na hora e fica salva no aparelho.</>,
      },
      {
        pergunta: 'Como apago minha conta?',
        resposta: <>No Perfil, toque em <Destaque>Apagar minha conta</Destaque>. Não dá para desfazer. Se você for admin, o grupo passa para outra pessoa ou, se só houver você, é excluído. O app mostra o que vai acontecer antes de você confirmar.</>,
      },
    ],
  },
]

// Perguntas frequentes. Aberta para todos, logados ou não, como a política de privacidade.
export default function Ajuda() {
  const { sessao } = useAuth()
  const de = useLocation().state?.de
  // Volta para a tela de onde veio; sem origem (endereço digitado), vai para o início
  const voltar = ORIGENS[de] ?? { para: sessao ? '/' : '/boas-vindas', rotulo: 'Voltar para o início' }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <Cabecalho
        voltar={
          <BotaoIcone as={Link} to={voltar.para} rotulo={voltar.rotulo}>
            <IconeVoltar className="h-5 w-5" />
          </BotaoIcone>
        }
      />

      <main>
        <h1 className="mt-6 text-titulo font-semibold">Perguntas frequentes</h1>

        {GRUPOS.map((grupo) => (
          <section key={grupo.titulo} className="mt-6">
            <h2 className="mb-3 text-corpo font-semibold">{grupo.titulo}</h2>
            <ul className="flex flex-col gap-2">
              {grupo.perguntas.map((item) => (
                <li key={item.pergunta}><Pergunta {...item} /></li>
              ))}
            </ul>
          </section>
        ))}

        <Painel className="mt-6">
          <h2 className="text-corpo font-semibold">Não achou sua resposta?</h2>
          <p className="mt-1 text-apoio text-suave">
            Escreva para a gente:{' '}
            <a href={`mailto:${EMAIL_CONTATO}`} className="break-all link">{EMAIL_CONTATO}</a>
          </p>
        </Painel>
      </main>
    </div>
  )
}

// <details> é o abre e fecha do próprio navegador: já funciona com teclado e leitor de tela
function Pergunta({ pergunta, resposta, aberta = false }) {
  return (
    <Cartao as="details" open={aberta} className="group">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 font-medium focus-visible:outline-2 focus-visible:outline-destaque [&::-webkit-details-marker]:hidden">
        {pergunta}
        <IconeSeta className="h-4 w-4 shrink-0 text-suave transition-transform group-open:rotate-90" />
      </summary>
      <p className="border-t border-linha px-4 pt-3 pb-4 text-apoio text-suave">{resposta}</p>
    </Cartao>
  )
}

// Nome de um botão ou de uma tela dentro da resposta
function Destaque({ children }) {
  return <strong className="font-medium text-texto">{children}</strong>
}
