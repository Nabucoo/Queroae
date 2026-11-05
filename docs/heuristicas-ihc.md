# Guia de heurísticas de IHC para o QueroAê

> **Para quem é:** para o Claude (assistente de código) consultar sempre que for propor, revisar ou implementar mudanças de tela no QueroAê.
> **Objetivo do Lucas:** reformular as telas com base nas heurísticas de usabilidade da disciplina de IHC. Ele traz as ideias; o Claude ajuda a pensar e, principalmente, a implementar.
> **Fonte:** anotações de aula (`~/Documentos/IHC/documentacao-teorica/heurísticas.pdf`), revisadas e corrigidas em `heuristicas-resumo-organizado.pdf` (mesma pasta). Fatos conferidos com: Nielsen/NN/g (10 heurísticas, 1994, texto atualizado em 2020), ISO 9241-11:2018, ISO 9241-210:2019, Dix et al. *Human-Computer Interaction* (3ª ed., 2004, cap. 7), WCAG e a Lei 13.146/2015.

---

## 0. Como usar este guia

1. **Ao receber uma ideia do Lucas:** identifique quais heurísticas ela atende (cite pelo número, ex.: "H5 – Prevenção de erros") e se ela fere alguma outra.
2. **Ao implementar:** siga a seção 5 (convenções do projeto) e confira a checklist da seção 6.
   - **Documentar cada mudança:** todas as mudanças de interface ficam registradas em **um único arquivo**, `docs/registro-de-mudancas.md`, que é atualizado a cada mudança (não criar um arquivo por mudança). Para cada mudança, acrescentar uma **entrada nova no topo** do registro (a mais recente primeiro), seguindo o modelo da seção 8: **o que foi alterado** e **quais heurísticas/princípios foram considerados** e por quê. Depois de atualizar o `.md`, regenerar o Word com `python3 scripts/gerar-docx.py` (gera `docs/registro-de-mudancas.docx`). O `.md` é o original: nunca editar o `.docx` à mão. Registro e `.docx` entram no mesmo commit da mudança.
3. **Ao explicar:** fale em português e justifique cada mudança com a heurística correspondente. Isso é trabalho de faculdade: a justificativa teórica importa tanto quanto o código.
4. **Não inventar teoria:** use só o que está aqui. Se precisar de algo além, diga que é complemento e de onde vem.
5. **Erros que já foram corrigidos nas anotações originais** (não repetir):
   - H9: as mensagens de erro devem ser **sem** códigos de erro (a anotação dizia "em códigos").
   - Robustez (Dix) tem **4** princípios: faltava a **Recuperabilidade**.
   - A definição de usabilidade é da **ISO 9241-11**. A ISO 9241-210 trata de projeto centrado no ser humano.
   - Acessibilidade **não** é um dos 5 componentes de usabilidade de Nielsen (é um requisito separado).
   - H10: o ideal é o sistema **dispensar** documentação; quando houver ajuda, ela deve ser curta, pesquisável e focada na tarefa.
   - A ideia de que "todos os princípios dependem da consistência" é uma ênfase da aula, não algo que o livro do Dix afirme.

---

## 1. Usabilidade: base conceitual

**Definição (ISO 9241-11):** grau em que um sistema pode ser usado por usuários específicos para alcançar objetivos específicos com **eficácia** (conseguir concluir), **eficiência** (pouco esforço/tempo) e **satisfação**, em um **contexto de uso** específico.

**5 componentes de qualidade (Nielsen):**

| Componente | Pergunta para avaliar uma tela do QueroAê |
|---|---|
| Facilidade de aprender | Alguém que nunca usou consegue criar um grupo ou montar a lista na primeira vez? |
| Eficiência | Quem já usa faz as tarefas frequentes (adicionar presente, marcar "Vou comprar") com poucos passos? |
| Facilidade de memorizar | Quem volta só no próximo Natal ainda sabe usar sem reaprender? (Uso **sazonal**, então isso pesa muito aqui.) |
| Erros | Poucos erros, nenhum grave, e recuperação fácil? |
| Satisfação | O uso é agradável? (ex.: confetes ao marcar presente) |

**Padrões × diretrizes × princípios × heurísticas:**
- **Padrões:** normas oficiais (ISO, BSI, ABNT).
- **Diretrizes:** recomendações, abstratas ou específicas de plataforma (WCAG, Material, Apple HIG).
- **Princípios:** regras gerais baseadas em teoria (Dix et al.).
- **Heurísticas:** regras práticas usadas principalmente para **avaliar** interfaces (Nielsen).

---

## 2. As 10 heurísticas de Nielsen (PRINCIPAL)

Para cada uma: **definição**, o que procurar no código/tela e **padrões de implementação** no stack do projeto (React 19 + Tailwind v4 + Supabase).

### H1 – Visibilidade do status do sistema
**Definição:** manter o usuário sempre informado do que está acontecendo, com feedback adequado e em tempo razoável.
**Procurar:** ação sem resposta visual; carregamento sem indicação; o usuário sem saber onde está.
**Implementar:**
- Estado de carregamento em todo `await` que o usuário dispara (botão `disabled` + texto "Salvando…"). O projeto já faz isso em `Botao`/`ModalPresente`/`Login`.
- Esqueletos (`Esqueleto` na Home) em vez de texto solto "Carregando…".
- Confirmação de sucesso visível (ex.: "Copiado!", "Salvo"), anunciada com `aria-live="polite"` ou `role="status"`.
- Indicar a localização: título da tela, aba ativa, breadcrumb.

### H2 – Correspondência entre o sistema e o mundo real
**Definição:** falar a língua do usuário (palavras e conceitos familiares, sem termos técnicos) e seguir convenções do mundo real, em ordem natural e lógica.
**Procurar:** jargão ("registro", "integrante" vs. "pessoa"?, "admin"), ícones que não lembram nada do mundo real, ordem de informação estranha.
**Implementar:** textos em português coloquial; metáforas do mundo dos presentes (lista, embrulho, "Vou comprar"); `lib/erros.js` já traduz erros técnicos.

### H3 – Controle e liberdade do usuário
**Definição:** o usuário erra com frequência e precisa de uma "saída de emergência" clara para sair de estados indesejados sem processo longo. Oferecer **desfazer e refazer**.
**Procurar:** telas sem voltar/cancelar; ações sem desfazer; modais que não fecham.
**Implementar:**
- Todo modal com "Cancelar" e "X" e fechando com Esc (`Modal.jsx` usa `<dialog>`, que já faz isso).
- Para ações de baixo risco, preferir **desfazer** (toast "Presente removido · Desfazer") a pedir confirmação antes. Confirmação é para o que não tem volta (H5).
- Botão voltar coerente com a origem (o projeto já usa `state={{ de: 'home' }}`).

### H4 – Consistência e padrões
**Definição:** palavras, situações ou ações diferentes não devem significar a mesma coisa; seguir as convenções da plataforma. Tem dois lados: **interna** (dentro do app) e **externa** (igual a outros apps).
**Procurar:** o mesmo conceito com nomes diferentes; botões iguais com estilos diferentes; o mesmo lugar da tela fazendo coisas diferentes conforme o papel; estados de carregamento diferentes em cada tela.
**Implementar:** **sempre** reaproveitar `Botao`, `Campo`, `Modal`, `ModalConfirmar`, `Painel`, `Abas`, e os tokens de `src/index.css`. Variantes do `Botao`: `primario` (ação principal, 1 por tela/modal), `secundario`, `perigo` (destrutiva). Ordem dos botões em modal: secundário/cancelar à esquerda, ação principal à direita.

### H5 – Prevenção de erros
**Definição:** melhor que boas mensagens de erro é um projeto que evita o erro: eliminar condições propensas a erro ou pedir confirmação antes de ações com consequências.
**Procurar:** validação só no envio; ações destrutivas sem confirmação; campos que aceitam qualquer coisa; perda de dados digitados ao fechar um modal.
**Implementar:** `required`, `maxLength`, `type`/`inputMode` corretos; validação inline (ex.: senha < 8 avisada ao digitar/sair do campo); `ModalConfirmar` para o que não tem volta (excluir grupo, sair, apagar conta); avisar antes de fechar formulário com alterações não salvas; desabilitar o envio enquanto está inválido **com** explicação do motivo.

### H6 – Reconhecer em vez de lembrar
**Definição:** minimizar a carga de memória deixando objetos, ações e opções visíveis; o usuário não deve ter que lembrar informações de uma parte da interface para outra; instruções visíveis ou fáceis de acessar.
**Procurar:** a pessoa precisa decorar códigos, nomes ou onde estava algo; ações escondidas sem pista.
**Implementar:** mostrar o contexto (para quem é o presente, de qual grupo); dicas nos placeholders/rótulos; listas de recentes; links diretos em vez de códigos digitados.

### H7 – Flexibilidade e eficiência de uso
**Definição:** aceleradores (muitas vezes invisíveis para iniciantes) agilizam o uso para experientes, servindo aos dois públicos; permitir personalizar ações frequentes.
**Procurar:** tarefas repetitivas com muitos passos; nenhum atalho.
**Implementar:** `Enter` envia formulários (usar `<form onSubmit>`, como o projeto já faz); compartilhar convite via Web Share API (`navigator.share`) / link do WhatsApp; link de convite que já entra no grupo; adicionar vários presentes seguidos sem fechar o modal.

### H8 – Design estético e minimalista
**Definição:** não mostrar informação irrelevante ou raramente necessária; cada informação a mais compete com a relevante. Minimalista = sem excessos, não = sem graça.
**Procurar:** textos longos, elementos duplicados, ações secundárias com o mesmo peso da principal.
**Implementar:** hierarquia visual clara (1 botão `primario` por contexto); esconder o raro atrás de "Ver mais" (como a `Descricao` do grupo) ou de menus; textos curtos.

### H9 – Ajudar a reconhecer, diagnosticar e recuperar-se de erros
**Definição:** mensagens de erro em **linguagem simples, sem códigos**, indicando **precisamente o problema** e **sugerindo uma solução** de forma construtiva.
**Procurar:** mensagens genéricas ("Algo deu errado"), vagas ("Confira os dados digitados"), longe do campo com problema, ou sem dizer o que fazer.
**Implementar:** formato **o que aconteceu + o que fazer**. Mostrar o erro **junto do campo** (`Campo` aceita a prop `erro` e marca `aria-invalid`) e com `role="alert"`. Mover o foco para o primeiro campo com erro. Manter `lib/erros.js` como lugar único das traduções e melhorar as genéricas.

### H10 – Ajuda e documentação
**Definição:** o ideal é dispensar explicação; quando necessária, a ajuda deve ser fácil de pesquisar, focada na tarefa, com passos concretos e curta.
**Procurar:** regras do app que o usuário não entende sozinho (a principal aqui é a **regra da surpresa**: o dono não vê quem escolheu o quê).
**Implementar:** ajuda contextual (ícone "?" / texto curto perto do recurso); estados vazios que ensinam o próximo passo (o projeto já faz isso bem); onboarding curto em `BoasVindas`; no máximo uma página de "Como funciona"/FAQ.

**Cola rápida:** 1 mostre o que acontece · 2 fale a língua do usuário · 3 saída + desfazer · 4 mesma coisa, mesmo jeito · 5 evite o erro · 6 deixe à vista · 7 atalhos para experientes · 8 só o relevante · 9 erro claro, sem código, com solução · 10 ajuda curta e encontrável.

---

## 3. Princípios de Dix, Finlay, Abowd e Beale (5 + 5 + 4)

Use como reforço teórico ao justificar mudanças.

**I. Facilidade de aprender**
- **Previsibilidade:** prever o resultado de uma ação a partir do histórico.
- **Facilidade de sintetizar:** entender o efeito das ações passadas no estado atual.
- **Familiaridade:** o conhecimento prévio (mundo real ou outros apps) se aplica.
- **Facilidade de generalizar:** o que se aprendeu numa situação vale em outras.
- **Consistência:** comportamento parecido em situações parecidas (o princípio mais citado da literatura).

**II. Flexibilidade**
- **Iniciativa do diálogo:** maximizar a iniciativa do usuário e minimizar o sistema impondo a ordem (ex.: modais que travam tudo).
- **Multithreading:** apoiar mais de uma tarefa ao mesmo tempo.
- **Migração de controle da tarefa:** passar o controle entre usuário e sistema, nos dois sentidos.
- **Facilidade de substituir:** valores de entrada/saída equivalentes podem ser trocados (fazer/mostrar a mesma coisa de mais de um jeito).
- **Facilidade de personalizar:** adaptabilidade (o usuário muda) e adaptatividade (o sistema se ajusta).

**III. Robustez**
- **Facilidade de observar:** avaliar o estado interno pelo que a interface mostra.
- **Recuperabilidade:** corrigir uma ação depois de perceber o erro (para frente ou para trás/desfazer).
- **Responsividade:** percepção da velocidade de resposta e estabilidade desse tempo.
- **Conformidade com as tarefas:** o sistema suporta todas as tarefas do usuário, do jeito que ele as entende.

**Relação didática com Nielsen:** H1 ↔ Observar/Responsividade · H2 ↔ Familiaridade · H3/H9 ↔ Recuperabilidade · H4 ↔ Consistência/Generalizar · H7 ↔ Personalizar/Substituir.

---

## 4. Acessibilidade digital

Uso **equivalente** para qualquer pessoa. Referências: WCAG (W3C), com 4 princípios: Perceptível, Operável, Compreensível e Robusto; e no Brasil a LBI (Lei 13.146/2015) e o eMAG.

Recomendações básicas da aula: escolher tamanho de texto/ícones, temas/cores e alto contraste. Perfis citados: visão (leitor de tela, braille), audição (legendas, Libras/VLibras), motora (voz, rastreamento ocular), fala, autismo (pictogramas), dislexia (voz, corretor, apoio visual), idosos (interface simples, terminologia adaptada) e crianças (projeto participativo, toque).

**No QueroAê, manter sempre** (o README já promete isso): contraste ≥ 4.5:1, foco visível (`focus-visible:outline-destaque`), `aria-*` nos interativos, rótulos ligados aos campos (`useId` no `Campo`), `prefers-reduced-motion` respeitado (confetes), alvos de toque confortáveis no celular, nada transmitido **só** por cor (ex.: presente "riscado" também tem o texto "vai comprar").

---

## 5. Convenções do projeto QueroAê (para implementar)

- **Stack:** React 19, React Router 8, Vite 8, Tailwind CSS v4 (tokens em `src/index.css`), Supabase (Postgres + RLS, Auth, Edge Function `apagar-conta`). Lint: `npm run lint` (oxlint). Build: `npm run build`.
- **Nomes em português** (componentes, variáveis, funções, comentários), como no resto do código.
- **Estrutura:** telas em `src/pages/`, peças reutilizáveis em `src/components/`, utilidades em `src/lib/`. Criar componente novo só quando não der para estender um existente.
- **Cores e temas:** usar só os tokens de cor de `src/index.css` (`bg-fundo`, `text-suave`...), que têm valores para os temas claro e escuro. Não fixar cores no código nem criar classes próprias para o escuro. Janelas usam `bg-janela`. Componentes novos precisam funcionar no alto contraste: usar o prefixo `contraste:` (ex.: `contraste:border-2`) para o contorno, e nunca transparência, sombra ou efeito que dependa dela. Links usam a classe `link`. Ao mudar uma cor, rodar `python3 scripts/gerar-paleta.py`, que atualiza `docs/paleta-de-cores.html` e avisa se algum contraste ficar abaixo do mínimo.
- **Tamanhos de texto:** usar só os tokens de `src/index.css`: `text-selo`, `text-nota`, `text-apoio`, `text-corpo`, `text-subtitulo`, `text-titulo`, `text-titulo-grande` e, em campos, `text-campo`. Os tamanhos prontos do Tailwind (`text-sm`, `text-lg`...) estão desligados. Os valores vêm do Dynamic Type da Apple: o nível Médio é o padrão do iPhone, com corpo de 17 pt. Não fixar altura em elementos com texto (usar `min-h-*`), porque o texto pode crescer.
- **Unidades:** usar `rem` em medidas da interface (texto, espaços, alturas e cantos). `px` fica só para o que não deve acompanhar o texto: bordas finas, e a animação de confetes, que é calculada a partir de posições na tela.
- **Componentes base a reaproveitar:** `Botao`, `Campo`, `Modal`, `ModalConfirmar`, `Painel`, `Cartao`/`CartaoVazio`, `Abas`, `Avatar`, `Cabecalho`/`BotaoIcone`, `Icones`, `Aviso` (em `TelaAuth.jsx`), `Esqueleto` (carregamento), `EstadoDeErro` (quando os dados de uma tela não carregam) e `AvisoFlutuante` (confirmação rápida de sucesso).
- **Mensagens de erro:** sempre por `mensagemDeErro()` em `src/lib/erros.js`.
- **Formulários:** sempre com `noValidate` e `useErrosDeCampo`, com o erro junto do campo. Regras repetidas ficam em `src/lib/validacao.js`.
- **Scripts:** a política de segurança em `vercel.json` não permite script embutido na página nem conexão com outros endereços. Um serviço externo novo precisa ser liberado lá.
- **Regra da surpresa é intocável:** a lista do dono (`MinhaLista`) nunca consulta `escolha_presente`, e o RLS garante isso no banco. Nenhuma melhoria de UX pode mostrar ao dono quem escolheu o quê, nem dar pistas (ex.: contagem de "presentes já escolhidos" na própria lista).
- **Mudanças no banco:** nova migration em `supabase/migrations/` (o Lucas roda no SQL Editor). Mudanças na Edge Function precisam ser republicadas manualmente.
- **Jeito de trabalhar (do README):** passos pequenos, cada um explicado antes de ser feito, testado pelo Lucas e salvo em um commit. Não fazer commit sem ele pedir. Mobile first: testar na largura de celular.

---

## 6. Checklist para revisar qualquer tela

- [ ] **H1** Toda ação tem feedback (carregando, sucesso, erro)? Dá para saber onde estou?
- [ ] **H2** Os textos estão na linguagem do usuário, sem jargão?
- [ ] **H3** Dá para cancelar, voltar ou desfazer?
- [ ] **H4** Usa os mesmos componentes, nomes, posições e estados das outras telas?
- [ ] **H5** Os erros mais prováveis são evitados antes de acontecer? O que não tem volta pede confirmação?
- [ ] **H6** A informação necessária está visível (sem precisar lembrar)?
- [ ] **H7** Existe um caminho rápido para quem usa muito?
- [ ] **H8** Tem algo sobrando que dá para tirar ou esconder?
- [ ] **H9** As mensagens de erro dizem o problema e a solução, perto do campo, sem código?
- [ ] **H10** Uma regra pouco óbvia tem ajuda curta no lugar certo?
- [ ] **Acessibilidade** Contraste, foco, `aria`, teclado, celular e movimento reduzido?
- [ ] **Surpresa** Nada revela ao dono quem escolheu seus presentes?
- [ ] **Documentação** A entrada foi acrescentada em `docs/registro-de-mudancas.md` (seção 8) e o `.docx` foi regenerado?

---

## 7. Observações iniciais sobre o código atual (candidatas, não decisões)

Levantadas lendo o código em 2026-11-03. Servem de ponto de partida; o Lucas decide o que entra.

**O que já atende bem**
- H1: botões com "Salvando…/Entrando…/Aguarde…", "Copiado!" no código de convite, esqueleto na Home.
- H3: `<dialog>` fecha com Esc/fundo; "Desmarcar" desfaz o "Vou comprar".
- H5: `ModalConfirmar` antes de excluir/sair/remover; confirmação de senha no cadastro; link validado (`lib/links.js`); limites de tamanho no banco e na tela.
- H9: `lib/erros.js` traduz os erros do Supabase para português.
- H10: estados vazios explicam o próximo passo.

**Possíveis pontos a melhorar**
- **H4/H1:** carregamento inconsistente: `Grupo`, `MinhaLista` e `ListaDoIntegrante` mostram "Carregando…" em texto; a Home usa esqueleto.
- **H4:** no cabeçalho do `Grupo`, o mesmo lugar mostra ⚙️ "Editar grupo" para o admin e "Sair do grupo" para os outros (ações bem diferentes no mesmo lugar).
- **H4/H3:** no `ModalPresente` em modo edição, "Remover" ocupa o lugar do "Cancelar" (que some); no modo de adicionar, existe "Cancelar".
- **H5:** fechar o `ModalPresente` (Esc/fundo/X) descarta o que foi digitado sem avisar. A regra de senha ≥ 8 só é checada no envio.
- **H9:** os erros de formulário aparecem num `Aviso` no fim do formulário, não junto do campo; a mensagem genérica "Algo deu errado. Tente novamente." e "Confira os dados digitados." não dizem o que fazer.
- **H3:** remover presente só tem confirmação; daria para trocar por "Desfazer" (é uma ação de baixo risco).
- **H1:** adicionar/editar/remover presente não mostra mensagem de sucesso (a lista só muda).
- **H6/H7:** o convite depende de copiar e digitar um código; um link de convite / botão "Compartilhar" (Web Share API, WhatsApp) reduziria memória e passos.
- **H10:** a regra da surpresa (o dono não vê as escolhas) poderia ter uma explicação curta e contextual na "Minha lista".

---

## 8. Modelo de entrada do registro (`docs/registro-de-mudancas.md`)

Um único arquivo para todas as mudanças. Cada mudança vira uma **entrada** (seção `##`) acrescentada **no topo**, logo abaixo do cabeçalho do registro, numerada em sequência (Mudança 1, 2, 3…). Escrever em português. Não apagar entradas antigas: se uma mudança for desfeita depois, registrar isso numa entrada nova.

```markdown
## Mudança N: <Título curto>

**Data:** AAAA-MM-DD
**Telas/arquivos alterados:** `src/pages/...`, `src/components/...`

### Problema (antes)
O que estava ruim na tela e qual heurística era ferida.

### O que foi alterado (depois)
Lista objetiva das mudanças feitas na interface e no código.

### Heurísticas e princípios considerados
- **Hx – Nome:** como a mudança atende essa heurística.
- **Princípio de Dix (se houver):** relação com a mudança.
- **Acessibilidade (se houver):** o que foi garantido.

### Trade-offs / heurísticas em tensão
Alguma heurística que ficou em conflito e como foi resolvido (ou "Nenhum").

### Regra da surpresa
Confirmação de que a mudança não revela ao dono quem escolheu seus presentes.

### Como testar
Passos para conferir no navegador (largura de celular primeiro).
```
