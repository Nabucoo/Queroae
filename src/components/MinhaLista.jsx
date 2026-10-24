import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import CartaoPresente from './CartaoPresente.jsx'
import ModalPresente from './ModalPresente.jsx'
import ModalConfirmar from './ModalConfirmar.jsx'
import Botao from './Botao.jsx'

// A aba "Minha lista de presentes" de um grupo.
// REGRA DA SURPRESA: aqui nunca consultamos escolha_presente,
// então nenhum presente aparece como escolhido para o dono.
export default function MinhaLista({ idUsuarioGrupo }) {
  const [presentes, setPresentes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  // null = fechado; { presente: null } = novo; { presente } = editando
  const [editor, setEditor] = useState(null)
  const [removendo, setRemovendo] = useState(null) // presente a remover

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from('presente')
        .select('id_presente, nome, descricao, link, created_at')
        .eq('id_usuario_grupo', idUsuarioGrupo)
        .order('created_at')
      if (error) setErro(mensagemDeErro(error))
      else setPresentes(data)
      setCarregando(false)
    }
    buscar()
  }, [idUsuarioGrupo])

  // Atualiza a lista na tela sem buscar tudo de novo
  function aoSalvar(salvo, editando) {
    setPresentes((atual) =>
      editando ? atual.map((p) => (p.id_presente === salvo.id_presente ? salvo : p)) : [...atual, salvo],
    )
    setEditor(null)
  }

  async function remover() {
    const { data, error } = await supabase
      .from('presente').delete().eq('id_presente', removendo.id_presente).select('id_presente')
    if (error) return mensagemDeErro(error)
    if (data.length === 0) return 'Não foi possível remover este presente.'
    setPresentes((atual) => atual.filter((p) => p.id_presente !== removendo.id_presente))
    setRemovendo(null)
  }

  if (carregando) return <p className="text-sm text-suave">Carregando…</p>
  if (erro) return <p role="alert" className="text-sm text-negativo">{erro}</p>

  return (
    <div className="flex flex-col gap-3">
      {presentes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-controle px-4 py-3 text-sm text-suave">
          Sua lista está vazia. Adicione o que você gostaria de ganhar; os outros integrantes vão ver.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {presentes.map((p) => (
            <li key={p.id_presente}>
              <CartaoPresente
                presente={p}
                acoes={
                  <>
                    <Botao variante="secundario" onClick={() => setEditor({ presente: p })}>Editar</Botao>
                    <Botao variante="perigo" onClick={() => setRemovendo(p)}>Remover</Botao>
                  </>
                }
              />
            </li>
          ))}
        </ul>
      )}

      <div>
        <Botao onClick={() => setEditor({ presente: null })}>Adicionar novo presente</Botao>
      </div>

      {/* O modal só existe enquanto está aberto: assim os campos começam sempre do zero */}
      {editor && (
        <ModalPresente
          presente={editor.presente}
          idUsuarioGrupo={idUsuarioGrupo}
          onFechar={() => setEditor(null)}
          onSalvo={aoSalvar}
          onPedirRemocao={() => { setRemovendo(editor.presente); setEditor(null) }}
        />
      )}

      <ModalConfirmar
        aberto={Boolean(removendo)}
        onFechar={() => setRemovendo(null)}
        titulo="Remover presente?"
        rotuloConfirmar="Remover"
        onConfirmar={remover}
      >
        <p><strong>{removendo?.nome}</strong> vai sair da sua lista.</p>
      </ModalConfirmar>
    </div>
  )
}
