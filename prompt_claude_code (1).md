# Projeto: QueroAê

## Sobre mim (leia primeiro)
Este é o meu **primeiro projeto programando com IA**. Quero aprender enquanto construímos, então trabalhe de forma **lenta e didática** (veja a seção "Como quero trabalhar"). Prefiro entender cada passo a ter tudo pronto rápido.

## Visão geral
QueroAê é um site para organizar grupos de presentes (ex.: uma família que se presenteia em datas comemorativas). Cada integrante mantém uma lista de presentes que gostaria de ganhar. Os outros integrantes veem a lista e marcam qual vão comprar, **sem que o dono da lista saiba quem escolheu o quê** (preservando a surpresa).

Idioma da interface: português do Brasil.

Anexei os wireframes das telas. Neste projeto **não haverá foto de perfil**: onde os wireframes mostram foto ou avatar, use um círculo com as iniciais do nome.

## Stack
- **React JS** (JavaScript) com **Vite**
- **React Router** para navegação entre telas
- **Tailwind CSS** para estilos
- **Supabase** (Auth com e-mail/senha, Postgres e RLS). Não vamos usar Storage.
- Design mobile-first (as telas foram pensadas para celular, mas devem funcionar bem no desktop)

## Design: skills e paleta
Vou usar as skills **taste-skills** e **awesome design** na parte visual do projeto.
- Antes de começar, verifique se essas skills estão disponíveis. Se não encontrar alguma, me avise e me explique como instalar, em vez de seguir sem ela.
- Use as duas na etapa de design e sempre que criar ou ajustar componentes visuais (tipografia, espaçamento, hierarquia, consistência).
- **Paleta de cores** 
Deve ser cores neutras, mas que remetem ao tema festa.

- Defina as cores como variáveis (tokens) no Tailwind, para eu trocar a paleta em um só lugar.

## Banco de dados (JÁ ESTÁ CRIADO)
O banco já foi criado no Supabase com o arquivo `queroae_banco.sql`, que está anexado. **Não recrie nem altere o banco sem me perguntar.** Use o arquivo como referência e guarde uma cópia em `supabase/migrations/`.

Resumo das tabelas (nomes em minúsculas):
- `usuario`: `id_usuario` (= auth.users.id), `nome`, `foto_url` (não será usada), `created_at`
- `grupo`: `id_grupo`, `codigo_convite` (texto aleatório e único), `nome`, `descricao`, `id_admin`, `created_at`
- `usuario_grupo`: `id_usuario_grupo`, `id_usuario`, `id_grupo` (par único), `created_at`
- `presente`: `id_presente`, `id_usuario_grupo` (de quem é o desejo), `nome`, `descricao`, `link`, `created_at`
- `escolha_presente`: `id_escolha_presente`, `id_presente` (único), `id_presenteador`, `created_at`

Como o app conversa com o banco:
- **Cadastro:** um trigger cria o registro em `usuario`. Envie o nome assim: `supabase.auth.signUp({ email, password, options: { data: { nome } } })`.
- **Criar grupo:** `supabase.rpc('criar_grupo', { p_nome, p_descricao })` (já torna quem criou admin e integrante).
- **Entrar por convite:** `supabase.rpc('entrar_no_grupo', { p_codigo })`.
- **Marcar "vou comprar":** insert em `escolha_presente`. **Desmarcar:** delete na própria escolha.
- Erro de código `23505` (duplicado): trate com mensagem amigável (ex.: "Você já participa deste grupo" ou "Alguém já escolheu este presente").
- O RLS está ligado em todas as tabelas. O front-end usa **somente a chave `anon`**. Nunca coloque a chave `service_role` no front nem no Git, e mantenha o `.env` no `.gitignore`.

## Regras de negócio importantes
1. Só integrantes de um grupo veem o grupo, seus membros e as listas de presentes (garantido pelo RLS).
2. **Surpresa:** o dono da lista não consegue ler `escolha_presente` dos próprios presentes (o banco devolve vazio). No front, na lista do dono **nunca** mostre presentes como escolhidos. Na página de outro integrante, mostre riscado e com o nome de quem escolheu.
3. Qualquer integrante, exceto o dono, pode marcar um presente como "vou comprar" e desmarcar se foi ele quem marcou.
4. Só o dono edita/remove seus presentes. Só o admin edita/exclui o grupo. O admin não pode sair do próprio grupo.
5. **Apagar conta** exige uma **Edge Function** do Supabase (o front não consegue apagar usuário do auth). Como `grupo.id_admin` usa `on delete restrict`, quem é admin de algum grupo precisa antes excluir o grupo ou o app deve bloquear com aviso claro. Esta função fica para a etapa final; me explique o que é uma Edge Function antes de criá-la.

## Telas (wireframes anexados)
1. **Login**: logo + nome do site, e-mail e senha, links "Criar conta" e "Esqueceu senha?".
2. **Home**: botão de configurações (abre o perfil) e logo no topo. Seção "Grupos que estou participando" com botão "Criar grupo novo" e uma opção "Entrar com código de convite". Seção "Presentes que escolhi comprar", com os dados do presente e de quem vai ganhar.
3. **Grupo**: nome e descrição (expansível). Mostre o código de convite com botão de copiar. Duas abas:
   - **Integrantes**: lista de membros (iniciais + nome); clicar leva à página do integrante.
   - **Minha lista de presentes**: meus presentes com editar/remover e botão "Adicionar novo presente".
4. **Modal Novo presente**: Nome (obrigatório), Descrição (opcional), Link de referência (opcional); botões remover e adicionar (o mesmo modal serve para editar).
5. **Página do integrante**: iniciais, nome, "Lista de presentes". Presentes já escolhidos aparecem riscados, com quem escolheu.
6. **Perfil/Configurações**: botão voltar, nome (editável), "Apagar conta". Sem foto.

## Como quero trabalhar (modo didático)
1. **Antes de codar**: leia tudo, me faça perguntas se algo estiver ambíguo e proponha um plano em etapas pequenas. Só comece depois que eu aprovar.
2. **Uma etapa por vez, em passos pequenos.** Nunca faça várias etapas de uma vez. Ao terminar cada etapa, **pare e espere eu dizer "pode continuar"**.
3. **Explique antes de fazer**: diga em linguagem simples o que vai criar e por quê. Depois de fazer, resuma o que mudou e em quais arquivos.
4. **Explique os termos técnicos** na primeira vez que aparecerem (ex.: componente, hook, estado, rota, RLS, Edge Function), com uma analogia curta quando ajudar.
5. **Me diga o que eu preciso fazer manualmente** (copiar chaves do Supabase, criar o `.env`, rodar um comando), com passo a passo. Nunca assuma que eu já sei.
6. **Ensine a testar**: ao fim de cada etapa, me diga exatamente como rodar o projeto e o que devo ver na tela para saber que funcionou.
7. **Peça confirmação** antes de instalar bibliotecas novas (explicando para que servem), apagar arquivos, ou mudar qualquer coisa no banco.
8. **Use Git**: faça um commit pequeno ao fim de cada etapa, com mensagem clara em português, e me explique o que é um commit na primeira vez.
9. Código simples e legível, com comentários curtos onde ajudar a entender. Prefira componentes pequenos e reutilizáveis a soluções "espertas". Sem bibliotecas desnecessárias.
10. Se eu errar algo ou pedir algo que vá causar problema (ex.: expor uma chave secreta), me avise com gentileza e explique o motivo.

## Etapas sugeridas
1. Setup do projeto (Vite + React + Tailwind + Router) e estrutura de pastas
2. Conexão com o Supabase (variáveis de ambiente, cliente) e conferência do banco existente
3. Design base: paleta, tipografia e componentes comuns (usando as skills)
4. Autenticação (login, cadastro, recuperar senha, rotas protegidas)
5. Home e grupos (criar, listar, entrar por convite)
6. Listas de presentes (adicionar, editar, remover)
7. Marcar presente e página do integrante (com a regra da surpresa)
8. Perfil e apagar conta (Edge Function)
9. Polimento visual, revisão e README com instruções para rodar o projeto

Comece pela leitura de tudo isto e me apresente o plano e suas perguntas. Ainda não escreva código.
