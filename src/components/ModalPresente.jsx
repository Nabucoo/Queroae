import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { normalizarLink } from '../lib/links.js'
import Modal from './Modal.jsx'
import Campo from './Campo.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'
import { IconeConfirmar, IconeLixeira, IconeMais } from './Icones.jsx'

// Serve para ADICIONAR (presente = null) e para EDITAR (presente = o presente).
export default function ModalPresente({ presente, idUsuarioGrupo, onFechar, onSalvo, onPedirRemocao }) {
  const editando = Boolean(presente)
  const [nome, setNome] = useState(presente?.nome ?? '')
  const [descricao, setDescricao] = useState(presente?.descricao ?? '')
  const [link, setLink] = useState(presente?.link ?? '')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    setErro('')

    let linkFinal
    try {
      linkFinal = normalizarLink(link)
    } catch (falha) {
      return setErro(falha.message)
    }

    const dados = { nome: nome.trim(), descricao: descricao.trim() || null, link: linkFinal }
    const colunas = 'id_presente, nome, descricao, link, created_at'

    setEnviando(true)
    const { data, error } = editando
      ? await supabase.from('presente').update(dados).eq('id_presente', presente.id_presente).select(colunas).single()
      : await supabase.from('presente').insert({ ...dados, id_usuario_grupo: idUsuarioGrupo }).select(colunas).single()
    setEnviando(false)

    if (error) return setErro(mensagemDeErro(error))
    onSalvo(data, editando)
  }

  return (
    <Modal aberto onFechar={onFechar} titulo={editando ? 'Editar presente' : 'Novo presente'}>
      <form onSubmit={salvar} className="flex flex-col gap-4">
        <Campo rotulo="Nome" required maxLength={100} placeholder="Ex.: Fone de ouvido sem fio"
          value={nome} onChange={(e) => setNome(e.target.value)} />
        <Campo rotulo="Descrição" opcional multilinha maxLength={500} placeholder="Cor, tamanho, modelo…"
          value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <Campo rotulo="Link de referência" opcional inputMode="url" autoComplete="off" maxLength={2000}
          placeholder="https://" value={link} onChange={(e) => setLink(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <div className="mt-2 flex justify-end gap-3">
          {editando ? (
            <Botao variante="perigo" icone={IconeLixeira} className="mr-auto" onClick={onPedirRemocao}>Remover</Botao>
          ) : (
            <Botao variante="texto" onClick={onFechar}>Cancelar</Botao>
          )}
          <Botao type="submit" icone={editando ? IconeConfirmar : IconeMais} disabled={enviando}>
            {enviando ? 'Salvando…' : editando ? 'Salvar' : 'Adicionar'}
          </Botao>
        </div>
      </form>
    </Modal>
  )
}
