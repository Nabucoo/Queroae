# QueroAê: registro de mudanças de interface (IHC)

Registro das reformulações das telas do QueroAê, com a justificativa de cada uma pelas heurísticas de Nielsen (H1–H10), pelos princípios de Dix et al. e por critérios de acessibilidade. A referência teórica está em `docs/heuristicas-ihc.md`.

Entradas da mais recente para a mais antiga.

<!-- Novas entradas entram logo abaixo desta linha. -->

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
