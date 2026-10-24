import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import Modal from './Modal.jsx'
import Campo from './Campo.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'

export default function ModalCriarGrupo({ aberto, onFechar }) {
  const navegar = useNavigate()
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function criar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    // A função do banco cria o grupo e já coloca você como admin e integrante
    const { data: idGrupo, error } = await supabase.rpc('criar_grupo', {
      p_nome: nome.trim(),
      p_descricao: descricao.trim() || null,
    })
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))
    navegar(`/grupo/${idGrupo}`)
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Criar grupo novo">
      <form onSubmit={criar} className="flex flex-col gap-4">
        <Campo rotulo="Nome do grupo" required maxLength={60} placeholder="Ex.: Natal da família Faria"
          value={nome} onChange={(e) => setNome(e.target.value)} />
        <Campo rotulo="Descrição" opcional multilinha maxLength={500} placeholder="Data, regras, valor sugerido…"
          value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <div className="mt-2 flex justify-end gap-3">
          <Botao variante="texto" onClick={onFechar}>Cancelar</Botao>
          <Botao type="submit" disabled={enviando}>{enviando ? 'Criando…' : 'Criar grupo'}</Botao>
        </div>
      </form>
    </Modal>
  )
}
