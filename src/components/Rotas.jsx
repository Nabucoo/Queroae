import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'

function Carregando() {
  return <p className="p-6 text-sm text-suave">Carregando…</p>
}

// Só deixa passar quem está logado; os outros vão para o login.
// <Outlet /> é o lugar onde a tela da rota "de dentro" aparece.
export function RotaProtegida() {
  const { sessao, carregando } = useAuth()
  if (carregando) return <Carregando />
  return sessao ? <Outlet /> : <Navigate to="/login" replace />
}

// Telas de login/cadastro: quem já está logado vai direto para a Home.
export function RotaPublica() {
  const { sessao, carregando } = useAuth()
  if (carregando) return <Carregando />
  return sessao ? <Navigate to="/" replace /> : <Outlet />
}
