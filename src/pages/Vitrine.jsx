import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import Botao from '../components/Botao.jsx'
import Campo from '../components/Campo.jsx'
import Avatar from '../components/Avatar.jsx'
import Painel from '../components/Painel.jsx'
import Abas from '../components/Abas.jsx'
import Modal from '../components/Modal.jsx'

// Página PROVISÓRIA para ver os componentes do design base (etapa 3).
// Os dados abaixo são só exemplos. Será removida na etapa 9.
const pessoas = [
  { id: 'b8f0c515-67da-455e-93cc-67abdd7158bd', nome: 'Lucas Faria' },
  { id: 'acd5bad9-f674-4f56-b824-f977141f4229', nome: 'Maria Clara Souza' },
  { id: '33bece49-c6c7-4be9-815d-8c252e6e3a58', nome: 'Vó Teresa' },
  { id: 'a87fe70b-a4ba-4156-b442-66a5d612fb91', nome: 'Rafael Alves' },
  { id: 'b00ed3d1-48fd-4fa7-816f-857fcd534130', nome: 'Júlia' },
  { id: '8b7ab812-02a1-42b1-9e9d-c72ce2ec7c9c', nome: 'Pedro Henrique Santos' },
]

export default function Vitrine() {
  const [aba, setAba] = useState('integrantes') // "estado": o que muda na tela
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <Logo />

      <div className="mt-6">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Olá, Lucas</h1>
        <p className="mt-2 text-sm text-suave">Vitrine do design base: cores, fontes e componentes.</p>
      </div>

      <Painel titulo="Botões">
        <div className="flex flex-wrap gap-3">
          <Botao>Criar grupo novo</Botao>
          <Botao variante="secundario">Entrar com código</Botao>
          <Botao variante="texto">Cancelar</Botao>
          <Botao variante="perigo">Apagar conta</Botao>
          <Botao disabled>Salvando…</Botao>
        </div>
      </Painel>

      <Painel titulo="Confetes: a cor de cada pessoa">
        <ul className="flex flex-col">
          {pessoas.map((p) => (
            <li key={p.id} className="flex items-center gap-3 border-b border-linha py-2 last:border-0">
              <Avatar nome={p.nome} id={p.id} />
              <span className="text-sm">{p.nome}</span>
            </li>
          ))}
        </ul>
      </Painel>

      <Painel titulo="Campos">
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Campo rotulo="Nome do presente" placeholder="Ex.: Livro de receitas" />
          <Campo rotulo="Descrição" opcional multilinha placeholder="Cor, tamanho, detalhes…" />
          <Campo rotulo="E-mail" type="email" defaultValue="lucas@" erro="Digite um e-mail válido." />
        </form>
      </Painel>

      <Painel titulo="Abas">
        <Abas
          abas={[
            { id: 'integrantes', rotulo: 'Integrantes' },
            { id: 'lista', rotulo: 'Minha lista de presentes' },
          ]}
          ativa={aba}
          onTrocar={setAba}
        />
        <p className="pt-4 text-sm text-suave">
          Aba ativa: {aba === 'integrantes' ? 'Integrantes' : 'Minha lista de presentes'}
        </p>
      </Painel>

      <Painel titulo="Presente escolhido (como vai aparecer na página de outro integrante)">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-borda bg-elevado p-4">
          <div>
            <p className="text-sm text-suave line-through">Panela de pressão elétrica</p>
            <p className="mt-1 text-xs text-suave">Maria Clara vai comprar</p>
          </div>
          <Avatar nome="Maria Clara Souza" id="acd5bad9-f674-4f56-b824-f977141f4229" tamanho="p" />
        </div>
      </Painel>

      <Painel titulo="Modal">
        <Botao variante="secundario" onClick={() => setModalAberto(true)}>
          Abrir “Novo presente”
        </Botao>
      </Painel>

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Novo presente">
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Campo rotulo="Nome" required />
          <Campo rotulo="Descrição" opcional multilinha />
          <Campo rotulo="Link de referência" opcional type="url" placeholder="https://" />
          <div className="mt-2 flex justify-end gap-3">
            <Botao variante="perigo">Remover</Botao>
            <Botao type="submit">Adicionar</Botao>
          </div>
        </form>
      </Modal>
    </main>
  )
}
