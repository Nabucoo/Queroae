import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase.js'
import { mensagemDeErro } from '../lib/erros.js'
import Modal from './Modal.jsx'
import Avatar from './Avatar.jsx'
import Botao from './Botao.jsx'
import ModalConviteInvalido from './ModalConviteInvalido.jsx'
import { Aviso } from './TelaAuth.jsx'
import { IconeEntrar } from './Icones.jsx'

// Janela "Entrar neste grupo?", aberta por cima da Home para quem chega por um
// link de convite ou digita um código. Mostra o grupo e quem já está nele, para a
// pessoa confirmar que é o grupo certo, e cria um pedido para o admin aprovar.
// Nunca mostra presentes nem escolhas.
// onPedido: avisa a Home para mostrar o pedido recém-criado.
export default function ModalConvite({ codigo, onFechar, onPedido }) {
  const navegar = useNavigate()
  const [convite, setConvite] = useState(undefined) // undefined = carregando; null = inválido
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0) // somar 1 busca de novo ("Tentar de novo")
  const [enviando, setEnviando] = useState(false)
  const [acabouDePedir, setAcabouDePedir] = useState(false)

  useEffect(() => {
    let ativo = true // evita mexer na tela se a janela já tiver fechado
    async function buscar() {
      const { data, error } = await supabase.rpc('ver_convite', { p_codigo: codigo })
      if (!ativo) return
      if (error) return setErro(mensagemDeErro(error))
      // Quem já participa não precisa confirmar nada
      if (data?.ja_participa) return navegar(`/grupo/${data.id_grupo}`, { replace: true })
      setConvite(data)
    }
    buscar()
    return () => { ativo = false }
  }, [codigo, tentativa, navegar])

  function tentarDeNovo() {
    setErro('')
    setTentativa((t) => t + 1)
  }

  async function pedir() {
    setErro('')
    setEnviando(true)
    const { data, error } = await supabase.rpc('pedir_entrada', { p_codigo: codigo })
    setEnviando(false)
    if (error) return setErro(mensagemDeErro(error))
    if (data.situacao === 'integrante') return navegar(`/grupo/${data.id_grupo}`, { replace: true })
    setAcabouDePedir(data.situacao === 'pendente')
    onPedido?.()
    setConvite({ ...convite, meu_pedido: data.situacao })
  }

  if (convite === null) return <ModalConviteInvalido onFechar={onFechar} />

  // Não conseguiu carregar: o problema é a busca, não o convite (H9)
  if (convite === undefined && erro) {
    return (
      <Modal aberto onFechar={onFechar} titulo="Não conseguimos abrir o convite">
        <Aviso>{erro}</Aviso>
        <div className="mt-6 flex justify-end gap-3">
          <Botao variante="texto" onClick={onFechar}>Agora não</Botao>
          <Botao onClick={tentarDeNovo}>Tentar de novo</Botao>
        </div>
      </Modal>
    )
  }

  if (convite === undefined) {
    return (
      <Modal aberto onFechar={onFechar} titulo="Abrindo convite…">
        <div role="status" aria-label="Carregando" className="flex flex-col gap-2">
          <div className="h-5 w-3/4 rounded-full bg-ativo" />
          <div className="h-8 w-1/2 rounded-full bg-ativo" />
        </div>
      </Modal>
    )
  }

  if (convite.meu_pedido === 'recusado') {
    return (
      <Modal aberto onFechar={onFechar} titulo="Pedido não aprovado">
        <p className="text-sm text-suave">
          Seu pedido para entrar em <strong className="font-semibold text-texto">{convite.nome}</strong> não foi aprovado. Se foi engano, fale com quem te convidou. Para pedir de novo, dispense o aviso na tela inicial.
        </p>
        <div className="mt-6 flex justify-end">
          <Botao onClick={onFechar}>Entendi</Botao>
        </div>
      </Modal>
    )
  }

  if (convite.meu_pedido === 'pendente') {
    return (
      <Modal aberto onFechar={onFechar} titulo={acabouDePedir ? 'Pedido enviado' : 'Você já pediu para entrar'}>
        <p role="status" className="text-sm text-suave">
          O admin de <strong className="font-semibold text-texto">{convite.nome}</strong> precisa aprovar sua entrada. Avise quem te convidou, porque o app não manda notificação.
        </p>
        <div className="mt-6 flex justify-end">
          <Botao onClick={onFechar}>Entendi</Botao>
        </div>
      </Modal>
    )
  }

  return (
    <Modal aberto onFechar={onFechar} titulo="Entrar neste grupo?">
      <p className="text-base font-semibold break-words">{convite.nome}</p>
      <Rostos nomes={convite.nomes} total={convite.total} />
      <p className="mt-2 text-sm text-suave">{quemEstaNoGrupo(convite.nomes, convite.total)}</p>
      <div className="mt-4">
        <Aviso tipo="info">O admin vai ver seu nome e e-mail para aprovar o pedido.</Aviso>
      </div>
      {erro && <div className="mt-4"><Aviso>{erro}</Aviso></div>}
      <div className="mt-6 flex justify-end gap-3">
        <Botao variante="texto" onClick={onFechar}>Agora não</Botao>
        <Botao icone={IconeEntrar} onClick={pedir} disabled={enviando}>
          {enviando ? 'Enviando…' : 'Pedir para entrar'}
        </Botao>
      </div>
    </Modal>
  )
}

// Até 4 rostos, um pouco sobrepostos, e o resto vira "+8".
// Decorativo: a frase logo abaixo diz os mesmos nomes para o leitor de tela.
function Rostos({ nomes, total }) {
  const restantes = total - nomes.length
  return (
    <div aria-hidden="true" className="mt-3 flex">
      {nomes.map((nome, i) => (
        <span key={i} className={`inline-flex rounded-full ring-2 ring-fundo ${i > 0 ? '-ml-2' : ''}`}>
          <Avatar nome={nome} tamanho="p" />
        </span>
      ))}
      {restantes > 0 && (
        <span className="num -ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ativo text-xs font-semibold text-suave ring-2 ring-fundo">
          +{restantes}
        </span>
      )}
    </div>
  )
}

// "Ana já está aqui." / "Ana e Bruno já estão aqui." /
// "Ana, Bruno, Carla, Diego e mais 8 pessoas já estão aqui."
function quemEstaNoGrupo(nomes, total) {
  const restantes = total - nomes.length
  const partes = [...nomes]
  if (restantes > 0) partes.push(restantes === 1 ? 'mais 1 pessoa' : `mais ${restantes} pessoas`)
  if (partes.length === 0) return 'Ainda não há ninguém neste grupo.'
  if (partes.length === 1) return `${partes[0]} já está aqui.`
  return `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]} já estão aqui.`
}
