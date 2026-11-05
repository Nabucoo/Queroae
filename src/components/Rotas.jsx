import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'
import { TelaAbrindo } from './Esqueleto.jsx'

// Só deixa passar quem está logado. Os outros vão para as boas-vindas
// (ou para o login, se acabaram de clicar em "Sair").
// <Outlet /> é o lugar onde a tela da rota "de dentro" aparece.
export function RotaProtegida() {
  const { sessao, carregando, destinoSemLogin } = useAuth()
  if (carregando) return <TelaAbrindo />
  return sessao ? <Outlet /> : <Navigate to={destinoSemLogin} replace />
}

// Boas-vindas, login e cadastro: quem já está logado vai direto para a Home.
export function RotaPublica() {
  const { sessao, carregando } = useAuth()
  if (carregando) return <TelaAbrindo />
  return sessao ? <Navigate to="/" replace /> : <Outlet />
}
