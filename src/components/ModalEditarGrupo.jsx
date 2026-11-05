import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import { useErrosDeCampo } from '../lib/useErrosDeCampo.js'
import { erroDeNomeDoGrupo } from '../lib/validacao.js'
import Modal from './Modal.jsx'
import Campo from './Campo.jsx'
import Botao from './Botao.jsx'
import { Aviso } from './TelaAuth.jsx'
import { IconeConfirmar, IconeLixeira, IconePessoas, IconeSair } from './Icones.jsx'

// Só o admin abre esta janela. onSalvo recebe o grupo atualizado.
// sucessor: quem vira admin se você sair (null = só há você no grupo).
export default function ModalEditarGrupo({ aberto, onFechar, grupo, sucessor, onSalvo, onGerenciarIntegrantes, onPedirSaida, onPedirExclusao }) {
  const [nome, setNome] = useState(grupo.nome)
  const [descricao, setDescricao] = useState(grupo.descricao ?? '')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { erros, refDe, mostrar, limpar, limparTodos } = useErrosDeCampo()

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const erroNome = erroDeNomeDoGrupo(nome)
    if (erroNome) return mostrar({ nome: erroNome })
    limparTodos()
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
      <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
        <Campo rotulo="Nome do grupo" required maxLength={60} ref={refDe('nome')} erro={erros.nome} value={nome}
          onChange={(e) => { setNome(e.target.value); limpar('nome') }} />
        <Campo rotulo="Descrição" opcional multilinha maxLength={500} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <Aviso>{erro}</Aviso>
        <div className="mt-2 flex flex-wrap justify-end gap-3">
          <Botao variante="secundario" onClick={onFechar}>Cancelar</Botao>
          <Botao type="submit" icone={IconeConfirmar} disabled={enviando}>{enviando ? 'Salvando…' : 'Salvar'}</Botao>
        </div>
      </form>

      {/* Integrantes: abre outra janela com a lista para remover pessoas */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-borda pt-5">
        <p className="text-apoio text-suave">Remover pessoas do grupo.</p>
        <Botao variante="secundario" icone={IconePessoas} onClick={onGerenciarIntegrantes}>Gerenciar integrantes</Botao>
      </div>

      {/* Sair: o grupo continua existindo, com outra pessoa como admin */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-borda pt-5">
        {sucessor ? (
          <>
            <p className="text-apoio text-suave">O grupo passa para {sucessor.usuario.nome}, que está nele há mais tempo.</p>
            <Botao variante="perigo" icone={IconeSair} className="shrink-0" onClick={onPedirSaida}>Sair do grupo</Botao>
          </>
        ) : (
          <p className="text-apoio text-suave">Você é a única pessoa no grupo. Para sair, exclua o grupo abaixo.</p>
        )}
      </div>

      {/* Ação perigosa fica separada, no fim */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-borda pt-5">
        <p className="text-apoio text-suave">Apaga o grupo e todas as listas dele.</p>
        <Botao variante="perigo" icone={IconeLixeira} onClick={onPedirExclusao}>Excluir grupo</Botao>
      </div>
    </Modal>
  )
}
