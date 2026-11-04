# QueroAê: registro de mudanças de interface (IHC)

Registro das reformulações das telas do QueroAê, com a justificativa de cada uma pelas heurísticas de Nielsen (H1–H10), pelos princípios de Dix et al. e por critérios de acessibilidade. A referência teórica está em `docs/heuristicas-ihc.md`.

Entradas da mais recente para a mais antiga.

<!-- Novas entradas entram logo abaixo desta linha. -->

## Mudança 14: Tela "Você recebeu um convite" para quem abre o link sem login

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/pages/Convite.jsx`, `src/pages/Login.jsx`, `src/pages/Cadastro.jsx`, `src/pages/Home.jsx`, `src/lib/convitePendente.js`

### Problema (antes)
Quem recebia um convite e ainda não tinha conta precisava criar a conta, achar "Tenho um código" e lembrar do código recebido. O caminho não era explicado (**H10**) e dependia da memória da pessoa (**H6**).

### O que foi alterado (depois)
- Nova tela em `/convite/:codigo` para quem não está logado, com três passos: criar a conta, pedir para entrar e montar a lista. A logo aparece só no topo.
- O código fica guardado no aparelho durante login, cadastro e troca de senha. Ao chegar na Home, abre a janela do pedido, uma única vez.
- No cadastro, o endereço do convite vai no link de confirmação por e-mail, que pode abrir em outro navegador.
- Em login e cadastro, a seta volta para o convite quando a pessoa veio dele.
- O nome do grupo fica oculto até o login.

A proposta foi apresentada em mockups, e o Lucas escolheu a "Variação A" (ícones coloridos com uma linha ligando os passos).

### Heurísticas e princípios considerados
- **H1 – Visibilidade do status:** a pessoa vê todo o caminho antes de começar, inclusive que precisará de aprovação.
- **H10 – Ajuda e documentação:** a explicação é curta e aparece no ponto de uso, e já ensina a regra da surpresa.
- **H6 – Reconhecer em vez de lembrar:** ninguém precisa guardar o código durante o cadastro.
- **H3 – Controle e liberdade:** a seta de volta leva ao convite.
- **H4 – Consistência:** os ícones usam os mesmos quadradinhos de "Tenho um código" e "Criar um grupo".

### Trade-offs / heurísticas em tensão
- **Conveniência × aparelho compartilhado:** o convite guardado abre para quem entrar em seguida no mesmo aparelho. Foi aceito porque essa pessoa vê só o nome do grupo e primeiros nomes, e ainda depende da aprovação.
- **Mais texto × H8:** a tela tem três passos explicados. Foi aceito porque é a tela que orienta quem nunca viu o app.

### Regra da surpresa
A tela não mostra presentes nem escolhas, e a terceira etapa reforça que ninguém sabe quem vai dar o quê.

### Como testar
1. Numa janela anônima, abrir `/convite/CODIGO`: aparece a tela com os três passos, sem o nome do grupo.
2. Tocar em "Já tenho conta" e na seta: volta para o convite.
3. Entrar: a Home abre "Entrar neste grupo?". Fechar e recarregar: a janela não volta.
4. Criar uma conta nova pelo convite e confirmar o e-mail, também em outro navegador: chega à mesma janela, depois do login se for pedido.

---

## Mudança 13: Entrada nos grupos com aprovação do admin

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/components/ModalConvite.jsx`, `src/components/ModalEntrarGrupo.jsx`, `src/components/PedidosEntrada.jsx`, `src/pages/Home.jsx`, `src/pages/Grupo.jsx`, `src/pages/Privacidade.jsx`, `src/lib/useAoVoltarParaApp.js`, `supabase/migrations/20261104000000_convite_por_link.sql`, `supabase/migrations/20261104000100_fechar_entrada_direta.sql`

### Problema (antes)
Quem tivesse o código entrava no grupo na hora, mesmo que o código tivesse sido repassado por outra pessoa. Dentro do grupo, essa pessoa via as listas e quem vai comprar o quê, e poderia contar ao dono de uma lista. O admin não era avisado e só podia remover a pessoa depois, se percebesse (**H5 – Prevenção de erros**).

### O que foi alterado (depois)
- **Link e código criam um pedido.** A janela "Entrar neste grupo?" mostra o grupo, até 4 rostos com primeiros nomes, o aviso de que o admin verá nome e e-mail, e o botão "Pedir para entrar".
- **Depois de pedir:** a pessoa vê "Pedido enviado" e a orientação de avisar quem a convidou, porque o app não manda notificação.
- **Na Home de quem pediu:** cartão "Aguardando aprovação", com "Cancelar pedido", ou "Pedido não aprovado", com "Dispensar". Depois de dispensar, é possível pedir de novo.
- **Na Home do admin:** selo com o número de pedidos no grupo.
- **No grupo, só para o admin:** bloco "Pedidos para entrar", com nome, e-mail, "Recusar" e "Aprovar". Ao aprovar, a pessoa já aparece em Integrantes.
- **"Tenho um código"** confere o código, mostra o erro junto do campo e leva para a mesma janela.
- **Link inválido:** pop-up sobre a tela atual, a Home para quem está logado e as boas-vindas para quem não está.
- **Atualização:** Home e pedidos se atualizam quando a pessoa volta para o app.
- **Banco:** tabela `pedido_entrada`, acessível só por funções que conferem quem está chamando. A entrada direta é fechada por uma migration à parte, rodada depois da publicação.
- **Política de privacidade:** informa o que o admin e quem abre um convite podem ver.

### Heurísticas e princípios considerados
- **H5 – Prevenção de erros:** ninguém acessa as listas sem o admin aceitar, e um toque por engano só cria um pedido.
- **H1 – Visibilidade do status:** quem pediu sempre sabe em que situação está, e o admin vê que há pedidos sem abrir cada grupo.
- **H2 – Correspondência com o mundo real:** "Pedir para entrar" descreve o que realmente acontece.
- **H3 – Controle e liberdade:** é possível cancelar o pedido e dispensar a recusa; aprovar por engano se resolve removendo a pessoa.
- **H4 – Consistência:** código e link usam a mesma janela, com a ordem de botões das outras janelas.
- **H6 – Reconhecer em vez de lembrar:** rostos ajudam a confirmar o grupo; nome e e-mail ajudam o admin a reconhecer quem pede.
- **H8 – Design minimalista:** o bloco de pedidos só existe quando há pedidos.
- **H9 – Erros:** código errado é explicado junto do campo, e falha de conexão não é apresentada como convite inválido.
- **Acessibilidade:** a situação do pedido vem escrita, e não só na cor.

### Trade-offs / heurísticas em tensão
- **Segurança × eficiência (H5 × H7):** toda pessoa convidada espera o admin, e por isso pode desistir no caminho. O Lucas escolheu priorizar a proteção da surpresa.
- **Sem notificação:** o admin só vê o pedido ao abrir o app. A mensagem pede para avisar quem convidou.
- **Rostos × privacidade:** quem tem o link vê até 4 primeiros nomes sem ser aprovado. Foi aceito porque ajuda a confirmar o grupo e revela pouco; a Política informa isso.
- **E-mail × privacidade:** o admin vê o e-mail de quem pede, para não aprovar alguém só por um nome parecido. A janela avisa antes do pedido, e a Política informa isso.
- **Consulta sem login:** `convite_existe` responde só sim ou não, para avisar de um link inválido antes de a pessoa criar uma conta.

### Regra da surpresa
Reforçada. Quem está aguardando não acessa listas nem escolhas, e nenhuma função nova consulta `presente` ou `escolha_presente`.

### Como testar
1. Com uma conta fora do grupo, abrir o link e tocar em "Pedir para entrar": aparece "Pedido enviado", e o grupo não abre.
2. Na Home, conferir "Aguardando aprovação" e testar "Cancelar pedido".
3. Com o admin, conferir o selo na Home e o bloco no grupo. Com um integrante comum, o bloco não aparece.
4. Recusar: quem pediu vê "Pedido não aprovado" e pode dispensar e pedir de novo.
5. Aprovar: a pessoa aparece em Integrantes e consegue abrir o grupo.
6. Abrir `/convite/abc`, logado e sem login: pop-up de convite inválido, na Home e nas boas-vindas.
7. "Tenho um código" com código errado: erro embaixo do campo.
8. Depois de rodar a migration final, conferir que `entrar_no_grupo` é recusada.

---

## Mudança 12: Convidar por link, com botão Compartilhar no grupo

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/pages/Grupo.jsx`, `src/pages/Convite.jsx`, `src/pages/BoasVindas.jsx`, `src/components/ModalConviteInvalido.jsx`, `src/components/Icones.jsx`, `src/App.jsx`

### Problema (antes)
Para convidar, era preciso copiar o código, escrever a mensagem e explicar onde colar. Quem recebia precisava encontrar "Tenho um código" e digitar ou colar (**H6** e **H7**).

### O que foi alterado (depois)
- O cartão "Código de convite" virou **"Convidar pessoas"**, com o botão principal **Compartilhar** e o código menor ao lado.
- Compartilhar abre a janela do próprio aparelho com uma mensagem pronta contendo o nome do grupo e o link. Onde essa janela não existe, copia a mensagem. Se a cópia falhar, o link aparece na tela.
- Tocar no código copia só o código.
- Novo endereço `/convite/:codigo`.
- O cartão mantém praticamente a altura do antigo, e o texto do grupo vazio passou a falar de Compartilhar.

A proposta foi apresentada em mockups, e o Lucas escolheu a "Opção A", a mais compacta.

### Heurísticas e princípios considerados
- **H7 – Flexibilidade e eficiência:** um toque substitui copiar, escrever e explicar.
- **H6 – Reconhecer em vez de lembrar:** quem recebe toca num link, sem decorar código.
- **H2 – Correspondência com o mundo real / Familiaridade (Dix):** mandar um link por mensagem é um gesto conhecido.
- **H8 – Design minimalista:** a lista de integrantes não desce para dar lugar ao convite.
- **H9 – Erros:** se a cópia falhar, a pessoa recebe o link para enviar à mão.
- **Facilidade de substituir (Dix):** link e código levam ao mesmo lugar.
- **Acessibilidade:** o resultado de copiar é anunciado a leitores de tela.

### Trade-offs / heurísticas em tensão
- **Altura do cartão × alvo de toque:** o código tem 24px de altura, o mínimo do WCAG, abaixo dos 44px recomendados pela Apple. Foi mantido para preservar o tamanho do cartão.
- **Prévia do link:** a imagem é a mesma para todos os grupos, e o nome do grupo vai no texto da mensagem.

### Regra da surpresa
O convite não mostra presentes nem escolhas.

### Como testar
1. Abrir um grupo: conferir "Convidar pessoas", o código e Compartilhar.
2. Tocar no código: "Código copiado!", e colar traz só o código.
3. Tocar em Compartilhar no iPhone, em HTTPS: abre a janela do sistema com a mensagem pronta.
4. No computador sem essa janela: "Copiado!", e colar traz a mensagem com o link.
5. Abrir o link em outra conta: chega à janela do convite.

---

## Mudança 11: Criar e entrar em grupo explicados, com "+ Adicionar" dentro da aba Grupos

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/pages/Home.jsx`
**Revisa:** a aba "Grupos" da Mudança 10.

### Problema (antes)
No topo da aba "Grupos" havia dois botões lado a lado: "Criar grupo novo" e "Entrar com código".
- **Eles não explicavam para que serve cada um.** Quem recebeu um convite não sabia se devia "criar" ou "entrar", e quem queria organizar a família não sabia o que era o "código". Isso fere a **H2 – Correspondência com o mundo real** (os rótulos falam do sistema, não da situação da pessoa) e a **H10 – Ajuda e documentação** (nenhuma dica no ponto de uso).
- **Os botões sempre ocupavam o topo da aba**, mesmo para quem já tinha vários grupos e só queria abrir um deles. A lista, que é o mais usado, ficava abaixo de duas ações raras (**H8 – Design minimalista**).
- **A ordem favorecia criar**, embora quase todo mundo chegue ao app por um convite.

### O que foi alterado (depois)
- **Sem grupos:** a aba mostra "Você ainda não participa de nenhum grupo. Como quer começar?" e **dois cartões explicados**, lado a lado:
  - **Tenho um código** (ícone de chave): "Recebi um convite de alguém da família ou da turma."
  - **Criar um grupo** (ícone de +): "Para organizar o Natal, um aniversário ou um amigo secreto."
  Cada cartão abre direto o modal que já existia (entrar com código ou criar grupo).
- **Com grupos:** a lista vem primeiro, com o título "Seus grupos" e um botão secundário **"+ Adicionar"** à direita. Ele abre a janela **"Adicionar grupo"** com os mesmos dois cartões.
- **"Tenho um código" vem primeiro** nos dois casos, por ser o caminho mais comum.
- Os botões "Criar grupo novo" e "Entrar com código" foram removidos.
- Os dois cartões são o mesmo componente (`OpcoesDeGrupo`) nos dois lugares, com as cores de ícone do próprio app.

A proposta foi apresentada antes numa página com mockups de várias alternativas. O Lucas escolheu a combinação "B" (cartões explicados no estado vazio) com "F1" ("+" no título da lista).

### Heurísticas e princípios considerados
- **H2 – Correspondência com o mundo real:** os cartões falam da situação da pessoa ("Recebi um convite", "Para organizar o Natal") e não da operação do sistema.
- **H10 – Ajuda e documentação:** a explicação fica no próprio botão, no momento da escolha, sem precisar de uma tela de ajuda.
- **H6 – Reconhecer em vez de lembrar:** a pessoa reconhece seu caso no texto do cartão, em vez de lembrar o que significa "entrar com código".
- **H8 – Design estético e minimalista:** com grupos, as duas ações raras viram um só botão discreto, e a lista fica em primeiro plano.
- **H7 – Flexibilidade e eficiência:** quem não tem grupos vê as opções direto, sem passo a mais; quem já tem grupos não é atrapalhado por elas.
- **H4 – Consistência e padrões:** "+ Adicionar" usa o botão secundário do app, e a janela "Adicionar grupo" é o mesmo `Modal` centralizado das outras janelas.
- **Visibilidade de afordância (Dix):** o cartão inteiro é clicável, com borda, ícone e contorno de foco no teclado.

### Trade-offs / heurísticas em tensão
- **Um toque a mais × H8:** com grupos, criar ou entrar passou a exigir dois toques ("+ Adicionar" e depois a opção). Foi aceito porque são ações raras para quem já participa de grupos, e a lista ganhou destaque.
- **Janela centralizada × folha que sobe de baixo:** o mockup mostrava uma folha subindo do rodapé, mais comum no celular. Foi usado o `Modal` centralizado que o app já tem, para não criar um segundo tipo de janela (H4).
- **Texto curto × explicação completa:** as descrições cabem em duas ou três linhas num celular estreito. Detalhes como "quem é admin" ficam para o modal de criar.

### Regra da surpresa
Nada muda. A mudança só reorganiza como se chega aos modais de criar e entrar; nenhuma informação sobre quem escolheu presentes é mostrada.

### Como testar
1. Rodar `npm run dev`, entrar e abrir a Home na largura de celular.
2. **Com grupos:** a aba Grupos mostra "Seus grupos" com "+ Adicionar" à direita. Tocar nele abre "Adicionar grupo" com os dois cartões.
3. Tocar em "Tenho um código": abre o modal de código. Fechar, abrir de novo e tocar em "Criar um grupo": abre o modal de criar.
4. Fechar a janela pelo X, pelo Esc e tocando fora.
5. **Sem grupos** (conta nova): os dois cartões aparecem direto na aba, sem o "+ Adicionar".
6. **Teclado:** Tab passa pelos cartões com o contorno de foco visível, e Enter abre o modal certo.
7. **Celular estreito (360 px):** os textos dos cartões quebram em linhas sem serem cortados.

---

## Mudança 10: Home com um card e duas abas, presentes por grupo e sem a frase abaixo da saudação

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/pages/Home.jsx`, `src/pages/Integrante.jsx`

### Problema (antes)
A Home tinha a saudação, uma frase de resumo e **dois painéis**: "Grupos que estou participando" e "Presentes que escolhi comprar".
- **No celular, os painéis ficavam empilhados.** Quem tinha vários grupos precisava rolar a tela para descobrir que existia a lista de presentes embaixo. Isso fere a **H6 – Reconhecer em vez de lembrar** (uma das duas tarefas principais da tela ficava fora da vista) e a **H8 – Design minimalista** (duas listas longas competindo pela atenção).
- **A lista de presentes era corrida**, com o grupo repetido em cada linha ("Para Ana · Família Silva"). Era difícil ver o que já estava resolvido em cada grupo (**Facilidade de sintetizar, Dix**).
- **A frase abaixo da saudação** ("Você vai dar 5 presentes.") repetia números que já apareciam nos painéis (**H8**).
- **No computador**, a Home tinha até 1100 px de largura, com duas colunas, diferente das outras telas (Grupo, Perfil), que usam uma coluna mais estreita (**H4**).

### O que foi alterado (depois)
- Os dois painéis viraram **um card só**, com o componente `Abas` (o mesmo da tela do Grupo):
  - **"Grupos (n)"**: botões "Criar grupo novo" e "Entrar com código" e a lista de grupos, como antes.
  - **"Vou comprar (n)"**: os presentes que escolhi comprar, **separados por grupo**. Cada grupo tem um título com o nome e a contagem ("3 presentes"), e cada presente mostra só "Para Ana" (o grupo já está no título). O grupo com a escolha mais recente vem primeiro.
- O número de cada aba aparece entre parênteses, no mesmo formato das abas do Grupo ("Integrantes (3)"). Enquanto a página carrega, os números não aparecem.
- **A aba aberta fica no endereço:** `/` para "Grupos" e `/?aba=presentes` para "Vou comprar". Trocar de aba substitui o endereço (`replace`), para não criar um passo a mais no "voltar" do navegador.
- Na lista de um integrante aberta a partir da Home, a seta de voltar leva para `/?aba=presentes`, ou seja, de volta para a aba "Vou comprar".
- **A frase abaixo da saudação foi removida** (função `fraseDoDia`). Ela só existia na Home.
- A Home passou a ter a **mesma largura das outras telas** (`max-w-2xl`), numa coluna só.

A proposta foi apresentada antes numa página com mockups de antes e depois (celular, fluxo da volta e computador).

### Heurísticas e princípios considerados
- **H6 – Reconhecer em vez de lembrar:** as duas listas ficam visíveis logo no topo, como abas, sem rolar. O número em cada aba mostra o que tem na outra sem precisar abri-la.
- **H8 – Design estético e minimalista:** uma lista por vez; os botões de criar e entrar aparecem só na aba Grupos, onde fazem sentido; a frase repetida saiu; o nome do grupo deixou de se repetir em cada presente.
- **H4 – Consistência e padrões:** mesmo componente e mesmo formato de contagem das abas do Grupo; mesma largura das outras telas. O nome "Vou comprar" é o mesmo do botão que marca um presente na lista de alguém.
- **Facilidade de generalizar (Dix):** quem aprendeu as abas do Grupo já sabe usar as da Home.
- **Facilidade de sintetizar (Dix):** com os presentes separados por grupo, a pessoa vê o que já resolveu em cada família ou turma.
- **H3 – Controle e liberdade do usuário:** a volta da lista de um integrante cai na mesma aba de onde a pessoa saiu (o guia pede "botão voltar coerente com a origem").
- **H2 – Correspondência com o mundo real:** "Vou comprar" usa a linguagem da própria ação do app, em vez de "Presentes que escolhi comprar", que não caberia numa aba no celular.

### Trade-offs / heurísticas em tensão
- **Uma lista escondida × H6:** com abas, uma das listas fica fora da vista. Foi compensado com o número em cada aba. No computador, onde antes as duas apareciam lado a lado, a perda é maior, mas foi aceita para ter um layout só e a mesma largura das outras telas (H4).
- **Contagem entre parênteses × pílula:** o mockup mostrava o número numa pílula cinza; na implementação foi usado o formato do Grupo, "(3)", para os números das abas terem a mesma aparência nas duas telas (H4).
- **Ordem dos grupos na aba "Vou comprar":** segue a escolha mais recente, e não a ordem da aba Grupos. Assim, o que a pessoa acabou de escolher aparece no topo.

### Regra da surpresa
A aba "Vou comprar" mostra só os presentes que **eu** escolhi para os **outros**, como a Home já mostrava. Nenhuma informação sobre quem escolheu os meus presentes aparece; a consulta ao banco não mudou.

### Como testar
1. Rodar `npm run dev`, entrar e abrir a Home no DevTools com a largura de celular.
2. Ver "Olá, Lucas" sem a frase embaixo e o card com "Grupos (n)" e "Vou comprar (n)". A aba Grupos vem aberta.
3. Trocar para "Vou comprar": presentes separados por grupo, e o endereço vira `/?aba=presentes`.
4. Tocar num presente e, na lista da pessoa, tocar na seta: volta para a aba "Vou comprar".
5. Recarregar `/?aba=presentes`: abre direto na aba de presentes.
6. Com uma conta sem grupos ou sem presentes: as mensagens de lista vazia aparecem na aba certa.
7. No computador: a Home fica numa coluna, na largura do Grupo e do Perfil.
8. Com o teclado: Tab chega nas abas e Enter troca de aba.

---

## Mudança 9: Seta de voltar na Política de privacidade, de volta para a origem

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/pages/Privacidade.jsx`, `src/pages/BoasVindas.jsx`, `src/pages/Cadastro.jsx`, `src/pages/Perfil.jsx`

### Problema (antes)
A Política de privacidade era a única tela interna sem a seta de voltar ao lado da logo. Ela pode ser aberta das Boas-vindas, do Cadastro e do Perfil, mas a única saída era um link "Voltar para o início" no **fim** da página (depois de todo o texto), que apontava para `/`. Para quem estava deslogado depois de "Sair da conta", esse link levava ao Login, o mesmo defeito que a logo tinha antes da Mudança 7. Isso fere:
- **H3 – Controle e liberdade do usuário:** não havia saída visível no topo, e a saída do fim não voltava para a tela de origem;
- **H4 – Consistência e padrões:** todas as outras telas internas têm a seta no mesmo lugar.

### O que foi alterado (depois)
- Os três links "Política de privacidade" passaram a avisar de onde vieram (`state={{ de: 'boas-vindas' | 'cadastro' | 'perfil' }}`), o mesmo padrão que a Home já usa para a lista do integrante.
- A Política ganhou a seta no cabeçalho, com destino e dica de acordo com a origem. O link do fim da página usa o mesmo destino e o mesmo texto:

| Veio de | A seta (e o link do fim) leva para | Dica |
|---|---|---|
| Boas-vindas | Boas-vindas | Voltar para o início |
| Cadastro | Cadastro | Voltar para o cadastro |
| Perfil | Perfil | Voltar para o perfil |
| Endereço digitado / sem origem | Home (logado) ou boas-vindas (deslogado) | Voltar para o início |

### Heurísticas e princípios considerados
- **H3 – Controle e liberdade do usuário:** saída visível no topo, que volta para a tela de origem (o guia pede "botão voltar coerente com a origem").
- **H4 – Consistência e padrões:** a Política tem a mesma seta, no mesmo lugar, das outras telas. O link do fim e a seta fazem a mesma coisa.
- **Previsibilidade (Dix) / H1:** a dica diz exatamente para onde a seta vai ("Voltar para o cadastro"). Por isso foi usado um destino fixo por origem, e não o "voltar" do histórico do navegador, que poderia tirar a pessoa do app quando ela abre a página por um link externo.

### Trade-offs / heurísticas em tensão
- **Dados do Cadastro perdidos (pendente, H5):** quem está preenchendo o Cadastro, abre a Política e volta encontra o formulário vazio, porque ele é recriado. A seta não causou isso (o problema já existia com o link), mas ele fica mais visível agora que a volta é fácil. Fica para uma mudança futura (ex.: abrir a política sem sair do Cadastro ou guardar o que foi digitado).

### Regra da surpresa
A mudança é só de navegação na página de política. Nenhum dado de presentes ou de escolhas é exibido.

### Como testar
1. Boas-vindas → Política: seta e link do fim dizem "Voltar para o início" e levam às boas-vindas.
2. Cadastro → Política: "Voltar para o cadastro".
3. Perfil (logado) → Política: "Voltar para o perfil".
4. Digitar `/privacidade` na barra de endereço: "Voltar para o início" (Home se logado, boas-vindas se não).

---

## Mudança 8: Erros do cadastro junto do campo, com solução e sem o balão do navegador

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/pages/Cadastro.jsx`, `src/components/Campo.jsx`, `src/lib/erros.js`

### Problema (antes)
- **Erro longe do campo:** todos os erros do Cadastro (senha curta, senhas diferentes, e-mail já cadastrado) apareciam num aviso único em cima do botão "Criar conta", e não embaixo do campo com problema. A pessoa precisava ler o aviso e procurar qual campo corrigir. O `Campo` já sabia mostrar erro embaixo do input (prop `erro`), mas o Cadastro não usava.
- **Balão do navegador:** se o nome ou o e-mail ficassem vazios (ou o e-mail sem formato de e-mail), aparecia o balão nativo do navegador (atributos `required` e `type="email"`). Ele tem um visual diferente em cada navegador, fora do estilo do app, com mensagem genérica, e some sozinho em segundos.
- **Mensagens sem solução:** várias diziam só o problema ("As senhas não são iguais.", "Confira os dados digitados.", "Algo deu errado. Tente novamente.").

Isso fere a **H9 – Ajudar a reconhecer, diagnosticar e recuperar-se de erros** (o erro deve ficar junto do campo e sugerir a solução) e a **H4 – Consistência** (o balão do navegador tem cara diferente dos outros erros).

### O que foi alterado (depois)
- **Erro em cada campo:** o Cadastro guarda um erro por campo e passa cada um para o seu `Campo` (borda vermelha, mensagem embaixo, `aria-invalid`). O aviso em cima do botão ficou só para erros que não são de nenhum campo (sem internet, muitas tentativas).
- **Sem o balão do navegador:** o formulário ganhou `noValidate`. A nova função `validar()` confere os quatro campos de uma vez. `required` e `type="email"` continuam nos campos (o leitor de tela anuncia "obrigatório" e o celular abre o teclado com @).
- **Foco no primeiro campo com erro**, na ordem da tela. Quando há vários erros, todos aparecem juntos.
- **O erro de um campo some quando a pessoa digita nele.**
- **Acessibilidade:** a mensagem de erro do `Campo` ficou ligada ao input por `aria-describedby`; quando o foco chega no campo, o leitor de tela lê o rótulo e o erro juntos.
- **Erros do servidor no campo certo:** nova função `campoDoErro()` em `lib/erros.js` (lugar único dos erros): "e-mail já existe" e "e-mail inválido" (`validation_failed`) vão para o E-mail; "senha fraca" vai para a Senha.
- **E-mail sem espaços nas pontas** no envio, igual ao que a validação confere.
- **Mensagens no formato "o que aconteceu + o que fazer":**

| Campo | Situação | Mensagem |
|---|---|---|
| Nome | vazio | Digite seu nome. É assim que você aparece para sua família. |
| E-mail | vazio | Digite seu e-mail. Você vai usá-lo para entrar no app. |
| E-mail | formato inválido | Este e-mail não parece válido. Confira se está escrito certo (ex.: nome@exemplo.com). |
| E-mail | já tem conta | Já existe uma conta com este e-mail. Entre pela tela de login ou use outro e-mail. |
| Senha | vazia | Crie uma senha com pelo menos 8 caracteres. |
| Senha | curta | A senha está curta. Use pelo menos 8 caracteres. |
| Confirmar | vazio | Repita a senha para confirmar. |
| Confirmar | diferente | As senhas não são iguais. Toque no olho para conferir o que digitou. |
| (geral) | erro desconhecido | Não foi possível concluir agora. Espere um instante e tente de novo. |

### Heurísticas e princípios considerados
- **H9 – Ajudar a reconhecer, diagnosticar e recuperar-se de erros:** o erro aparece junto do campo, em linguagem simples, sem código, dizendo o problema e a solução. O foco leva a pessoa direto ao que precisa corrigir.
- **H4 – Consistência e padrões:** todos os erros do formulário têm a mesma aparência (os do app), e não mais dois estilos (o aviso do app e o balão do navegador).
- **H1 – Visibilidade do status do sistema:** a borda vermelha mostra quais campos têm problema, e o erro some quando a pessoa corrige, sem deixar um aviso desatualizado na tela.
- **H6 – Reconhecer em vez de lembrar:** a dica "Toque no olho para conferir o que digitou" usa o botão de mostrar a senha que já existe, para a pessoa ver o que digitou em vez de tentar lembrar.
- **H2 – Correspondência com o mundo real:** as mensagens explicam o porquê com palavras do app ("É assim que você aparece para sua família").
- **Recuperabilidade (Dix):** corrigir é direto: o foco está no campo e o erro some ao digitar.
- **Acessibilidade:** `aria-invalid` e `aria-describedby` ligam o erro ao campo; o erro não depende só da cor (há texto).

### Trade-offs / heurísticas em tensão
- **`role="alert"` × `aria-describedby`:** o guia sugere `role="alert"` nos erros. Como o foco vai até o campo com erro, o `aria-describedby` já faz o leitor de tela ler a mensagem; com os dois, o erro seria lido duas vezes.
- **Login continua com o aviso geral:** "E-mail ou senha incorretos." não diz qual dos dois está errado, de propósito (segurança: não confirma a um estranho que o e-mail tem conta). Por isso ele não foi movido para um campo.
- **Outras telas ainda com o balão do navegador (pendente, H4):** Login, Esqueci a senha, Nova senha, Perfil e os modais ainda mostram o balão nativo quando um campo obrigatório fica vazio. Fica para uma próxima mudança levar o mesmo padrão a elas.
- **Mensagens compartilhadas:** as mensagens de "e-mail já existe", "e-mail inválido" e erro desconhecido ficam no `lib/erros.js` e valem para o app inteiro (no "Esqueci a senha", o e-mail inválido aparece no aviso geral, que lá faz sentido porque só existe o campo de e-mail).

### Regra da surpresa
A mudança é só no formulário de cadastro, antes do login. Nenhum dado de presentes ou de escolhas é exibido.

### Como testar
1. Cadastro, tudo vazio → "Criar conta": os 4 erros aparecem embaixo de cada campo, sem balão do navegador, e o cursor vai para Nome.
2. E-mail `lucas` ou `lucas@gmail`: "Este e-mail não parece válido…" embaixo do E-mail.
3. Senha `123`: "A senha está curta…" embaixo de Senha. Senhas diferentes: erro embaixo de Confirmar senha.
4. Digitar num campo com erro: a mensagem dele some.
5. E-mail já cadastrado: "Já existe uma conta com este e-mail…" embaixo do E-mail.
6. Sem internet (DevTools → Network → Offline): a mensagem aparece no aviso em cima do botão.

---

## Mudança 7: A logo leva sempre ao início

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/components/Cabecalho.jsx` (efeito em todas as telas com cabeçalho)

### Problema (antes)
A logo do cabeçalho apontava para `/`. Para quem estava logado, isso era a Home. Para quem não estava, `/` é uma tela protegida, e o app redirecionava para um destino que dependia de **como a pessoa tinha saído**:
- se nunca tinha entrado (ou apagou a conta): `/` → boas-vindas;
- se tinha clicado em "Sair da conta": o app guardava "depois de sair, vá para o login", e `/` → login.

Com isso, depois de sair da conta, **tocar na logo na tela de Login não fazia nada** (mandava para a própria tela), e no Cadastro levava ao Login em vez da capa. O mesmo elemento tinha resultados diferentes e, num caso, nenhum resultado. Isso fere:
- **H4 – Consistência e padrões:** a mesma logo levava a lugares diferentes;
- **H1 – Visibilidade do status do sistema:** um toque sem resposta visível parece defeito;
- **Previsibilidade (Dix):** não dava para prever o resultado do toque.

### O que foi alterado (depois)
- O `Cabecalho` passou a consultar se há alguém logado (`useAuth`) e escolhe o destino da logo diretamente, sem depender do redirecionamento de `/`:

| Situação | A logo leva para |
|---|---|
| Logado (Home, Grupo, Perfil, Integrante, Privacidade) | Home (`/`) |
| Deslogado (Login, Cadastro, Esqueci a senha, Privacidade, Página não encontrada) | Boas-vindas (`/boas-vindas`) |

- O redirecionamento depois de "Sair da conta" (ir para o login) não mudou; só a logo deixou de depender dele.

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** a logo tem um significado só, "ir para o início", em todas as telas. Isso completa a Mudança 3, que colocou a logo no mesmo lugar em todas as telas: agora ela também faz sempre a mesma coisa. Na consistência externa, "logo leva à página inicial" é a convenção da web.
- **Previsibilidade (Dix):** o resultado do toque não depende mais do histórico (como a pessoa saiu).
- **H1 – Visibilidade do status do sistema:** todo toque na logo agora tem um resultado visível; não existe mais o caso em que nada acontece.
- **H3 – Controle e liberdade do usuário:** a logo funciona como saída de emergência confiável para o início, inclusive nas telas de acesso.
- **H2 – Correspondência com o mundo real:** para quem não tem conta ou saiu, o "início" do app é a capa de boas-vindas (a "porta de entrada"), onde estão as duas opções: criar conta ou entrar.

### Trade-offs / heurísticas em tensão
- **Deslogado: boas-vindas ou login?** Depois de "Sair da conta", a pessoa cai no Login; se tocar na logo, vai para as boas-vindas, que estão um passo antes. Foi escolhido assim porque as boas-vindas são o início de quem não está logado, e o destino da logo fica igual para todos os deslogados (H4). Quem quer entrar de novo tem o "Já tenho conta" na capa.
- **Redundância com a seta:** em várias telas, a seta e a logo levam ao mesmo lugar. Já tinha sido aceito na Mudança 3 (Facilidade de substituir, Dix).

### Regra da surpresa
A mudança é só no destino do link da logo. Nenhum dado de presentes ou de escolhas é exibido ou alterado.

### Como testar
1. Rodar `npm run dev`.
2. Logado: tocar na logo no Grupo, no Perfil e na lista de um integrante. Deve ir sempre para a Home.
3. Clicar em "Sair da conta" no Perfil. No Login, tocar na logo: deve ir para as boas-vindas (antes não acontecia nada).
4. Deslogado: tocar na logo no Cadastro, no Esqueci a senha e na Página não encontrada. Deve ir para as boas-vindas.

---

## Mudança 6: "Sair da conta" sai do cabeçalho e vira botão no Perfil

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/pages/Perfil.jsx`, `src/components/Botao.jsx`
**Revê:** parte da Mudança 5 (o "Sair" vermelho no cabeçalho do Perfil e a variante `textoPerigo`).

### Problema (antes)
Depois da Mudança 5, o "Sair" da conta ficava no canto direito do cabeçalho do Perfil, como um texto vermelho pequeno. Isso tinha três problemas:
- **H4 – Consistência:** o canto direito do cabeçalho é usado para ações *da tela* (⚙ "Editar grupo"). Sair da conta é uma ação da *conta*, que já tem seu lugar no corpo do Perfil (nome, apagar conta).
- **H8 – Design minimalista:** no cabeçalho, o "Sair" competia com a navegação (seta e logo) e era a única ação de texto num cabeçalho só de ícones.
- **H6 – Reconhecer em vez de lembrar:** um texto pequeno no canto é fácil de não ver. Quem procura "como saio?" olha primeiro para a lista de opções da conta.

### O que foi alterado (depois)
- O cabeçalho do Perfil ficou só com a seta de voltar e a logo centralizada.
- No corpo da página, logo abaixo do painel "Seu nome", entrou o botão **"Sair da conta"**: largura total, variante `perigo` (vermelho com borda) e `IconeSair`. O comportamento não mudou: desloga e leva ao login.
- A variante `textoPerigo` do `Botao`, criada na Mudança 5 só para o "Sair" do cabeçalho, ficou sem uso e foi removida. O comentário do `Botao` agora diz que a variante `perigo` serve para ações destrutivas e para "sair".

Ordem do Perfil, de cima para baixo: cabeçalho (← · logo) → foto, nome e e-mail → painel "Seu nome" → **Sair da conta** → linha divisória → "Apagar conta" (título vermelho, explicação, botão "Apagar minha conta") → Política de privacidade.

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** o cabeçalho fica só com a navegação e as ações da tela. As ações da conta ficam juntas no corpo do Perfil. O botão continua vermelho, como todo "sair" do app (Mudança 5). Na consistência externa, "sair da conta" dentro da página de perfil ou configurações é o padrão de muitos apps.
- **H6 – Reconhecer em vez de lembrar:** um botão grande e com texto, junto das outras opções da conta, é encontrado sem procurar.
- **H2 – Correspondência com o mundo real:** "Sair da conta" diz exatamente o que acontece, melhor que só "Sair".
- **H8 – Design estético e minimalista:** o cabeçalho fica mais limpo (seta e logo), e a hierarquia da página fica clara: editar o nome, sair, e por fim a zona de perigo.
- **H5 – Prevenção de erros:** "Sair da conta" e "Apagar minha conta" são vermelhos e ficam perto, mas não se confundem:
  - **tamanho:** sair ocupa a largura toda, e apagar é um botão menor;
  - **ícone:** sair tem a porta com seta, e apagar tem a lixeira;
  - **separação:** apagar fica numa seção própria, depois de uma linha divisória, com título vermelho e explicação;
  - **confirmação:** apagar pede confirmação antes de qualquer efeito.
- **Acessibilidade:** o alvo de toque é maior que o do texto no cabeçalho, e o texto "Sair da conta" é lido pelo leitor de tela sem depender de `aria-label`.

### Trade-offs / heurísticas em tensão
- **Dois botões vermelhos próximos:** existe um risco pequeno de a pessoa confundir "sair" com "apagar" (H5). Foi aceito pelas diferenças listadas acima e porque "apagar" exige confirmação. Se em testes ainda parecer confuso, uma opção é deixar "Sair da conta" com a variante `secundario` (neutra), abrindo mão da cor única para todo "sair" (Mudança 5).
- **Mais um passo para sair?** Não: o "Sair" continua na mesma tela (Perfil), só em outro lugar, e ainda sem confirmação, porque é fácil de desfazer (basta entrar de novo).
- **Borda do botão `perigo`:** a borda vermelha clara (`negativo/40`) tem pouco contraste (pendência da Mudança 1). O botão é reconhecido pelo texto e pelo ícone vermelhos (6,6:1), mas a borda fica para uma mudança futura.

### Regra da surpresa
A mudança é só no lugar e na aparência do botão de sair. Nenhum dado de presentes ou de escolhas é exibido ou alterado.

### Como testar
1. Rodar `npm run dev` e abrir no DevTools com a largura de celular.
2. Perfil: o cabeçalho tem só a seta e a logo centralizada.
3. Abaixo do painel "Seu nome", o botão vermelho de largura total "Sair da conta". Ao tocar, desloga e leva ao login.
4. Conferir que "Sair da conta" e "Apagar minha conta" ficam bem distintos.

---

## Mudança 5: Botões de sair em vermelho e "Sair do grupo" só com ícone

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/components/Cabecalho.jsx` (`BotaoIcone`), `src/components/Botao.jsx`, `src/pages/Grupo.jsx`, `src/pages/Perfil.jsx`

### Problema (antes)
- **"Sair do grupo" tirava a logo do centro.** No cabeçalho do Grupo, quem não é admin via um botão de texto "Sair do grupo" (cerca de 135 px, estimativa) à direita. Num celular de 360 a 390 px de largura, ele era mais largo que o espaço de um dos lados, e a logo centralizada (Mudança 3) deslizava para a esquerda. Isso quebra a **H4 – Consistência**, porque a logo deixa de ficar no mesmo ponto em todas as telas.
- **O mesmo lugar fazia coisas diferentes com a mesma aparência neutra.** No canto direito do Grupo, o admin via a ⚙ "Editar grupo" e os outros viam "Sair do grupo", ambos em cinza ou preto. Uma ação de configuração e uma ação que tira a pessoa do grupo (e apaga a lista dela) tinham o mesmo peso visual (H4, ponto já levantado no guia).
- **Os "sair" do app não tinham a mesma aparência.** O "Sair" da conta, no Perfil, era um texto preto, e o "Sair do grupo" da confirmação era vermelho.

### O que foi alterado (depois)
- O `BotaoIcone` ganhou a prop `perigo`: ícone vermelho (`text-negativo`) e hover vermelho-claro (`hover:bg-negativo-claro`). Sem a prop, ele continua cinza.
- O `Botao` ganhou a variante `textoPerigo`: igual à `texto` (sem borda), mas com texto e ícone vermelhos e hover vermelho-claro.
- No Grupo, para quem não é admin, o botão de texto "Sair do grupo" virou um `BotaoIcone perigo` com o `IconeSair` (40 × 40 px, o mesmo tamanho da ⚙). O `aria-label` e a dica (`title`) continuam dizendo "Sair do grupo".
- No Perfil, o "Sair" da conta passou para `variante="textoPerigo"`, mantendo o texto.

| Botão | Antes | Depois |
|---|---|---|
| "Sair do grupo" no cabeçalho do Grupo (não-admin) | Texto + ícone, preto | Só o ícone, vermelho |
| "Sair" no cabeçalho do Perfil | Texto + ícone, preto | Texto + ícone, vermelho |
| "Sair do grupo" na confirmação | Vermelho (`perigo`) | Igual |
| ⚙ "Editar grupo" (admin) | Ícone cinza | Igual |

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** todas as ações de sair têm a mesma cor, em todas as telas. No canto direito do Grupo, a ação destrutiva (vermelha) agora se diferencia da configuração (cinza). E, com o botão do mesmo tamanho da ⚙, a logo fica no centro em qualquer largura de celular.
- **H2 – Correspondência com o mundo real / Familiaridade (Dix):** vermelho é a convenção de "atenção, ação com consequência", e é a mesma cor que o projeto já usa no botão `perigo` e nas confirmações.
- **H5 – Prevenção de erros:** a cor pede atenção antes do toque. No "Sair do grupo", um toque errado não tem efeito, porque a confirmação "Sair do grupo?" (que explica que a lista será apagada) continua antes da ação.
- **H8 – Design estético e minimalista:** o cabeçalho do Grupo fica mais limpo, com dois ícones nos cantos e a logo no centro.
- **Acessibilidade:**
  - O vermelho `#b42318` tem contraste de **6,6:1** sobre o branco e de 5,7:1 sobre o fundo do hover, acima de 4,5:1.
  - O significado não depende só da cor: o "Sair do grupo" usa um ícone diferente da ⚙ e tem `aria-label`/`title`, e o "Sair" do Perfil mantém o texto.

### Trade-offs / heurísticas em tensão
- **Ícone sem texto × H6 (Reconhecer em vez de lembrar):** "Sair do grupo" só com ícone é menos explícito que o texto. Foi aceito porque o ícone de sair é uma convenção conhecida, porque a dica e o `aria-label` dizem o nome da ação, e porque a confirmação explica o que vai acontecer antes de qualquer efeito.
- **Vermelho no "Sair" da conta:** pelo `index.css`, o vermelho é "só para erro e ações perigosas", e sair da conta não apaga nada (basta entrar de novo). A escolha foi deixar vermelho mesmo assim, para que todo "sair" do app tenha a mesma aparência (H4) e porque é uma ação que interrompe o uso. O "Sair" da conta continua sem confirmação, porque é fácil de desfazer.
- **Mesmo ícone para duas ações:** "Sair do grupo" e "Sair" da conta usam o mesmo `IconeSair`. O contexto (tela de Grupo × tela de Perfil) e o texto/dica diferenciam as duas. Se gerar confusão em testes, dá para usar outro desenho no grupo.

### Regra da surpresa
A mudança é só na aparência dos botões de sair. Nenhum dado de presentes ou de escolhas é exibido ou alterado.

### Como testar
1. Rodar `npm run dev` e abrir no DevTools com a largura de celular (testar também com 360 px).
2. Grupo como **não-admin:** seta à esquerda, logo no centro (no mesmo ponto da Home) e ícone vermelho à direita. Passando o mouse, aparece "Sair do grupo" e um fundo vermelho-claro. Ao tocar, abre a confirmação.
3. Grupo como **admin:** a ⚙ cinza continua igual.
4. Perfil: "Sair" em vermelho. Ao tocar, desloga e leva ao login.

---

## Mudança 4: Topo fixo e conteúdo logo abaixo nas telas de acesso

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/components/TelaAuth.jsx` (efeito em Login, Cadastro, Esqueci a senha, Nova senha e Página não encontrada)

### Problema (antes)
Nas telas de acesso, tudo era centralizado na vertical (`justify-center`): a seta e a logo, o título, o formulário e os links formavam um bloco que flutuava no meio da tela. Em celulares altos sobrava um vazio grande em cima e embaixo, e a tela parecia "pequena". A navegação (seta e logo) não ficava onde o usuário espera encontrá-la, no topo, e a posição dela era diferente da posição nas telas logadas, onde o cabeçalho fica sempre no alto. Isso fere a **H4 – Consistência e padrões** e enfraquece a **H3**, porque a saída (seta) mudava de lugar conforme a altura do celular.

### O que foi alterado (depois)
- O cabeçalho (o mesmo `Cabecalho` das telas logadas, ver Mudança 3) fica preso no topo, na mesma altura das outras telas.
- O conteúdo (título, formulário, botão e links) começa logo abaixo, com um espaço fixo de 32 px (`pt-8`), o mesmo que a Home usa entre o cabeçalho e a saudação. O espaço livre fica no fim da tela.
- Os links "Já tem conta? Entrar", "Ainda não tem conta? Criar conta", "Esqueceu a senha?" e "Política de privacidade" continuam logo abaixo do botão principal, como antes.

### Como se chegou a essa versão
1. **Proposta inicial (três zonas):** cabeçalho no topo, formulário no terço de cima e links presos no rodapé da tela. **Descartada**, porque os links são alternativas à ação principal e devem ficar perto do botão.
2. **Só o topo preso, conteúdo centralizado no espaço que sobra:** testada no iPhone 16 Pro Max. **Descartada**, porque num celular alto ficava um vão grande entre a logo e o título, e o bloco parecia solto, um pouco abaixo do meio.
3. **Centro "ótico" (bloco no terço de cima)** e **centralizado em relação à tela inteira:** consideradas. Diminuiriam o problema, mas ainda sobraria um vão no topo em celulares altos.
4. **Conteúdo logo abaixo do cabeçalho (adotada).**

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** na consistência *interna*, as telas de acesso passam a ter o cabeçalho no mesmo lugar e o mesmo espaçamento (32 px) até o conteúdo que as telas logadas. Na *externa*, cabeçalho no alto e formulário logo abaixo é o layout de formulário mais comum em apps.
- **Familiaridade (Dix):** o usuário reconhece a estrutura de outros apps e sabe onde procurar a navegação.
- **H3 – Controle e liberdade do usuário:** a seta de voltar (Mudança 2) fica sempre no canto superior esquerdo, em qualquer altura de celular.
- **H6 – Reconhecer em vez de lembrar:** os links alternativos continuam junto do botão, à vista no momento da decisão.
- **Acessibilidade / contexto de uso (mobile first):** no celular, o teclado ocupa a metade de baixo da tela. Com o formulário no alto, os campos e o botão continuam visíveis enquanto a pessoa digita.
- **H8 – Design estético e minimalista:** o vão sem função entre a navegação e o conteúdo some. O espaço livre vai para o fim da tela, onde a leitura termina.

### Trade-offs / heurísticas em tensão
- **Equilíbrio visual × uso real:** num celular alto, sem o teclado, sobra espaço vazio embaixo e a tela pode parecer "pesada em cima". Foi aceito porque é o padrão de formulários e porque, quando a pessoa usa a tela de verdade (digitando), o teclado ocupa essa área.
- **Tela de boas-vindas** continua centralizada: ela é a capa do app, com poucos elementos e uma decisão só, e não um formulário.

### Regra da surpresa
A mudança é só de posicionamento nas telas de acesso, antes do login. Nenhum dado de presentes ou de escolhas é exibido.

### Como testar
1. Rodar `npm run dev` e abrir no DevTools com a largura de celular (testar também numa tela alta, como a do iPhone 16 Pro Max, e numa pequena, com 360 px de largura).
2. Login e Cadastro: cabeçalho no topo, título 32 px abaixo, sem vão grande. Links logo abaixo do botão.
3. Tocar num campo do Cadastro no celular: o campo e o botão devem continuar visíveis com o teclado aberto.
4. Esqueci a senha, Nova senha e Página não encontrada: o mesmo alinhamento.

---

## Mudança 3: Logo no mesmo lugar, no centro do cabeçalho, em todas as telas

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/components/Cabecalho.jsx`, `src/components/TelaAuth.jsx`, `src/pages/NaoEncontrada.jsx`, `src/pages/Grupo.jsx`, `src/pages/Integrante.jsx`, `src/pages/Perfil.jsx`

### Problema (antes)
O mesmo canto da tela mostrava coisas diferentes conforme a tela:

| Tela | Topo à esquerda (antes) |
|---|---|
| Home, Privacidade | Logo |
| Grupo, Integrante, Perfil | Só a seta de voltar, sem logo (a seta *substituía* a logo) |
| Login, Cadastro, Senhas | Seta + logo, num cabeçalho próprio do `TelaAuth` |
| Página não encontrada | Logo **sem link** |
| Boas-vindas | Símbolo grande, como capa |

Isso fere a **H4 – Consistência e padrões** (consistência interna: o mesmo lugar não faz sempre a mesma coisa) e a **Facilidade de generalizar (Dix)**: o que o usuário aprende numa tela ("a logo me leva ao início") não vale nas outras.

### O que foi alterado (depois)
- O `Cabecalho` virou o cabeçalho de **todas** as telas (menos a capa de boas-vindas), em **3 colunas**: seta de voltar (opcional) | **logo, sempre no centro** | ação da tela (opcional, ex.: ⚙ ou "Sair"). As colunas dos lados têm a mesma largura, então a logo fica no mesmo ponto com ou sem seta e com qualquer ação.
- A prop `esquerda` (que substituía a logo) virou `voltar` (que fica ao lado dela). Grupo, Integrante e Perfil passaram a usar `voltar=` e agora mostram seta + logo.
- A logo leva sempre a `/`: quem está logado vai para a Home, e quem não está é redirecionado pelas rotas para as boas-vindas (ou para o login).
- O `TelaAuth` (Login, Cadastro e telas de senha) deixou de ter cabeçalho próprio e usa o `Cabecalho`. A Página não encontrada passou a usar o `TelaAuth` e, com ele, o mesmo cabeçalho, ganhando o link na logo.
- A seta de voltar foi deslocada 8 px para a esquerda (`-ml-2`) em todas as telas, para que o desenho da seta (e não o círculo do hover) fique alinhado com o texto abaixo.
- Com isso, o ajuste feito no `BotaoIcone` na Mudança 2 (aceitar `className`) deixou de ser usado, mas foi mantido porque não muda nada para quem não o usa.

| Tela | Cabeçalho (depois) |
|---|---|
| Home | — · logo · ⚙ |
| Grupo | ← · logo · ⚙ (admin) ou "Sair do grupo" |
| Perfil | ← · logo · Sair |
| Integrante | ← · logo · — |
| Login, Cadastro, Senhas | ← · logo · — |
| Página não encontrada, Privacidade | — · logo · — |
| Boas-vindas | sem mudança (capa centralizada com o símbolo grande) |

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** a logo fica no mesmo lugar e faz a mesma coisa (leva ao início) em todas as telas. Como existe **um único componente** de cabeçalho, a consistência é garantida pelo código: não dá para uma tela nova "esquecer" a logo. A seta sozinha no canto esquerdo é a convenção de "voltar" dos apps de celular (consistência externa).
- **Facilidade de generalizar (Dix):** o que se aprende numa tela vale em todas.
- **H6 – Reconhecer em vez de lembrar:** a identidade do app fica sempre à vista, inclusive para quem chega por um link direto para um grupo.
- **Facilidade de substituir (Dix):** no Grupo e no Perfil, a seta e a logo levam ao início; são duas formas de fazer a mesma coisa.
- **H2 / Familiaridade (Dix):** logo centralizada e seta à esquerda é um padrão conhecido de apps no celular. O eixo central também continua o da capa de boas-vindas.

### Trade-offs / heurísticas em tensão
- **Logo à esquerda × no centro.** A primeira versão implementada colocava a logo à esquerda, ao lado da seta. Ela foi comparada lado a lado com a logo no centro, e a versão central foi escolhida:
  - À esquerda, a logo andava uns 30 px para a direita quando aparecia a seta, o que contradizia o objetivo da mudança (H4). No centro, ela não se mexe.
  - Custo aceito (H8): no centro, a logo sai da margem esquerda do texto, e no computador, na Home (1100 px de largura), ela fica mais isolada.
- **Ação larga à direita.** No Grupo, para quem não é admin, o botão "Sair do grupo" é mais largo que o espaço de um dos lados num celular estreito. A grade não deixa nada se sobrepor, mas a logo pode deslizar alguns pixels para a esquerda. Fica como possível mudança futura (ex.: botão só com ícone e a dica "Sair do grupo"), que também resolveria o ponto do guia sobre esse lugar fazer coisas diferentes para admin e não-admin.
- **Redundância:** seta e logo levando ao mesmo lugar no Grupo e no Perfil foi aceito (Facilidade de substituir).

### Regra da surpresa
A mudança é só no cabeçalho (logo e navegação). Nenhum dado de presentes ou de escolhas é exibido ou alterado.

### Como testar
1. Rodar `npm run dev` e abrir no DevTools com a largura de celular.
2. Home: logo no centro, ⚙ à direita.
3. Grupo (como admin e como não-admin), Perfil e lista de um integrante: seta à esquerda, logo no centro, no mesmo ponto da Home. A seta volta para onde voltava antes; a logo leva à Home.
4. Login, Cadastro, Esqueci a senha: seta à esquerda e logo no centro. Deslogado, a logo leva às boas-vindas.
5. Página não encontrada (ex.: `/qualquercoisa`): logo no centro, agora clicável.
6. Com o teclado: o Tab passa pela seta, pela logo e pela ação, nessa ordem, com o contorno de foco visível.

---

## Mudança 2: Seta de voltar no topo das telas de login, cadastro e senha

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/components/TelaAuth.jsx`, `src/components/Cabecalho.jsx` (`BotaoIcone`), `src/pages/Login.jsx`, `src/pages/Cadastro.jsx`, `src/pages/EsqueciSenha.jsx`, `src/pages/NovaSenha.jsx`

### Problema (antes)
Quem tocava em "Criar conta" por engano (porque já tinha conta) não tinha uma saída clara. A única opção explícita era o link "Já tem conta? Entrar", no rodapé, depois dos 4 campos e do botão. No celular ele podia ficar fora da tela sem rolar. Também existia a logo no topo, que leva às boas-vindas, mas nada indicava que ela era clicável. Isso fere a **H3 – Controle e liberdade do usuário**, que pede uma "saída de emergência" clara para quem entrou num estado indesejado. O mesmo valia para o Login (quem não tinha conta) e para o Esqueci a senha.

### O que foi alterado (depois)
- O `TelaAuth` (moldura comum das telas de autenticação) ganhou a prop opcional `voltar={{ para, rotulo }}`. Quando ela é passada, aparece no topo, à esquerda da logo, um botão redondo com seta (`BotaoIcone` + `IconeVoltar`), o mesmo usado na tela do Grupo.
- O destino respeita a origem de cada tela:

| Tela | A seta leva para |
|---|---|
| Login | Boas-vindas ("Voltar para o início") |
| Cadastro e "Confira seu e-mail" do cadastro | Boas-vindas ("Voltar para o início") |
| Esqueci a senha (as duas etapas) | Login ("Voltar para o login") |
| Nova senha → "Link inválido ou expirado" | Login ("Voltar para o login") |
| Nova senha → formulário | Sem seta (a pessoa chega por um link do e-mail, não há tela anterior no app) |

- O `BotaoIcone` passou a aceitar um `className` extra, que é somado ao estilo padrão. Foi usado para alinhar a seta com o texto abaixo (`-ml-2`). Os usos antigos não mudaram.
- O link do rodapé ("Já tem conta? Entrar" / "Ainda não tem conta? Criar conta") foi mantido como caminho alternativo.

### Heurísticas e princípios considerados
- **H3 – Controle e liberdade do usuário:** a saída de emergência fica visível desde o primeiro momento, no topo, antes de a pessoa começar a preencher o formulário. Ela não depende de rolar a tela nem de adivinhar que a logo é clicável. O destino é coerente com a origem (o Esqueci a senha volta para o login, de onde a pessoa veio), como o guia recomenda.
- **Recuperabilidade (Dix):** quem percebe que escolheu o caminho errado corrige com um toque.
- **H4 – Consistência e padrões:** na consistência *interna*, é o mesmo botão (`BotaoIcone` + `IconeVoltar`) e a mesma posição da seta de voltar da tela do Grupo. Na *externa*, a seta no canto superior esquerdo é a convenção de "voltar" em apps e sites. A solução foi feita no `TelaAuth`, então vale igual para todas as telas de autenticação.
- **H2 – Correspondência com o mundo real / Familiaridade (Dix):** a seta para a esquerda é um símbolo de "voltar" que o usuário já conhece.
- **H6 – Reconhecer em vez de lembrar:** a saída está à vista; o usuário não precisa lembrar que a logo leva ao início.
- **Acessibilidade:** o botão tem `aria-label` e `title` ("Voltar para o início" / "Voltar para o login") e é o primeiro item alcançado pelo Tab. Ele mantém o foco visível (`focus-visible:outline-destaque`) e o alvo de toque de 40×40 px.

### Trade-offs / heurísticas em tensão
- **Botão secundário no rodapé (ideia inicial) não foi adotado agora.** Ele melhoraria a visibilidade (H3/H4), mas continuaria no fim da tela, depois do formulário, e dois botões de largura total colados podem confundir na hora de enviar (H5). A seta no topo resolve antes de a pessoa preencher qualquer coisa.
- **Erro com solução ("Entrar com este e-mail") não foi feito agora.** Atenderia a H9 quando o e-mail já tem conta, e fica como possibilidade futura.
- **Ícone sem texto:** a seta sozinha é mais discreta que um botão escrito "Voltar". Foi mantida assim pela convenção forte (H4 externa) e pela consistência com a tela do Grupo (H4 interna). O texto fica no `aria-label`/`title`.
- **Redundância:** no Login e no Cadastro, a seta e a logo levam ao mesmo lugar. É aceitável, porque são duas formas de fazer a mesma coisa (Facilidade de substituir, Dix) e a seta é a que deixa a ação explícita.

### Regra da surpresa
A mudança é só de navegação nas telas de autenticação, antes do login. Nenhum dado de presentes ou de escolhas é exibido.

### Como testar
1. Rodar `npm run dev` e abrir no DevTools com a largura de celular.
2. Boas-vindas → "Criar conta": a seta aparece no topo, à esquerda da logo, e volta para as boas-vindas.
3. Boas-vindas → "Já tenho conta": mesma coisa no Login.
4. Login → "Esqueceu a senha?": a seta volta para o **login**.
5. Com o teclado, o primeiro Tab chega na seta (contorno azul). Passando o mouse, aparece a dica com o destino.
6. Conferir que a seta fica alinhada com o título e os campos abaixo.

---

## Mudança 1: Contorno visível no botão secundário ("Já tenho conta")

**Data:** 2026-11-03
**Telas/arquivos alterados:** `src/index.css`, `src/components/Botao.jsx` (efeito em `BoasVindas`, `Home`, `Grupo`, `MinhaLista`, `ListaDoIntegrante` e `ModalEditarGrupo`, que usam o botão secundário)

### Problema (antes)
Na tela de boas-vindas, o botão "Já tenho conta" (variante `secundario` do `Botao`) era branco sobre a página branca, com borda `#d9d9d6`, que tem contraste de apenas **1,4:1** com o fundo. O texto era bem legível (16,4:1), mas o formato do botão quase não aparecia: ele parecia um texto solto abaixo de "Criar conta", e não algo clicável. Isso dificultava a percepção do elemento (acessibilidade) e enfraquecia a convenção visual de botão (H2/Familiaridade).

### O que foi alterado (depois)
- Criado o token `--color-contorno: #8a8a87` em `src/index.css`, com contraste de **3,5:1** sobre o branco.
- A variante `secundario` do `Botao` passou de `border-controle` para `border-contorno`.
- O token `--color-controle` continua igual e agora é usado só na borda dos campos de formulário.
- A cor do texto, o fundo, o hover e o foco do botão não mudaram.

### Heurísticas e princípios considerados
- **Acessibilidade (WCAG – Perceptível):** o contorno passou de 1,4:1 para 3,5:1. *Complemento ao guia:* a WCAG 2.1, critério 1.4.11 (contraste de elementos que não são texto), pede no mínimo 3:1 para a parte visual que identifica um controle.
- **H4 – Consistência e padrões / Consistência (Dix):** a correção foi feita no componente `Botao`, e não só na tela de boas-vindas. Assim, todos os botões secundários do app mantêm a mesma aparência.
- **H8 – Design estético e minimalista:** a hierarquia visual foi preservada. "Criar conta" continua sendo o único botão preenchido (ação principal) e "Já tenho conta" continua vazado (ação secundária), agora visível sem competir com o principal.
- **H2 – Correspondência com o mundo real / Familiaridade (Dix):** um botão com contorno visível segue a convenção que o usuário já conhece de outros apps, então ele reconhece o elemento como clicável.

### Trade-offs / heurísticas em tensão
- **Trocar a cor do botão foi descartado.** Usar o azul `destaque` faria o botão secundário competir com o principal (fere a H8) e misturaria o significado do azul, que no projeto marca links e foco (fere a H4). Preencher o botão de cinza-claro (`painel`) não resolveria, porque fica a 1,05:1 do branco.
- **Intensidade:** `#636361` (6:1) também seria possível, mas deixaria o contorno pesado, perto do peso do botão principal. O `#8a8a87` atende os 3:1 sem perder a diferença de hierarquia.
- **Efeito em outras telas:** a borda mais escura aparece em todos os botões secundários. Isso foi intencional, porque o problema de contraste era o mesmo em todos (H4).
- **Pendente:** o botão `perigo` tem o mesmo problema (borda `negativo/40`, bem clara). Fica para uma próxima mudança.

### Regra da surpresa
A mudança é só visual (cor da borda) e não altera nenhum dado mostrado. Nada revela ao dono quem escolheu seus presentes.

### Como testar
1. Rodar `npm run dev` e abrir no DevTools com a largura de celular.
2. Deslogado, abrir a tela de boas-vindas: "Já tenho conta" deve aparecer claramente como um botão com contorno, mais leve que "Criar conta".
3. Conferir o hover (fundo cinza-claro) e o foco pelo teclado (contorno azul).
4. Conferir outros botões secundários (Home, Grupo, Minha lista, editar grupo) para ver se a borda continua harmoniosa.
