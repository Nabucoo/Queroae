import { useEffect } from 'react'
import { ehFalhaDeConexao } from '../lib/erros.js'
import Botao from './Botao.jsx'
import { IconeAlerta, IconeSemInternet, IconeTentarDeNovo } from './Icones.jsx'

// Quando os dados de uma tela não carregam (H9): diz o que houve e o que fazer, sem
// fingir que a lista está vazia ou que a tela não existe.
// falha: o erro do Supabase. acao: ex.: "abrir este grupo". onTentar: busca de novo.
export default function EstadoDeErro({ falha, acao, onTentar }) {
  const conexao = ehFalhaDeConexao(falha)
  const Icone = conexao ? IconeSemInternet : IconeAlerta

  // A internet voltou: tenta sozinho, sem esperar o toque no botão
  useEffect(() => {
    window.addEventListener('online', onTentar)
    return () => window.removeEventListener('online', onTentar)
  }, [onTentar])

  return (
    <div role="alert" className="flex flex-col items-start gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ativo">
        <Icone className="h-4 w-4" />
      </span>
      <p className="font-semibold">{conexao ? 'Sem conexão' : 'Não foi possível carregar'}</p>
      <p className="text-apoio text-suave">
        {conexao
          ? `Não conseguimos ${acao}. Confira sua internet e tente de novo.`
          : `Não conseguimos ${acao} agora. Espere um instante e tente de novo.`}
      </p>
      <Botao icone={IconeTentarDeNovo} className="mt-2" onClick={onTentar}>Tentar de novo</Botao>
    </div>
  )
}
