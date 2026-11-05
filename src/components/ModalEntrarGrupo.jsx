import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import Modal from './Modal.jsx'
import Campo from './Campo.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'
import { IconeChave } from './Icones.jsx'

// Digitar o código de convite. Só confere se o código existe: quem existe segue
// para a mesma janela do link de convite ("Entrar neste grupo?", em ModalConvite).
export default function ModalEntrarGrupo({ aberto, onFechar }) {
  const navegar = useNavigate()
  const refCodigo = useRef(null)
  const [codigo, setCodigo] = useState('')
  const [erroCodigo, setErroCodigo] = useState('') // o código está errado: aparece junto do campo
  const [erro, setErro] = useState('') // outro problema (ex.: sem internet)
  const [enviando, setEnviando] = useState(false)

  function limpar() {
    setCodigo('')
    setErroCodigo('')
    setErro('')
  }

  function fechar() {
    limpar()
    onFechar()
  }

  async function continuar(e) {
    e.preventDefault()
    setErroCodigo('')
    setErro('')
    setEnviando(true)
    const { data: existe, error } = await supabase.rpc('convite_existe', { p_codigo: codigo })
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))
    if (!existe) {
      setErroCodigo('Não encontramos este código. Confira se digitou certo ou peça um novo para quem convidou você.')
      refCodigo.current?.focus()
      return
    }
    limpar()
    onFechar()
    // A Home abre a janela do convite ao receber este "bilhete"
    navegar('/', { replace: true, state: { convite: codigo.trim() } })
  }

  return (
    <Modal aberto={aberto} onFechar={fechar} titulo="Entrar com código de convite">
      <form onSubmit={continuar} className="flex flex-col gap-4">
        <Campo ref={refCodigo} rotulo="Código" required autoComplete="off" spellCheck={false} placeholder="Ex.: 3fa9c1b2"
          erro={erroCodigo} value={codigo} onChange={(e) => { setCodigo(e.target.value); setErroCodigo('') }} />
        <p className="text-nota text-suave">Peça o código para quem criou o grupo.</p>
        <Aviso>{erro}</Aviso>
        <div className="mt-2 flex flex-wrap justify-end gap-3">
          <Botao variante="secundario" onClick={fechar}>Cancelar</Botao>
          <Botao type="submit" icone={IconeChave} disabled={enviando}>{enviando ? 'Conferindo…' : 'Continuar'}</Botao>
        </div>
      </form>
    </Modal>
  )
}
