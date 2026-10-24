import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import Modal from './Modal.jsx'
import Campo from './Campo.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'
import { IconeConfirmar, IconeLixeira } from './Icones.jsx'

// Só o admin abre esta janela. onSalvo recebe o grupo atualizado.
export default function ModalEditarGrupo({ aberto, onFechar, grupo, onSalvo, onPedirExclusao }) {
  const [nome, setNome] = useState(grupo.nome)
  const [descricao, setDescricao] = useState(grupo.descricao ?? '')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    const { data, error } = await supabase
      .from('grupo')
      .update({ nome: nome.trim(), descricao: descricao.trim() || null })
      .eq('id_grupo', grupo.id_grupo)
      .select('id_grupo, nome, descricao, codigo_convite, id_admin')
      .single()
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))
    onSalvo(data)
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Editar grupo">
      <form onSubmit={salvar} className="flex flex-col gap-4">
        <Campo rotulo="Nome do grupo" required maxLength={60} value={nome} onChange={(e) => setNome(e.target.value)} />
        <Campo rotulo="Descrição" opcional multilinha maxLength={500} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <div className="mt-2 flex justify-end gap-3">
          <Botao variante="texto" onClick={onFechar}>Cancelar</Botao>
          <Botao type="submit" icone={IconeConfirmar} disabled={enviando}>{enviando ? 'Salvando…' : 'Salvar'}</Botao>
        </div>
      </form>

      {/* Ação perigosa fica separada, no fim */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-borda pt-5">
        <p className="text-sm text-suave">Apaga o grupo e todas as listas dele.</p>
        <Botao variante="perigo" icone={IconeLixeira} onClick={onPedirExclusao}>Excluir grupo</Botao>
      </div>
    </Modal>
  )
}
