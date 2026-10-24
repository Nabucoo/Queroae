import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import Modal from './Modal.jsx'
import Campo from './Campo.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'
import { IconeChave, IconeSeta } from './Icones.jsx'

// idsMeusGrupos: grupos em que a pessoa já está, para avisar "você já participa".
export default function ModalEntrarGrupo({ aberto, onFechar, idsMeusGrupos = [] }) {
  const navegar = useNavigate()
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [jaParticipa, setJaParticipa] = useState(null) // id do grupo, se já participa
  const [enviando, setEnviando] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    const { data: idGrupo, error } = await supabase.rpc('entrar_no_grupo', { p_codigo: codigo })
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))

    // O banco não reclama se você já é do grupo; então conferimos aqui
    if (idsMeusGrupos.includes(idGrupo)) return setJaParticipa(idGrupo)
    navegar(`/grupo/${idGrupo}`)
  }

  function fechar() {
    setCodigo('')
    setErro('')
    setJaParticipa(null)
    onFechar()
  }

  return (
    <Modal aberto={aberto} onFechar={fechar} titulo="Entrar com código de convite">
      {jaParticipa ? (
        <div className="flex flex-col gap-4">
          <Aviso tipo="info">Você já participa deste grupo.</Aviso>
          <div className="flex justify-end gap-3">
            <Botao variante="texto" onClick={fechar}>Fechar</Botao>
            <Botao icone={IconeSeta} onClick={() => navegar(`/grupo/${jaParticipa}`)}>Abrir grupo</Botao>
          </div>
        </div>
      ) : (
        <form onSubmit={entrar} className="flex flex-col gap-4">
          <Campo rotulo="Código" required autoComplete="off" spellCheck={false} placeholder="Ex.: 3fa9c1b2"
            value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          <p className="text-xs text-suave">Peça o código para quem criou o grupo.</p>
          <Aviso>{erro}</Aviso>
          <div className="mt-2 flex justify-end gap-3">
            <Botao variante="texto" onClick={fechar}>Cancelar</Botao>
            <Botao type="submit" icone={IconeChave} disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar no grupo'}</Botao>
          </div>
        </form>
      )}
    </Modal>
  )
}
