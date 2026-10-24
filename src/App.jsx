import { BrowserRouter, Routes, Route } from 'react-router'

import { AuthProvider } from './contexts/AuthContext.jsx'
import { RotaProtegida, RotaPublica } from './components/Rotas.jsx'

import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import EsqueciSenha from './pages/EsqueciSenha.jsx'
import NovaSenha from './pages/NovaSenha.jsx'
import Home from './pages/Home.jsx'
import Grupo from './pages/Grupo.jsx'
import Integrante from './pages/Integrante.jsx'
import Perfil from './pages/Perfil.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'

// Mapa do site: cada <Route> liga um endereço (path) a uma tela (element).
// O AuthProvider "abraça" tudo, para todas as telas saberem quem está logado.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Só para quem NÃO está logado */}
          <Route element={<RotaPublica />}>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          </Route>

          {/* Chega pelo link do e-mail (cuida sozinha do login) */}
          <Route path="/nova-senha" element={<NovaSenha />} />

          {/* Só para quem está logado */}
          <Route element={<RotaProtegida />}>
            <Route path="/" element={<Home />} />
            <Route path="/grupo/:idGrupo" element={<Grupo />} />
            <Route path="/grupo/:idGrupo/integrante/:idUsuario" element={<Integrante />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          {/* Qualquer outro endereço */}
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
