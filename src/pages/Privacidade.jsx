import { Link, useLocation } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'
import Cabecalho, { BotaoIcone } from '../components/Cabecalho.jsx'
import { IconeVoltar } from '../components/Icones.jsx'

// E-mail do app para dúvidas sobre dados. Enquanto vazio, a seção "Contato" não aparece.
const EMAIL_CONTATO = 'queroae.app@gmail.com'

// De onde se pode abrir a política (os links mandam state={{ de: '...' }}).
const ORIGENS = {
  'boas-vindas': { para: '/boas-vindas', rotulo: 'Voltar para o início' },
  cadastro: { para: '/cadastro', rotulo: 'Voltar para o cadastro' },
  perfil: { para: '/perfil', rotulo: 'Voltar para o perfil' },
}

// Política de privacidade em linguagem simples (LGPD).
// Aberta para todos, logados ou não.
export default function Privacidade() {
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
      <main className="mt-6">
        <h1 className="text-2xl font-semibold">Política de privacidade</h1>
        <p className="mt-2 text-sm text-suave">Atualizada em 4 de novembro de 2026.</p>

        <p className="mt-6 text-base">
          O QueroAê é um projeto pessoal para organizar listas de presentes entre família e amigos. Aqui explicamos,
          sem juridiquês, quais dados guardamos e como você controla cada um deles.
        </p>

        <Secao titulo="O que guardamos">
          <ul className="list-disc space-y-1 pl-5">
            <li>Seu <strong>nome</strong> e seu <strong>e-mail</strong>, informados no cadastro.</li>
            <li>Os <strong>grupos</strong> de que você participa e os <strong>pedidos para entrar</strong> em um grupo.</li>
            <li>Sua <strong>lista de presentes</strong> em cada grupo (nome, descrição e link).</li>
            <li>Os presentes que você <strong>marcou para comprar</strong>.</li>
          </ul>
          <p>Sua senha é guardada de forma criptografada: nem nós conseguimos vê-la.</p>
        </Secao>

        <Secao titulo="Para que usamos">
          <p>
            Só para o app funcionar: entrar na sua conta, mostrar suas listas aos seus grupos e enviar e-mails de
            confirmação de cadastro e de troca de senha. <strong>Não vendemos nem compartilhamos</strong> seus dados,
            e o QueroAê não tem anúncios.
          </p>
        </Secao>

        <Secao titulo="Quem vê o quê">
          <ul className="list-disc space-y-1 pl-5">
            <li>Sua lista aparece <strong>só para os integrantes dos seus grupos</strong>.</li>
            <li>Seu nome aparece para os integrantes dos seus grupos. Além disso, quem abrir um convite de um grupo seu pode ver seu primeiro nome antes de pedir para entrar.</li>
            <li>Quando você pede para entrar em um grupo, o <strong>admin daquele grupo</strong> vê seu nome e seu e-mail para decidir.</li>
            <li>
              <strong>Ninguém</strong> vê quem escolheu os seus presentes: essa é a surpresa, e ela é protegida pelo
              próprio banco de dados.
            </li>
            <li>Fora isso, seu e-mail não aparece para os outros integrantes.</li>
          </ul>
        </Secao>

        <Secao titulo="Onde os dados ficam">
          <p>Usamos serviços de terceiros para hospedar o app:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Supabase</strong>: banco de dados e login.</li>
            <li><strong>Vercel</strong>: hospeda o site.</li>
            <li><strong>Google</strong>: envio dos e-mails (Gmail) e fontes do site (Google Fonts).</li>
          </ul>
          <p>
            Para manter você conectado, o app guarda sua sessão no próprio navegador. Não usamos cookies de
            rastreamento nem ferramentas de propaganda.
          </p>
        </Secao>

        <Secao titulo="Como apagar seus dados">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Tudo de uma vez:</strong> no Perfil, use <strong>Apagar minha conta</strong>. Sua conta, suas
              listas e suas escolhas são apagadas na hora, e os presentes que você tinha escolhido voltam a ficar livres.
            </li>
            <li><strong>Um grupo:</strong> ao sair de um grupo, sua lista daquele grupo é apagada.</li>
            <li><strong>Um pedido:</strong> cancele um pedido pendente ou dispense o aviso de recusa na tela inicial.</li>
            <li><strong>Um presente:</strong> remova da sua lista quando quiser.</li>
          </ul>
        </Secao>

        {EMAIL_CONTATO && (
          <Secao titulo="Contato">
            <p>
              Dúvidas sobre seus dados? Escreva para{' '}
              <a href={`mailto:${EMAIL_CONTATO}`} className="font-medium text-destaque hover:underline">{EMAIL_CONTATO}</a>.
            </p>
          </Secao>
        )}

        <p className="mt-10 text-sm">
          <Link to={voltar.para} className="font-medium text-destaque hover:underline">{voltar.rotulo}</Link>
        </p>
      </main>
    </div>
  )
}

function Secao({ titulo, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold">{titulo}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  )
}
