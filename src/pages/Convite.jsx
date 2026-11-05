import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { guardarConvitePendente } from '../lib/convitePendente.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import TelaAuth from '../components/TelaAuth.jsx'
import Botao from '../components/Botao.jsx'
import { TelaAbrindo } from '../components/Esqueleto.jsx'
import { IconeChave, IconeEntrar, IconePessoaMais, IconePresente } from '../components/Icones.jsx'

// Porta de entrada do link /convite/:codigo.
// Logado: vai para a Home, onde abre a janela "Entrar neste grupo?".
// Sem login: mostra o caminho até entrar no grupo, sem dizer qual é o grupo.
export default function Convite() {
  const { codigo } = useParams()
  const { sessao, carregando } = useAuth()
  const [existe, setExiste] = useState(null) // null = ainda não sabe

  // Sem login, só dá para perguntar ao banco se o código existe
  useEffect(() => {
    if (carregando || sessao) return
    supabase.rpc('convite_existe', { p_codigo: codigo }).then(({ data, error }) => {
      // Se a busca falhar, não dá para afirmar que o convite é inválido
      const valido = error ? true : data
      if (valido) guardarConvitePendente(codigo) // lembrado durante o login e o cadastro
      setExiste(valido)
    })
  }, [carregando, sessao, codigo])

  if (carregando) return <TelaAbrindo />

  if (sessao) return <Navigate to="/" replace state={{ convite: codigo }} />

  if (existe === null) return <TelaAbrindo />

  // Código inválido: as boas-vindas abrem o aviso
  if (!existe) return <Navigate to="/boas-vindas" replace state={{ conviteInvalido: true }} />

  return (
    <TelaAuth titulo="Você recebeu um convite">
      <div className="flex flex-col gap-8">
        <ol className="relative flex flex-col gap-4">
          {/* A linha liga os ícones e mostra que é uma sequência */}
          <span aria-hidden="true" className="absolute top-4 bottom-4 left-[1.0625rem] w-0.5 bg-borda" />
          <Passo icone={IconePessoaMais} cor="bg-confete-5 text-confete-5-tinta" titulo="Crie sua conta">
            Ou entre, se já tiver uma.
          </Passo>
          <Passo icone={IconeChave} cor="bg-confete-1 text-confete-1-tinta" titulo="Peça para entrar no grupo">
            O admin do grupo aprova seu pedido.
          </Passo>
          <Passo icone={IconePresente} cor="bg-confete-3 text-confete-3-tinta" titulo="Monte sua lista">
            Ninguém sabe quem vai dar o quê.
          </Passo>
        </ol>
        <div className="flex flex-col gap-3">
          <Botao as={Link} to="/cadastro" icone={IconePessoaMais} larguraTotal>Criar conta</Botao>
          <Botao as={Link} to="/login" variante="secundario" icone={IconeEntrar} larguraTotal>Já tenho conta</Botao>
        </div>
      </div>
    </TelaAuth>
  )
}

// Mesmo quadradinho colorido de "Tenho um código" e "Criar um grupo", na Home
function Passo({ icone: Icone, cor, titulo, children }) {
  return (
    <li className="relative flex items-start gap-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cor}`}>
        <Icone className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-corpo font-semibold">{titulo}</p>
        <p className="text-apoio text-suave">{children}</p>
      </div>
    </li>
  )
}
