# QueroAê: registro de mudanças de interface (IHC)

Registro das reformulações das telas do QueroAê, com a justificativa de cada uma pelas heurísticas de Nielsen (H1–H10), pelos princípios de Dix et al. e por critérios de acessibilidade. A referência teórica está em `docs/heuristicas-ihc.md`.

Entradas da mais recente para a mais antiga.

<!-- Novas entradas entram logo abaixo desta linha. -->

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
