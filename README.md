<div align="center">

<img src="public/marca/queroae-logo-horizontal.png" alt="QueroAê" width="420" />

### O fim do “nossa… que lindo, obrigado”.

Listas de presentes para grupos de família e amigos, com a surpresa garantida.

**🔗 Acesse: [queroae.vercel.app](https://queroae.vercel.app)**

![React](https://img.shields.io/badge/React-19-2552c4?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-2552c4?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-2552c4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_·_Auth_·_Edge_Functions-2552c4?logo=supabase&logoColor=white)

</div>

---

## Sobre

Todo mundo já ganhou um presente que foi direto para o armário. No **QueroAê**, cada pessoa do grupo monta a lista do que gostaria de ganhar, e os outros integrantes marcam o que vão comprar, **sem que o dono da lista saiba quem escolheu o quê**. Você ganha o que queria, e a surpresa continua.

## Funcionalidades

- **Grupos com código de convite:** crie um grupo (Natal da família, amigo secreto…) e chame as pessoas com um código.
- **Lista de desejos:** nome, descrição e link de referência para cada presente.
- **“Vou comprar”:** marque um presente da lista de alguém (com confetes 🎉) e desmarque se mudar de ideia.
- **Surpresa garantida:** quem escolheu o quê fica escondido do dono da lista.
- **Administração do grupo:** o admin edita, exclui e remove integrantes, sempre com confirmação.
- **Conta:** cadastro com confirmação por e-mail, recuperação de senha, nome editável e opção de apagar a conta.

## Destaques técnicos

| | |
|---|---|
| **A surpresa é garantida pelo banco, não pela tela** | Regras de *Row Level Security* (RLS) no Postgres impedem o dono de ler as escolhas dos próprios presentes, mesmo chamando a API diretamente. |
| **Identidade sempre vem do login** | Nenhuma função ou regra confia em parâmetros para saber “quem é você”: tudo usa `auth.uid()`. |
| **Superfície mínima na API** | As funções auxiliares do RLS ficam num esquema `privado`, invisível para a API; só ficam expostas as duas que o app usa. |
| **Consistência automática** | Um *trigger* libera os presentes escolhidos por quem deixa um grupo (saiu, foi removido ou apagou a conta), sem o app precisar fazer nada. |
| **Apagar conta com segurança** | Uma *Edge Function* (Deno) usa a chave de serviço **só no servidor**, transfere a administração dos grupos para o integrante mais antigo e apaga o usuário. |
| **Defesa em camadas** | Limites de tamanho no banco (`CHECK`) além dos da tela; links aceitos só com `http`/`https`; a chave secreta nunca vai para o front-end. |
| **Acessibilidade** | Contraste mínimo de 4.5:1, foco visível, `aria-*` nos componentes interativos e confetes desligados para quem pede “reduzir movimento”. |
| **Custo zero** | Vercel + Supabase (planos gratuitos) e uma tarefa do GitHub Actions que impede o banco gratuito de pausar por inatividade. |

## Tecnologias

| Camada | Ferramentas |
|---|---|
| Front-end | React 19, React Router, Vite, Tailwind CSS v4 (tokens de design em `src/index.css`) |
| Back-end | Supabase: Postgres com RLS, Auth (e-mail/senha), Edge Functions (Deno) |
| Infra | Vercel (site), GitHub Actions (tarefa agendada), SMTP do Gmail (e-mails em português) |
| Design | Paleta própria, ícones SVG desenhados à mão, logo e prévia de link próprias |

## Como foi feito

Este foi o meu **primeiro projeto programando com IA** (Claude Code). Trabalhei de forma didática, em etapas pequenas: cada passo era explicado antes de ser feito, testado por mim e salvo num commit. O histórico do Git conta a evolução do projeto, do setup ao deploy.

---

## Rodar localmente

Precisa do **Node 22+** e de um projeto no Supabase.

```bash
npm install                 # instala as bibliotecas (só na primeira vez)
cp .env.example .env        # cria o arquivo de configuração
# edite o .env com a URL e a chave anon do seu projeto Supabase
npm run testar-conexao      # confere a conexão com o banco
npm run dev                 # abre em http://localhost:5173
```

| Comando | O que faz |
|---|---|
| `npm run build` | Gera a versão final do site na pasta `dist/` |
| `npm run preview` | Abre a versão final localmente |
| `npm run lint` | Procura problemas no código |

⚠️ O `.env` **nunca** vai para o Git. O front-end usa só a chave `anon`; a `service_role` não pode aparecer no projeto.

O passo a passo de publicação está em [`DEPLOY.md`](DEPLOY.md).

<details>
<summary><strong>Estrutura de pastas</strong></summary>

```
src/
  pages/         uma tela por arquivo (Login, Home, Grupo, Integrante, Perfil...)
  components/    peças reutilizáveis (Botao, Campo, Modal, Avatar, Painel, Abas...)
  contexts/      AuthContext: quem está logado (hook useAuth)
  lib/           supabase.js (conexão), erros.js (mensagens em português), links.js, confete.js
  index.css      tokens de design: cores, fontes e cantos (troque a paleta aqui)
supabase/
  migrations/    SQL do banco (tabelas, funções, RLS, limites e trigger), em ordem
  functions/     Edge Function apagar-conta (roda no servidor do Supabase)
scripts/         testar-conexao.js
.github/
  workflows/     tarefa agendada que mantém o Supabase acordado
```
</details>

<details>
<summary><strong>Regras de negócio</strong></summary>

- **Surpresa:** o dono não lê `escolha_presente` dos próprios presentes (garantido pelo RLS). No app, a lista do dono nunca consulta escolhas.
- Só o dono edita/remove seus presentes. Só o admin edita/exclui o grupo e remove integrantes. O admin não pode sair do próprio grupo.
- Quem deixa um grupo tem os presentes que escolheu liberados automaticamente (trigger `privado.liberar_escolhas_ao_sair`).
- **Apagar conta** é feito pela Edge Function `apagar-conta`: se a pessoa for admin, cada grupo passa para o integrante mais antigo (quem entrou primeiro); se ela for a única integrante, o grupo é excluído.
</details>

<details>
<summary><strong>Configuração do Supabase</strong></summary>

1. **Banco:** rodar, em ordem, os arquivos de `supabase/migrations/` no SQL Editor (os marcados como “REGISTRO” já foram aplicados pelo painel).
2. **Cadastro:** Authentication › Sign In / Providers › ligar *Allow new users to sign up*, o provedor *Email*, *Confirm email* e senha mínima de **8** caracteres.
3. **URLs:** Authentication › URL Configuration › *Site URL* = endereço do site e *Redirect URLs* com `https://endereco-do-site/**` (e `http://localhost:5173/**` para desenvolver).
4. **SMTP (e-mails):** Authentication › Emails › SMTP Settings, com Gmail: host `smtp.gmail.com`, porta `465`, usuário = o Gmail, senha = **senha de app** do Google (myaccount.google.com/apppasswords). Depois, em Rate Limits, aumente o limite de envio.
5. **E-mails em português:** Authentication › Emails › Templates (*Confirm signup* e *Reset Password*). Os modelos estão no histórico do Git (commit da etapa 9).
6. **Edge Function:** Edge Functions › `apagar-conta` › cole o conteúdo de `supabase/functions/apagar-conta/index.ts` e faça o Deploy, com *Verify JWT* ligado. **Sempre que esse arquivo mudar, publique de novo.**
</details>

<details>
<summary><strong>Manter o Supabase acordado</strong></summary>

O plano gratuito do Supabase pausa o projeto depois de 7 dias sem uso. A tarefa `.github/workflows/manter-supabase-acordado.yml` (GitHub Actions) faz uma consulta só de leitura toda segunda e quinta, o que conta como uso.

- Precisa dos segredos `SUPABASE_URL` e `SUPABASE_ANON_KEY` em **Settings › Secrets and variables › Actions** do repositório.
- O GitHub desliga tarefas agendadas em repositórios sem commits há **60 dias** (e avisa por e-mail): é só reativar em **Actions** ou fazer qualquer commit.
- Se o projeto pausar mesmo assim: painel do Supabase › **Restore project**.
</details>

<details>
<summary><strong>Marca (logo)</strong></summary>

O balão do “Quero!” embrulhado como presente, com laço coral. Arquivos para reutilizar em `public/marca/`:

| Arquivo | Para que usar |
|---|---|
| `queroae-simbolo.svg` | Símbolo simplificado (sem confetes), vetorial: ícones e tamanhos pequenos |
| `queroae-simbolo-completo.svg` | Símbolo com confetes, vetorial: tamanhos grandes, impressão, Figma/Canva |
| `queroae-simbolo-512.png` / `queroae-simbolo-completo-512.png` | Os mesmos em imagem 512×512, fundo transparente (redes sociais, WhatsApp) |
| `queroae-logo-horizontal.png` | Símbolo + nome, 1200×400, fundo transparente (documentos, apresentações) |
| `queroae-previa.png` | Prévia do link (1200×630) no WhatsApp, LinkedIn etc. |

Cores: balão `#2552c4` (azul-cobalto), laço `#e8775a` (coral), confetes `#e0a526`, `#3fb39a`, `#e06a9e`. Fonte do nome: **Instrument Sans** (semibold), gratuita no Google Fonts. No app, a logo é o componente `src/components/Logo.jsx`; o ícone da aba é `public/favicon.svg`.
</details>

<details>
<summary><strong>Checklist de testes</strong></summary>

Use contas de teste. Dica: `seuemail+teste1@gmail.com`, `+teste2`… chegam todas na mesma caixa.

- [x] SMTP configurado: o e-mail de confirmação chega, em português, enviado por "QueroAê"
- [x] Edge Function publicada com a versão mais recente
- [x] Cadastro, login, sair e "Esqueceu a senha?" funcionam
- [x] Criar grupo, copiar o código, entrar com o código (e aviso "Você já participa")
- [x] Adicionar, editar e remover presentes; link `javascript:` é recusado
- [x] Outra conta marca "Vou comprar" e desmarca; o presente aparece na Home dela
- [x] **Surpresa:** o dono nunca vê seus presentes riscados
- [x] Admin edita e exclui o grupo; integrante sai do grupo e seus presentes escolhidos ficam livres
- [x] Apagar conta de admin: o grupo passa para o integrante mais antigo
- [x] Apagar conta de admin sozinho no grupo: o grupo é excluído
- [x] Tudo funciona na largura de celular
</details>
