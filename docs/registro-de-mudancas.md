# QueroAê: registro de mudanças de interface (IHC)

Registro das reformulações das telas do QueroAê, com a justificativa de cada uma pelas heurísticas de Nielsen (H1–H10), pelos princípios de Dix et al. e por critérios de acessibilidade. A referência teórica está em `docs/heuristicas-ihc.md`.

Entradas da mais recente para a mais antiga.

<!-- Novas entradas entram logo abaixo desta linha. -->

## Mudança 31: Opção selecionada com a cor principal

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/components/SeletorAparencia.jsx`, `src/components/SeletorTamanhoTexto.jsx`

### Problema (antes)
Em Aparência e Tamanho do texto, a opção escolhida se diferenciava só por um contorno e um sinal pequeno, o que era fácil de não perceber, principalmente entre os cartões do tamanho do texto (**H1**).

### O que foi alterado (depois)
- A opção selecionada passou a ser preenchida com a cor do botão principal: preta no tema claro e clara no escuro, com o texto invertido. O sinal de confirmação continua.

A proposta foi apresentada em mockup comparando as duas versões, e o Lucas aprovou. A ideia foi dele.

### Heurísticas e princípios considerados
- **H1 – Visibilidade do status:** a escolha atual fica evidente de imediato.
- **H6 – Reconhecer em vez de lembrar:** a pessoa vê qual opção está ligada, sem precisar comparar as bordas.
- **Facilidade de observar (Dix):** o estado atual fica claro na própria interface.
- **Acessibilidade:** o contraste do texto é de 16,4:1 nos dois temas, e a seleção também é indicada pelo sinal, e não só pela cor.

### Trade-offs / heurísticas em tensão
- **H8 × destaque:** a cor principal, antes usada só para a ação principal, agora também indica o que está selecionado. Foi aceito porque as opções têm formato diferente dos botões, e o Perfil não tem outro botão principal competindo com elas.

### Regra da surpresa
A mudança é só visual e não mostra nenhuma informação nova.

### Como testar
1. Abrir o Perfil: a aparência e o tamanho escolhidos aparecem preenchidos, com o sinal.
2. Tocar em outra opção: o preenchimento muda na hora.
3. Conferir nos temas claro e escuro. Ao trocar de tema, a cor da opção acompanha.
4. Num computador, usar Tab e as setas: o foco fica visível também na opção preenchida.

## Mudança 30: Perfil organizado em cards, com o nome editado pelo lápis

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/pages/Perfil.jsx`, `src/components/Icones.jsx`, `src/pages/Ajuda.jsx`

### Problema (antes)
O Perfil era uma sequência sem divisão clara: formulário do nome, acessibilidade, botão de sair, texto de apagar a conta e um link da política, cada um com um estilo. O formulário ocupava espaço sendo pouco usado, e o texto longo de apagar a conta ficava sempre à vista (**H8**, **H4**).

### O que foi alterado (depois)
- A tela foi dividida em cards, um para cada tipo de assunto: **Aparência e acessibilidade**, **Ajuda e informações** e **Sair e apagar**.
- O nome passou a ser editado por um **ícone de lápis** ao lado dele, que abre a janela "Editar nome", com "Cancelar" e "Salvar". Ao salvar, aparece o aviso "Nome atualizado".
- **Ajuda e informações** tem os botões "Perguntas frequentes" e "Política de privacidade". O "?" do topo continua.
- **Sair e apagar** reúne "Sair da conta" e "Apagar minha conta".
- A explicação de apagar a conta e a lista de grupos afetados aparecem só na janela de confirmação.
- A resposta sobre aparência nas perguntas frequentes passou a citar o novo nome do card.

A proposta foi apresentada em mockup com duas ideias. O Lucas escolheu misturar os cards com botões da primeira com o lápis da segunda.

### Heurísticas e princípios considerados
- **H8 – Design estético e minimalista:** o que é raro sai da tela e aparece só quando a pessoa pede.
- **H4 – Consistência e padrões:** todos os blocos usam o mesmo `Painel`, e as ações usam os mesmos botões do resto do app.
- **H6 – Reconhecer em vez de lembrar:** cada card tem um título, e a pessoa encontra as opções pelo assunto.
- **H5 – Prevenção de erros:** a consequência de apagar a conta aparece na hora de confirmar, e "Salvar" fica desligado até o nome mudar.
- **H3 – Controle e liberdade:** a janela do nome tem "Cancelar", e o campo volta ao nome salvo ao abrir de novo.
- **H1 – Visibilidade do status:** o nome atualiza na tela, com um aviso de confirmação.
- **Acessibilidade:** o lápis tem o nome "Editar nome" para leitores de tela, e cada botão tem texto e ícone.

### Trade-offs / heurísticas em tensão
- **Caminho duplicado:** "Perguntas frequentes" aparece no botão e no "?" do topo. Foi mantido porque o Perfil é um lugar natural para procurar ajuda.
- **Sair sem confirmação:** "Sair da conta" continua saindo direto, agora perto de "Apagar minha conta". Foi aceito porque um toque errado não apaga nada, e apagar sempre pede confirmação.
- **Menos aviso prévio:** a explicação de apagar a conta só aparece depois do toque. Foi aceito porque a confirmação mostra tudo antes de qualquer ação.

### Regra da surpresa
A mudança é só de organização e não mostra nenhuma informação sobre escolhas de presentes.

### Como testar
1. Abrir o Perfil: aparecem o topo com o lápis e os três cards.
2. Tocar no lápis, mudar o nome e salvar: a janela fecha, o nome muda e aparece "Nome atualizado".
3. Abrir de novo, mudar e tocar em "Cancelar": o nome continua igual. "Salvar" fica desligado sem mudança.
4. Tocar em "Perguntas frequentes" e em "Política de privacidade": as duas voltam para o Perfil.
5. Tocar em "Apagar minha conta" e conferir o texto e, para quem é admin, os grupos afetados. Tocar em "Cancelar".
6. Conferir nos temas claro e escuro, e em "Muito grande".

## Mudança 29: Cadastro mantém o que foi digitado ao abrir a política de privacidade

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/lib/rascunhoCadastro.js` (novo), `src/pages/Cadastro.jsx`

### Problema (antes)
Quem abria a política de privacidade durante o cadastro perdia tudo o que tinha digitado ao voltar. Isso punia justamente quem queria ler sobre os próprios dados antes de criar a conta (**H5**, **H3**).

### O que foi alterado (depois)
- Ao abrir a política pelo cadastro, o formulário guarda nome, e-mail, senha e confirmação. Ao voltar, os campos aparecem como estavam.
- O rascunho vale só para essa volta. Se a pessoa sair e abrir o cadastro depois, ele começa vazio.

### Heurísticas e princípios considerados
- **H5 – Prevenção de erros:** a pessoa não perde o que digitou.
- **H3 – Controle e liberdade:** dá para sair para ler a política e voltar sem custo.
- **Recuperabilidade (Dix):** a pessoa continua de onde parou.
- **Segurança:** a senha fica só na memória da página, e nunca no armazenamento do navegador.

### Trade-offs / heurísticas em tensão
- **Recarregar a página:** como o rascunho fica só na memória, recarregar na política apaga os campos. Foi aceito para não guardar a senha no aparelho.

### Regra da surpresa
A mudança é só no cadastro e não envolve listas nem escolhas.

### Como testar
1. No cadastro, preencher os campos e tocar em "Política de privacidade".
2. Voltar pela seta: todos os campos continuam preenchidos. Repetir com o voltar do navegador.
3. Tocar na seta do cadastro para sair e abrir o cadastro de novo: os campos estão vazios.
4. Conferir que a conta é criada normalmente com os dados restaurados.

## Mudança 28: Mesma contagem de integrantes na Home e no grupo

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/pages/Grupo.jsx`

### Problema (antes)
Um grupo de 3 pessoas aparecia como "3 integrantes" na Home e "Integrantes (2)" na aba do grupo, porque a aba não contava a própria pessoa. O mesmo dado tinha dois valores (**H4**).

### O que foi alterado (depois)
- O número da aba passou a ser o total do grupo, com a própria pessoa incluída, igual ao da Home.
- A lista da aba continua mostrando só as outras pessoas, porque a lista da própria pessoa fica em "Minha lista de presentes".

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** o grupo tem o mesmo número nas duas telas.
- **Consistência (Dix):** a pessoa não precisa entender duas formas de contar.

### Trade-offs / heurísticas em tensão
- **Número × linhas da lista:** a aba diz "Integrantes (3)" e mostra 2 cartões. Foi aceito porque o número descreve o grupo, e a própria pessoa tem a aba ao lado. Mostrar um cartão de "você" poderia ser avaliado depois.

### Regra da surpresa
A contagem é só de pessoas e não envolve presentes nem escolhas.

### Como testar
1. Na Home, ver quantos integrantes o grupo tem.
2. Abrir o grupo: a aba mostra o mesmo número.
3. Em um grupo só com você, a Home e a aba mostram 1, e a lista explica que só você está no grupo.
4. Como admin, aprovar um pedido: o número aumenta em 1.

## Mudança 27: Termos técnicos trocados por palavras do dia a dia

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/lib/erros.js`, `src/components/ModalPresente.jsx`, `src/components/CartaoPresente.jsx`, `src/components/TelaAuth.jsx`, `src/pages/NovaSenha.jsx`, `src/pages/EsqueciSenha.jsx`, `src/pages/Cadastro.jsx`

### Problema (antes)
Algumas mensagens e rótulos usavam palavras de quem desenvolve sistemas, como "registro", "sessão", "servidor" e "login", ou pouco claras, como "referência" (**H2**).

### O que foi alterado (depois)
| Antes | Depois |
|---|---|
| Esse registro já existe. | Isso já foi salvo. Atualize a tela para conferir. |
| Sua sessão expirou. Entre novamente. | Por segurança, entre na sua conta de novo. |
| Sem conexão com o servidor. Confira sua internet e tente de novo. | Sem conexão. Confira sua internet e tente de novo. |
| Entre pela tela de login ou use outro e-mail. | Entre na sua conta ou use outro e-mail. |
| Voltar para o login | Voltar para a tela de entrada |
| Link inválido ou expirado | Este link não funciona mais |
| Link de referência | Link do presente |
| Ver referência em loja.com.br | Ver em loja.com.br |

### Heurísticas e princípios considerados
- **H2 – Correspondência com o mundo real:** os textos usam palavras que a pessoa já conhece.
- **H9 – Reconhecer e recuperar-se de erros:** as mensagens continuam dizendo o que houve e o que fazer, sem termos técnicos.
- **Familiaridade (Dix):** o conhecimento do dia a dia basta para entender a mensagem.

### Trade-offs / heurísticas em tensão
- **"admin" e "integrante" mantidos:** "admin" é a mesma palavra dos grupos do WhatsApp, e "integrante" é português comum, que não muda conforme o gênero. Trocá-las afetaria várias telas, sem ganho claro.
- **"Sem conexão":** a mensagem não distingue a falta de internet de um servidor fora do ar. Ela continua pedindo para conferir a internet e tentar de novo.
- **"Senha fraca" mantida:** o app já recusa senhas com menos de 8 caracteres antes de enviá-las, então esse aviso só aparece por outros motivos, e trocar para "senha curta" ficaria errado.
- **Nomes de empresas:** a política de privacidade continua citando Supabase, Vercel e Google, porque a pessoa precisa saber quem trata os dados dela.

### Regra da surpresa
A mudança é só de texto e não mostra nenhuma informação nova.

### Como testar
1. Adicionar um presente: o campo se chama "Link do presente". Salvar com um link: o cartão mostra "Ver em" e o nome do site.
2. No cadastro, usar um e-mail já cadastrado: aparece "Entre na sua conta ou use outro e-mail."
3. Depois de criar a conta, conferir o link "Voltar para a tela de entrada".
4. Abrir um link antigo de troca de senha: aparece "Este link não funciona mais".
5. Sem internet, tentar salvar um presente: aparece "Sem conexão. Confira sua internet e tente de novo."

## Mudança 26: Aviso ao adicionar, editar e remover um presente

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/components/AvisoFlutuante.jsx` (novo), `src/components/MinhaLista.jsx`, `docs/heuristicas-ihc.md`

### Problema (antes)
Ao adicionar, editar ou remover um presente, a janela fechava e a lista mudava, sem nenhuma mensagem. Numa lista longa, o presente novo podia ficar fora da tela, e uma edição pequena podia passar despercebida. A pessoa ficava sem saber se a ação tinha dado certo (**H1**).

### O que foi alterado (depois)
- Novo aviso cinza na parte de baixo da tela, com um sinal de confirmação. Ele some sozinho depois de 4 segundos.
- As mensagens são: "“Tênis de corrida” foi adicionado à sua lista", "Alterações salvas" e "“Tênis de corrida” foi removido da sua lista".
- Um aviso novo substitui o anterior e recomeça a contagem.
- A confirmação antes de remover continua igual.

A proposta foi apresentada em mockup com três estilos, e o Lucas escolheu o cinza.

### Heurísticas e princípios considerados
- **H1 – Visibilidade do status:** toda ação na lista agora tem uma resposta clara, em tempo razoável.
- **H4 – Consistência e padrões:** o aviso usa a mesma cor dos botões secundários e dos selos, e é um componente reaproveitável.
- **H8 – Design estético e minimalista:** o cinza não compete com o botão principal da tela, e o aviso some sozinho.
- **Facilidade de observar (Dix):** a pessoa confirma o resultado sem precisar procurar o presente na lista.
- **Acessibilidade:** o aviso é anunciado por leitores de tela com `role="status"`. O contraste do texto é de 14:1 no tema claro e de 10,8:1 no escuro. A animação é desligada para quem pediu menos movimento, e a mensagem acompanha o tamanho do texto.

### Trade-offs / heurísticas em tensão
- **Discrição × atenção:** o cinza chama menos atenção que o preto. Foi aceito porque é só uma confirmação. A sombra e o sinal ajudam a separá-lo da tela.
- **Tempo limitado:** quem lê devagar pode não terminar antes de o aviso sumir. Foi aceito porque a lista também mostra o resultado, e o leitor de tela anuncia o texto.
- **Desfazer:** o aviso não tem "Desfazer" ao remover. Remover apaga também a escolha de quem ia comprar, e recuperá-la exigiria atrasar a remoção. Fica como possível melhoria da H3.
- **Troca de aba:** se a pessoa trocar de aba logo depois da ação, o aviso some antes dos 4 segundos.

### Regra da surpresa
O aviso só confirma a ação que a própria pessoa fez na própria lista. Ele não consulta as escolhas e não diz nada sobre quem escolheu um presente.

### Como testar
1. Em "Minha lista de presentes", adicionar um presente: aparece o aviso com o nome dele, que some depois de 4 segundos.
2. Editar um presente e salvar: aparece "Alterações salvas".
3. Tocar em "Cancelar" na edição: nenhum aviso aparece.
4. Remover um presente e confirmar: aparece o aviso com o nome. Ao cancelar a remoção, nada aparece.
5. Fazer duas ações seguidas: o segundo aviso substitui o primeiro.
6. Com uma lista longa, conferir que o aviso aparece mesmo com a tela rolada.
7. Conferir nos temas claro e escuro, e em "Muito grande".

## Mudança 25: "3 presentes · 1 livre" no cartão de cada integrante

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/lib/resumoPresentes.js` (novo), `src/components/CartaoIntegrante.jsx`, `src/pages/Grupo.jsx`, `src/pages/Integrante.jsx`

### Problema (antes)
O cartão de um integrante mostrava só quantos presentes a pessoa tinha. Para descobrir se ainda havia algo para escolher, era preciso abrir a lista de cada um (**H6**).

### O que foi alterado (depois)
- O cartão passou a mostrar o resumo: "3 presentes · 1 livre", "3 presentes · 2 livres", "3 presentes · todos escolhidos" ou "Nenhum presente". Com um único presente, aparece "1 presente · 1 livre" ou "1 presente · já escolhido".
- O resumo muda na hora ao marcar ou desmarcar "Vou comprar" com o cartão aberto.
- A tela do integrante passou a usar o mesmo texto, no lugar de "1 ainda livre" e "todos já escolhidos".

### Heurísticas e princípios considerados
- **H6 – Reconhecer em vez de lembrar:** a informação fica visível, sem abrir cada lista.
- **H1 – Visibilidade do status:** a pessoa vê a situação de cada lista, e o número acompanha o que ela marca.
- **H7 – Flexibilidade e eficiência:** dá para ir direto a quem ainda tem presentes livres.
- **H4 – Consistência e padrões:** o mesmo resumo aparece no cartão e na tela do integrante.

### Trade-offs / heurísticas em tensão
- **Mais dados na busca:** para saber o que está livre, o grupo agora busca os presentes e as escolhas de todos, e não só a contagem. Foi aceito porque cada lista costuma ser pequena.
- **Número desatualizado:** se outra pessoa marcar um presente enquanto a tela está aberta, o resumo só muda quando o grupo for aberto de novo ou o cartão for aberto.

### Regra da surpresa
O resumo aparece só para os outros integrantes. A pessoa não tem cartão na própria aba Integrantes, a tela dela não mostra o resumo, e a "Minha lista" não consulta as escolhas. Mesmo que a linha da própria pessoa venha na busca, o banco não entrega ao dono as escolhas dos presentes dele, pela política "escolha: integrantes veem, menos o dono".

### Como testar
1. Abrir um grupo com outras pessoas: cada cartão mostra o resumo.
2. Abrir um cartão e marcar "Vou comprar": o número de livres diminui na hora. Tocar em "Desmarcar": ele volta.
3. Marcar todos os presentes de alguém: aparece "todos escolhidos".
4. Com outra conta, a do dono da lista, abrir o grupo: não há resumo da própria lista em lugar nenhum.
5. Testar com uma pessoa sem presentes: aparece "Nenhum presente".

## Mudança 24: "Cancelar" no lugar de "Remover" ao editar um presente

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/components/ModalPresente.jsx`, `src/components/MinhaLista.jsx`

### Problema (antes)
Ao editar um presente, a janela não tinha "Cancelar": no lugar dele estava "Remover". Quem queria só desistir da alteração via uma ação destrutiva naquela posição (**H3**, **H4**). "Remover" também aparecia duas vezes, na janela e no cartão do presente (**H8**).

### O que foi alterado (depois)
- A janela de editar presente passou a ter "Cancelar", cinza, igual à janela de adicionar. Ele fecha sem salvar e descarta o que foi alterado.
- "Remover" saiu da janela e continua no cartão do presente, com a confirmação de sempre.

### Heurísticas e princípios considerados
- **H3 – Controle e liberdade:** a pessoa tem uma saída clara para desistir da alteração.
- **H4 – Consistência e padrões:** as janelas de adicionar e de editar têm os mesmos botões, nos mesmos lugares.
- **H5 – Prevenção de erros:** a ação destrutiva sai de perto de "Salvar", o que reduz o risco de um toque errado.
- **H8 – Design estético e minimalista:** some o "Remover" duplicado.

### Trade-offs / heurísticas em tensão
- **Perda de um caminho:** quem está na janela de edição precisa fechá-la para remover o presente. Foi aceito porque o cartão está logo atrás e mostra "Remover" sempre.
- **Cancelar sem aviso:** "Cancelar" descarta a alteração sem perguntar, como pedido. Avisar antes de descartar continua como possível melhoria da H5.

### Regra da surpresa
A mudança é só nos botões da própria lista e não mostra nenhuma informação sobre escolhas.

### Como testar
1. Em "Minha lista de presentes", tocar em "Editar": a janela mostra "Cancelar" e "Salvar".
2. Alterar o nome e tocar em "Cancelar": a janela fecha, e o nome continua o mesmo.
3. Abrir de novo: o campo mostra o nome original.
4. Tocar em "Remover" no cartão: aparece a confirmação, e o presente sai da lista.

## Mudança 23: Carregamento com esqueleto e falta de internet reconhecida

**Data:** 2026-11-05
**Telas/arquivos alterados:** `src/components/Esqueleto.jsx`, `src/components/EstadoDeErro.jsx` e `src/components/AvisoSemInternet.jsx` (novos), `src/lib/erros.js`, `src/lib/useAoVoltarParaApp.js`, `src/components/Icones.jsx`, `src/App.jsx`, `src/components/Rotas.jsx`, `src/components/ModalConvite.jsx`, `src/components/MinhaLista.jsx`, `src/components/ListaDoIntegrante.jsx`, `src/components/PedidosEntrada.jsx`, `src/pages/Home.jsx`, `src/pages/Grupo.jsx`, `src/pages/Integrante.jsx`, `src/pages/Perfil.jsx`, `src/pages/Convite.jsx`, `src/pages/NovaSenha.jsx`, `docs/heuristicas-ihc.md`

### Problema (antes)
A Home usava esqueleto, mas as outras telas mostravam só "Carregando…", e a tela dava um salto quando os dados chegavam (**H1**, **H4**).

A falta de internet quase nunca era reconhecida. O Supabase devolve `TypeError: Failed to fetch`, e o iPhone costuma usar `Load failed`, mas o app comparava com o texto exato `Failed to fetch`. Com isso, a Home sem conexão dizia "Você ainda não participa de nenhum grupo", e o grupo dizia "Grupo não encontrado". A pessoa podia achar que tinha perdido os dados (**H9**).

### O que foi alterado (depois)
- **Carregamento:** grupo, listas de presentes e tela do integrante usam barras no formato do conteúdo. A pulsação para para quem pediu menos movimento no aparelho.
- **Abertura do app e de links:** aparece só a logo, porque ainda não se sabe qual tela vem depois.
- **Falha de conexão reconhecida:** nas mensagens do Chrome, do Safari e do Firefox, no banco, no login e na função de apagar a conta.
- **Nova tela de erro:** Home, grupo, integrante e listas dizem o que houve e têm "Tentar de novo". Quando a internet volta, a tela tenta sozinha.
- **"Não encontrado" só quando é verdade:** a mensagem aparece apenas se o grupo ou a pessoa realmente não estiver lá.
- **Faixa "Você está sem internet":** fica no topo enquanto o aparelho estiver sem conexão.
- **Dados na tela são mantidos:** se uma atualização falhar quando já há dados, a lista continua visível, com um aviso. O que foi digitado nos formulários também continua nos campos.

A proposta foi apresentada em mockup com antes e depois, e o Lucas aprovou.

### Heurísticas e princípios considerados
- **H1 – Visibilidade do status:** a pessoa vê que a tela está carregando e sabe quando está sem internet.
- **H4 – Consistência e padrões:** o carregamento e os erros têm o mesmo formato em todas as telas, com componentes reaproveitados.
- **H9 – Reconhecer e recuperar-se de erros:** a mensagem diz o que aconteceu e o que fazer, em linguagem simples, com um botão para resolver.
- **H3 – Controle e liberdade:** "Tentar de novo" evita recarregar a página ou sair da tela.
- **Facilidade de observar (Dix):** a interface mostra o estado real, em vez de parecer uma lista vazia.
- **Recuperabilidade (Dix):** a pessoa continua de onde parou quando a conexão volta.
- **Acessibilidade:** o carregamento é anunciado com `role="status"`, e os erros com `role="alert"`. A situação é escrita e tem ícone, e não depende só da cor.

### Trade-offs / heurísticas em tensão
- **Faixa × H8:** a faixa é um aviso a mais, mas avisa antes de a pessoa tentar uma ação. Ela depende do que o aparelho informa, então os erros de cada tela continuam tratando a falha por conta própria.
- **Causa da falha:** o app não distingue a falta de internet de um servidor fora do ar. Por isso, a mensagem pede para conferir a internet e tentar de novo, sem afirmar que o problema é só esse.
- **Telas com formato diferente:** ao carregar, a lista de presentes mostra dois cartões, ainda que a pessoa tenha mais ou menos. A tela pode mudar um pouco de altura quando os dados chegam.

### Regra da surpresa
A mudança não altera nenhuma consulta nem mostra informação nova. "Minha lista" continua sem consultar quem escolheu cada presente.

### Como testar
1. Com a internet lenta (nas ferramentas do navegador), abrir a Home, um grupo e uma lista: aparecem as barras cinza.
2. Sem internet, abrir a Home: aparecem a faixa e "Sem conexão", e não "nenhum grupo". Repetir num grupo.
3. Tocar em "Tentar de novo" sem internet: o erro volta. Ligar a internet: a tela carrega sozinha.
4. Sem internet, tentar salvar um presente: a mensagem pede para conferir a conexão, e o texto digitado continua nos campos.
5. No iPhone, ligar o modo avião e repetir os passos 2 a 4.
6. Abrir um grupo que não existe (`/grupo/999999`): continua "Grupo não encontrado".
7. Ligar "Reduzir movimento" no aparelho: as barras não pulsam.

## Mudança 22: Medidas em rem no lugar de px

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/index.css`, `src/components/Botao.jsx`, `src/components/Modal.jsx`, `src/pages/Home.jsx`, `src/pages/Convite.jsx`, `docs/heuristicas-ihc.md`

### Problema (antes)
Algumas medidas da interface estavam em `px`: os cantos arredondados, a altura mínima dos botões e dos cartões da Home, a linha dos passos do convite e a sombra das janelas. Quando a pessoa aumentava o texto padrão do navegador, o texto e os espaços cresciam, mas essas medidas não, e as proporções mudavam.

### O que foi alterado (depois)
- Essas medidas passaram para `rem`, com os mesmos valores no tamanho padrão do navegador (16 px). O visual não muda para quem não alterou esse ajuste.
- O guia do projeto passou a pedir `rem` nas medidas da interface.
- `px` continua na animação de confetes, que é calculada a partir de posições na tela e é só decorativa. As bordas finas do Tailwind também seguem em `px`, porque não devem engrossar junto com o texto.

### Heurísticas e princípios considerados
- **Acessibilidade:** a interface mantém as proporções quando a pessoa aumenta o texto nas configurações do navegador.
- **H4 – Consistência e padrões:** o app usa uma única unidade para medidas da interface.

### Trade-offs / heurísticas em tensão
Nenhum. Os valores são equivalentes no tamanho padrão.

### Regra da surpresa
A mudança é só de medidas e não mostra nenhuma informação nova.

### Como testar
1. Abrir o app no tamanho normal: nada muda em relação à versão anterior.
2. Num computador, aumentar o tamanho da fonte nas configurações do navegador: botões, cartões e cantos crescem junto com o texto.

## Mudança 21: Conteúdo sempre no centro, sem pular entre telas

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/index.css`

### Problema (antes)
Ao ir da Home para o Perfil, o conteúdo mudava de lugar. O Perfil é mais longo e mostra a barra de rolagem, que ocupa espaço (15 px na medição), e isso deslocava todo o conteúdo em 7,5 px. A logo e os botões do topo não ficavam no mesmo ponto entre as telas (**H4**).

### O que foi alterado (depois)
- A página reserva o espaço da barra de rolagem dos dois lados, com `scrollbar-gutter: stable both-edges`. O conteúdo fica no centro da janela, tenha a tela barra de rolagem ou não.

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** cada elemento fica na mesma posição entre as telas.
- **H8 – Design estético e minimalista:** a tela não dá um salto sem motivo ao trocar de página.
- **Previsibilidade (Dix):** a pessoa encontra os botões do topo sempre no mesmo lugar.

### Trade-offs / heurísticas em tensão
- **Largura útil:** no computador, a área de conteúdo perde o espaço reservado de cada lado. Isso não afeta o layout, porque o conteúdo já tem largura máxima. Em celulares com barra flutuante, como o iPhone, nada muda.

### Regra da surpresa
A mudança é só de posicionamento e não mostra nenhuma informação nova.

### Como testar
1. Num computador, com a janela baixa o suficiente para o Perfil ter rolagem, ir da Home para o Perfil: o conteúdo não se move.
2. Conferir que a logo fica no centro da janela nas duas telas.
3. No iPhone, conferir que a Home e o Perfil continuam com a mesma largura de antes.

## Mudança 20: Perguntas frequentes e botão de ajuda

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/pages/Ajuda.jsx` (novo), `src/lib/contato.js` (novo), `src/App.jsx`, `src/components/Icones.jsx`, `src/components/Cabecalho.jsx`, `src/pages/Home.jsx`, `src/pages/Perfil.jsx`, `src/pages/Privacidade.jsx`

### Problema (antes)
O app não tinha um lugar para tirar dúvidas. Regras pouco óbvias, como a surpresa e a aprovação do admin, só apareciam em pontos soltos, e quem voltava depois de meses não tinha onde relembrar como o app funciona (**H10**).

### O que foi alterado (depois)
- Nova página **Perguntas frequentes**, em `/ajuda`, com 14 perguntas agrupadas em Grupos, Presentes, Surpresa e Conta. As respostas abrem e fecham, e duas já aparecem abertas: como entrar em um grupo e a regra da surpresa.
- Botão **"?"** na Home, à esquerda, e no Perfil, à direita. A seta da página volta para a tela de origem, inclusive para a aba "Vou comprar" da Home.
- Bloco **"Não achou sua resposta?"**, com o contato `queroae.app@gmail.com`.
- O e-mail agora fica em um só lugar (`src/lib/contato.js`), usado também pela política de privacidade.
- A página abre sem login, como a política de privacidade, mas as telas de entrada não têm botão para ela.

A proposta foi apresentada em mockup, nos temas claro e escuro, e o Lucas aprovou. O formato de perguntas frequentes foi ideia dele.

### Heurísticas e princípios considerados
- **H10 – Ajuda e documentação:** a ajuda é curta, focada em tarefas, com passos concretos e fácil de encontrar. Também termina com um caminho para falar com alguém.
- **H2 – Correspondência com o mundo real:** as perguntas usam as palavras de quem tem a dúvida, e as respostas citam os nomes reais dos botões.
- **H6 – Reconhecer em vez de lembrar:** a pessoa reconhece a própria dúvida na lista, sem precisar lembrar onde fica cada função.
- **H8 – Design estético e minimalista:** as respostas ficam fechadas até serem pedidas, e o botão aparece só em duas telas.
- **H3 – Controle e liberdade:** a seta volta para o lugar de origem, sem perder a aba aberta.
- **Facilidade de memorizar (Nielsen):** ajuda quem volta só no próximo Natal.
- **Acessibilidade:** o abre e fecha usa o elemento próprio do navegador (`<details>`), que funciona com teclado e leitor de tela. O botão "?" tem o nome "Ajuda" para leitores de tela, e o texto acompanha o tamanho e o tema escolhidos.

### Trade-offs / heurísticas em tensão
- **H4 × espaço no cabeçalho:** o "?" fica à esquerda na Home e à direita no Perfil. Foi aceito porque, na Home, os dois ícones juntos à direita podem não caber com o texto Muito grande em celulares estreitos, e, no Perfil, a esquerda já tem a seta de voltar.
- **Ajuda fora da tarefa:** a pessoa sai do que está fazendo para consultar a página. As explicações junto das regras foram propostas, mas ficaram de fora nesta etapa.
- **Sem busca:** a H10 cita ajuda pesquisável, mas 14 perguntas com títulos claros se percorrem rapidamente. Vale rever se a lista crescer.
- **Manutenção:** se uma regra do app mudar, a resposta precisa mudar junto. Um comentário no código avisa disso.

### Regra da surpresa
A página não mostra dados de ninguém. Ela reforça a regra: o dono da lista nunca vê se um presente foi escolhido nem por quem, e os outros integrantes veem as escolhas para não repetir presentes.

### Como testar
1. Na Home, tocar no "?": abre "Perguntas frequentes". A seta volta para a Home.
2. Na aba "Vou comprar", tocar no "?" e voltar: a mesma aba continua aberta.
3. No Perfil, tocar no "?": a seta volta para o Perfil.
4. Abrir e fechar as respostas, também com Tab e Enter num computador.
5. Tocar no e-mail: abre o aplicativo de e-mail com `queroae.app@gmail.com`.
6. Conferir a página no tema escuro e em "Muito grande".
7. Seguir as respostas com uma conta real e confirmar se cada passo está certo.

## Mudança 19: Modo escuro "Grafite" e opção de Aparência

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/index.css`, `src/lib/tema.js` (novo), `src/components/SeletorAparencia.jsx` (novo), `src/components/Logo.jsx`, `src/components/Modal.jsx`, `src/components/ModalConvite.jsx`, `src/pages/BoasVindas.jsx`, `src/pages/Perfil.jsx`, `src/pages/Privacidade.jsx`, `src/main.jsx`, `index.html`, `docs/heuristicas-ihc.md`

### Problema (antes)
O app só tinha o tema claro. Ele incomodava em ambientes escuros e ignorava o ajuste de aparência do próprio iPhone, que outros apps seguem (**H4**, lado externo).

### O que foi alterado (depois)
- Novo tema escuro, com a paleta "Grafite", escolhida pelo Lucas entre três opções apresentadas em mockup.
- Nova opção **Aparência** em Perfil > Acessibilidade: Claro, Escuro e Automático. O padrão é o Automático, que acompanha o ajuste do aparelho.
- A escolha vale na hora, fica salva no aparelho e já vale antes do login.
- O tema é definido antes da primeira pintura, para a tela não piscar em branco ao abrir.
- O botão principal inverte no escuro: fica claro, com texto escuro.
- As janelas ganharam cor própria (`janela`), mais clara que o fundo no escuro, e um véu próprio para cada tema.
- A logo da capa passou a acompanhar as cores do tema, e a barra do navegador também muda de cor.
- A política de privacidade passou a citar que essa escolha fica no navegador.

**Paleta Grafite:**

| Uso | Token | Cor |
|---|---|---|
| Fundo | `fundo` | `#141413` |
| Painel | `painel` | `#1c1c1b` |
| Cartão e janela | `elevado`, `janela` | `#262625` |
| Botão secundário e selo | `ativo` | `#363634` |
| Texto e botão principal | `texto`, `primario` | `#f2f2ef` |
| Texto suave | `suave` | `#adada8` |
| Azul de destaque | `destaque` | `#93b3ff` |
| Vermelho | `negativo` | `#ff9385` |
| Fundo do botão de perigo | `negativo-claro` | `#401e1a` |

### Heurísticas e princípios considerados
- **Acessibilidade:** atende à recomendação da aula de permitir a escolha de temas e cores. O menor contraste de texto medido é 5,4:1, acima do mínimo de 4,5:1, e a borda do cartão de pedido passa dos 3:1. A opção escolhida também tem o sinal de confirmação, e não só a borda.
- **Facilidade de personalizar (Dix):** a pessoa pode escolher (adaptabilidade), e o Automático ajusta o app sozinho ao aparelho (adaptatividade).
- **H4 – Consistência e padrões:** o Automático segue a convenção do sistema, e a hierarquia de botões é a mesma nos dois temas.
- **H1 – Visibilidade do status:** o resultado aparece na hora.
- **H3 – Controle e liberdade:** dá para trocar a qualquer momento, mesmo com o Automático como padrão.
- **H10 – Ajuda e documentação:** uma frase curta explica o que o Automático faz.

### Trade-offs / heurísticas em tensão
- **Automático como padrão × surpresa:** quem usa o iPhone no modo escuro verá o app escuro sem ter pedido. Foi aceito porque é o comportamento esperado e pode ser trocado no Perfil.
- **Salvar no aparelho × na conta:** a escolha não acompanha a pessoa em outro aparelho. Foi aceito porque assim ela vale antes do login e não exige mudança no banco.
- **Confetes:** a animação de "Vou comprar" manteve as cores atuais nos dois temas, porque é só decorativa. O azul se destaca menos no fundo escuro.
- **Lógica em dois lugares:** o script do `index.html` repete a leitura de `src/lib/tema.js`, para evitar o branco ao abrir. Um comentário nos dois arquivos avisa disso.

### Regra da surpresa
A mudança é só de apresentação. Nenhuma consulta de dados mudou, e nenhuma informação nova aparece.

### Como testar
1. No iPhone, abrir Perfil > Acessibilidade e tocar em Escuro e em Claro: o app inteiro muda na hora.
2. Com Automático, trocar o modo escuro no iPhone e voltar para o app: ele acompanha.
3. Fechar e abrir o app no modo escuro: a tela não pisca em branco.
4. Percorrer Home, grupo, lista, Perfil e janelas no escuro, conferindo textos, botões e avatares.
5. Abrir uma janela, como "Excluir grupo": ela se destaca do fundo, com o véu escuro atrás.

## Mudança 18: Tamanho do texto em Acessibilidade e padrão único de fontes

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/index.css`, `src/lib/tamanhoTexto.js` (novo), `src/components/SeletorTamanhoTexto.jsx` (novo), `src/main.jsx`, `src/pages/Perfil.jsx`, `src/pages/Privacidade.jsx`, `docs/heuristicas-ihc.md`, e todas as telas e componentes com texto, que passaram a usar o padrão.

### Problema (antes)
O texto do app não podia ser ajustado, o que prejudicava quem tem dificuldade de leitura. Os tamanhos também vinham de várias classes soltas do Tailwind, sem uma regra de uso (**H4**). O corpo tinha 14 px, abaixo dos 17 pt recomendados pela Apple para o iPhone, e os campos, com menos de 16 px, faziam o iPhone dar zoom na tela ao tocar.

### O que foi alterado (depois)
- Nova seção **Acessibilidade** no Perfil, com **Tamanho do texto**: Pequeno, Médio, Grande e Muito grande. A mudança vale na hora, e cada opção mostra uma amostra "Aa".
- A escolha fica salva no aparelho e já vale nas telas de login, de cadastro e de boas-vindas. O padrão é o Médio.
- Novo padrão em `src/index.css`, com os tamanhos abaixo em pt (1 pt do iPhone equivale a 1 px do CSS):

| Token | Uso | Estilo da Apple | Pequeno (Small) | Médio (Large) | Grande (xLarge) | Muito grande (xxxLarge) |
|---|---|---|---|---|---|---|
| `text-selo` | selos | Caption 1 | 11 | 12 | 14 | 18 |
| `text-nota` | detalhes e erros de campo | Footnote | 12 | 13 | 15 | 19 |
| `text-apoio` | explicações, rótulos e abas | Subhead | 13 | 15 | 17 | 21 |
| `text-corpo` | texto e botões | Body | 15 | 17 | 19 | 23 |
| `text-subtitulo` | títulos de janela | Title 3 | 18 | 20 | 22 | 26 |
| `text-titulo` | título da tela | Title 1 | 26 | 28 | 30 | 34 |
| `text-titulo-grande` | saudação e capa | Large Title | 32 | 34 | 36 | 40 |

- `text-campo` acompanha `text-corpo`, mas nunca fica abaixo de 16 px, para o iPhone não dar zoom ao tocar no campo.
- Os tamanhos prontos do Tailwind foram desligados, então um tamanho fora do padrão não funciona.
- Botões e campos passaram a crescer com o texto. Linhas de botões e abas descem para outra linha quando falta espaço, em vez de cortar o texto.
- A política de privacidade passou a citar que essa escolha fica no navegador.

**Fonte dos valores:** tabelas de Dynamic Type das [Human Interface Guidelines da Apple](https://developer.apple.com/design/human-interface-guidelines/typography), onde o padrão do iOS é o nível "Large", com corpo de 17 pt, e o mínimo é 11 pt. O "Médio" do QueroAê corresponde ao "Large" da Apple, que é o padrão dela.

### Heurísticas e princípios considerados
- **Acessibilidade:** atende à recomendação da aula de permitir a escolha do tamanho do texto. A opção usa botões de rádio, que funcionam com teclado e leitor de tela, e a escolhida se diferencia também pelo sinal de confirmação, e não só pela borda.
- **Facilidade de personalizar (Dix):** é a pessoa quem adapta o app à sua necessidade.
- **H1 – Visibilidade do status:** o resultado aparece na hora, na própria tela.
- **H3 – Controle e liberdade:** dá para voltar a qualquer outro tamanho a qualquer momento.
- **H4 – Consistência e padrões:** cada tipo de texto tem um único tamanho no app inteiro, e os valores seguem a convenção do iPhone.
- **H10 – Ajuda e documentação:** uma frase curta explica que a mudança é imediata e fica salva no aparelho.

### Trade-offs / heurísticas em tensão
- **Legibilidade × densidade:** como o corpo passou de 14 px para 17 px, o Médio mostra menos conteúdo por tela do que antes. Foi aceito para seguir o padrão do iPhone.
- **Salvar no aparelho × na conta:** a escolha não acompanha a pessoa em outro aparelho. Foi aceito porque assim ela já vale antes do login e não exige mudança no banco.
- **Pequeno × legibilidade:** o menor nível chega a 11 pt nos selos, o mínimo indicado pela Apple. Ele só vale para quem escolher.
- **Texto muito grande × celular estreito:** no Muito grande, algumas linhas quebram e nomes longos podem ser cortados com reticências. O texto não sai da tela.
- **Tamanho dos botões:** a altura mínima dos botões continua em 38 px. Os 44 pt recomendados pela Apple para toque ficam como melhoria futura, assim como os botões de ícone.

### Regra da surpresa
A mudança é só de apresentação. Nenhuma consulta de dados mudou, e nenhuma informação nova aparece.

### Como testar
1. No iPhone, abrir Perfil > Acessibilidade e tocar em cada tamanho: o texto da tela muda na hora.
2. Fechar e abrir o app: a escolha continua. Sair da conta: a tela de login segue no mesmo tamanho.
3. Em "Muito grande", percorrer Home, grupo, lista e janelas: nada sai da tela, e os botões continuam fáceis de ler.
4. Em "Pequeno", tocar num campo: o iPhone não dá zoom.
5. Num computador, usar Tab e as setas nas opções: o foco fica visível e a opção muda.

## Mudança 17: Botões sem borda e sem fundo transparente

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/components/Botao.jsx` e as telas e janelas que usavam a variante `texto`: `src/pages/Home.jsx`, `src/components/ModalPresente.jsx`, `src/components/ModalIntegrantes.jsx`, `src/components/ModalEntrarGrupo.jsx`, `src/components/ModalEditarGrupo.jsx`, `src/components/ModalConfirmar.jsx`, `src/components/ModalCriarGrupo.jsx`, `src/components/ModalConvite.jsx`. Também o guia `docs/heuristicas-ihc.md`.

### Problema (antes)
Havia quatro estilos de botão, e três pareciam vazados sobre o fundo branco: `secundario` e `perigo` eram brancos com borda, e `texto` não tinha fundo nem borda. "Cancelar" e "Editar" tinham papéis parecidos e aparências diferentes (**H4**), e as bordas somavam linhas às dos cartões (**H8**).

### O que foi alterado (depois)
- `secundario` passou a ter fundo cinza, sem borda.
- `perigo` passou a ter fundo vermelho claro e texto vermelho, sem borda.
- A variante `texto` foi removida. "Cancelar", "Voltar", "Agora não" e "Cancelar pedido" agora usam `secundario`.
- O botão `primario` e os ícones do topo não mudaram.

A proposta foi apresentada em mockups com três versões (sem borda, com borda e fundo branco, com borda e fundo colorido), e o Lucas escolheu "sem borda".

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** ações do mesmo nível têm a mesma aparência, e o app fica com três estilos em vez de quatro.
- **H8 – Design estético e minimalista:** sem as bordas, há menos linhas na tela, e o botão preto se destaca como ação principal.
- **Consistência (Dix):** a hierarquia é a mesma em todas as telas: preto, cinza e vermelho claro.
- **Acessibilidade:** o texto tem contraste de 14:1 no cinza e 5,8:1 no vermelho claro. A ação de risco não depende só da cor, porque o texto já diz o que o botão faz.

### Trade-offs / heurísticas em tensão
- **Contorno × H8:** o fundo do botão se destaca pouco do branco (1,17:1 no cinza). Foi aceito porque o texto escuro identifica o botão, e o foco de teclado continua com contorno azul.
- **"Cancelar" mais visível × hierarquia:** ele ganha mais peso do que tinha sem fundo, mas continua abaixo do botão preto.
- **H5 na confirmação:** "Excluir grupo" e os outros botões da janela de confirmação perdem a borda e ficam em vermelho claro, com aparência igual à de "Remover" nas listas. A janela continua pedindo a segunda confirmação e explicando a consequência. Um vermelho forte nessa janela foi proposto e pode ser avaliado depois.

### Regra da surpresa
A mudança é só visual e não mostra nenhuma informação nova.

### Como testar
1. Na largura de celular, abrir "Minha lista de presentes": "Editar" fica cinza e "Remover" fica vermelho claro, ambos sem borda.
2. Abrir "Novo presente": "Cancelar" fica cinza, ao lado do botão preto.
3. Abrir a confirmação de excluir um grupo: "Cancelar" fica cinza e "Excluir grupo" fica vermelho claro.
4. Na tela de boas-vindas, conferir "Já tenho conta" em cinza.
5. Usar a tecla Tab num computador: o botão focado mostra o contorno azul.

## Mudança 16: Mesmo painel nas listas do grupo e do integrante

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/pages/Grupo.jsx`, `src/pages/Integrante.jsx`

### Problema (antes)
Na Home, as abas e os cartões ficam dentro de um painel cinza. No grupo, a mesma estrutura ficava direto no fundo branco, e a lista do integrante também não tinha painel. A mesma organização aparecia de dois jeitos (**H4**).

### O que foi alterado (depois)
- No grupo, as abas e o conteúdo delas passaram para o componente `Painel`, o mesmo da Home.
- Na aba "Minha lista de presentes", a distância entre as abas e o conteúdo ficou igual à da aba "Integrantes".
- Na tela do integrante, a lista passou para o `Painel`. O título "Lista de presentes" foi para dentro dele e ficou do tamanho dos outros títulos de painel.

A proposta foi apresentada em um mockup com antes e depois, e o Lucas aprovou.

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** telas com a mesma estrutura agora têm a mesma aparência, usando o mesmo componente.
- **H8 – Design estético e minimalista:** o painel agrupa as abas e o conteúdo delas, e os cartões brancos se destacam do fundo cinza.
- **Consistência e facilidade de generalizar (Dix):** quem aprendeu a Home reconhece a organização das outras telas, o que ajuda num app de uso sazonal.
- **Acessibilidade:** o painel `#f9f9f9` fica atrás dos cartões brancos e das abas. O texto secundário direto sobre ele, como o da aba inativa e o da mensagem de lista vazia, usa `#636361`, com contraste de 5,7:1.

### Trade-offs / heurísticas em tensão
- **Consistência × largura no celular:** o painel tira 20 px de cada lado. O cartão de integrante aberto fica mais apertado, mas no mockup ele continuou legível em 360 px, sem botões saindo do lugar.
- **Consistência × H8:** para o admin com pedido pendente, a tela do grupo fica com três blocos cinza seguidos. Foi aceito porque cada bloco tem uma função clara, há espaço entre eles e o bloco de pedidos some quando não há pedidos.

### Regra da surpresa
A mudança é só visual. As consultas não mudaram, e "Minha lista" continua sem consultar quem escolheu cada presente.

### Como testar
1. Na largura de celular, abrir um grupo: as abas e a lista ficam dentro do painel cinza, como na Home.
2. Abrir o cartão de um integrante e conferir se os presentes e os botões cabem.
3. Trocar para "Minha lista de presentes": o conteúdo não muda de distância em relação às abas.
4. Na Home, abrir um presente pela aba "Vou comprar": a lista do integrante aparece dentro do painel.
5. Entrar como admin de um grupo com pedido pendente e conferir se os três blocos ficam bem separados.

## Mudança 15: Botão "Adicionar" da Home em preto

**Data:** 2026-11-04
**Telas/arquivos alterados:** `src/pages/Home.jsx`

### Problema (antes)
Na lista de grupos da Home, "Adicionar" era branco com borda (`secundario`), embora fosse a única ação principal da tela. Na "Minha lista", a ação equivalente, "Adicionar novo presente", já era preta (**H4**).

### O que foi alterado (depois)
- O botão passou a usar a variante `primario`, a mesma cor quase preta dos outros botões principais do app. O texto, o ícone e a posição não mudaram.

### Heurísticas e princípios considerados
- **H4 – Consistência e padrões:** adicionar grupo e adicionar presente agora têm o mesmo peso visual, e o guia pede uma ação `primario` por tela.
- **H8 – Design estético e minimalista:** a tela ganha uma hierarquia clara, com uma única ação em destaque.
- **Consistência e facilidade de generalizar (Dix):** quem aprendeu que o botão preto é a ação principal reconhece o padrão aqui.
- **Acessibilidade:** o texto branco sobre o fundo `#1f201d` tem contraste de 16,4:1, acima do mínimo de 4,5:1.

### Trade-offs / heurísticas em tensão
- **Destaque × tarefa mais frequente:** quem já tem grupos costuma abrir um grupo, e não criar outro, então o botão preto chama mais atenção que os cartões da lista. Foi aceito porque ele é pequeno, fica na linha do título e não compete com outro botão principal.

### Regra da surpresa
A mudança é só de cor e não mostra nenhuma informação nova.

### Como testar
1. Entrar com uma conta que tenha pelo menos um grupo, na largura de celular.
2. Na aba "Grupos", conferir que "Adicionar" está preto, com texto e ícone brancos.
3. Tocar no botão: abre a janela "Adicionar grupo", como antes.

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
