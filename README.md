# QueroAê 🎁

Site para organizar grupos de presentes. Cada integrante monta uma lista do que gostaria de ganhar; os outros marcam o que vão comprar, **sem que o dono da lista saiba quem escolheu o quê**.

## Stack

- **React** + **Vite** (JavaScript)
- **React Router** (navegação)
- **Tailwind CSS v4** (estilos, com tokens de design em `src/index.css`)
- **Supabase**: Auth (e-mail/senha), Postgres com RLS e uma Edge Function

## Como rodar

Precisa do **Node 22+**.

```bash
npm install                 # instala as bibliotecas (só na primeira vez)
cp .env.example .env        # cria o arquivo de configuração
# edite o .env com a URL e a chave anon do seu projeto Supabase
npm run testar-conexao      # confere a conexão com o banco
npm run dev                 # abre em http://localhost:5173
```

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run build` | Gera a versão final do site na pasta `dist/` |
| `npm run preview` | Abre a versão final localmente |
| `npm run lint` | Procura problemas no código |

⚠️ O `.env` **nunca** vai para o Git. O front-end usa só a chave `anon`; a `service_role` não pode aparecer no projeto.

## Estrutura

```
src/
  pages/         uma tela por arquivo (Login, Home, Grupo, Integrante, Perfil...)
  components/    peças reutilizáveis (Botao, Campo, Modal, Avatar, Painel, Abas...)
  contexts/      AuthContext: quem está logado (hook useAuth)
  lib/           supabase.js (conexão), erros.js (mensagens em português), links.js
  index.css      tokens de design: cores, fontes e cantos (troque a paleta aqui)
supabase/
  migrations/    cópia do SQL do banco (tabelas, funções e RLS)
  functions/     Edge Function apagar-conta (roda no servidor do Supabase)
scripts/         testar-conexao.js
```

## Marca (logo)

O balão do "Quero!" embrulhado como presente, com laço coral. Arquivos para reutilizar em `public/marca/`:

| Arquivo | Para que usar |
|---|---|
| `queroae-simbolo.svg` | Símbolo simplificado (sem confetes), vetorial: ícones e tamanhos pequenos |
| `queroae-simbolo-completo.svg` | Símbolo com confetes, vetorial: tamanhos grandes, impressão, Figma/Canva |
| `queroae-simbolo-512.png` / `queroae-simbolo-completo-512.png` | Os mesmos em imagem 512×512, fundo transparente (redes sociais, WhatsApp) |
| `queroae-logo-horizontal.png` | Símbolo + nome, 1200×400, fundo transparente (documentos, apresentações) |
| `queroae-previa.png` | Prévia do link (1200×630) no WhatsApp, LinkedIn etc., com o slogan "O fim do “nossa… que lindo, obrigado”." |

Cores: balão `#2552c4` (azul-cobalto), laço `#e8775a` (coral), confetes `#e0a526`, `#3fb39a`, `#e06a9e`. Fonte do nome: **Instrument Sans** (semibold), gratuita no Google Fonts. No app, a logo é o componente `src/components/Logo.jsx`; o ícone da aba é `public/favicon.svg`.

## Regras importantes

- **Surpresa:** o dono não lê `escolha_presente` dos próprios presentes (garantido pelo RLS). No app, a lista do dono nunca consulta escolhas.
- Só o dono edita/remove seus presentes. Só o admin edita/exclui o grupo. O admin não pode sair do próprio grupo.
- **Apagar conta** é feito pela Edge Function `apagar-conta`: se a pessoa for admin, cada grupo passa para o integrante mais antigo (quem entrou primeiro); se ela for a única integrante, o grupo é excluído.

## Configuração do Supabase (uma vez)

1. **Banco:** rodar `supabase/migrations/20261023000000_queroae_banco.sql` no SQL Editor (já feito).
2. **Cadastro:** Authentication › Sign In / Providers › ligar *Allow new users to sign up* e o provedor *Email*.
3. **URLs:** Authentication › URL Configuration › *Site URL* = `http://localhost:5173` e *Redirect URLs* com `http://localhost:5173/**`. Ao publicar o site, adicione também o endereço final.
4. **SMTP (e-mails):** Authentication › Emails › SMTP Settings, com Gmail: host `smtp.gmail.com`, porta `465`, usuário = seu Gmail, senha = **senha de app** do Google (myaccount.google.com/apppasswords). Depois, em Rate Limits, aumente o limite de envio.
5. **E-mails em português:** já configurados em Authentication › Emails › Templates (*Confirm signup* e *Reset Password*). Os modelos originais estão no histórico do Git (commit da etapa 9), caso precise colar de novo.
6. **Edge Function:** Edge Functions › `apagar-conta` › cole o conteúdo de `supabase/functions/apagar-conta/index.ts` e faça o Deploy, com *Verify JWT* ligado. **Sempre que esse arquivo mudar, publique de novo.**

## Manter o Supabase acordado

O plano gratuito do Supabase pausa o projeto depois de 7 dias sem uso. A tarefa `.github/workflows/manter-supabase-acordado.yml` (GitHub Actions) faz uma consulta só de leitura toda segunda e quinta, o que conta como uso.

- Precisa dos segredos `SUPABASE_URL` e `SUPABASE_ANON_KEY` em **Settings › Secrets and variables › Actions** do repositório.
- O GitHub desliga tarefas agendadas em repositórios sem commits há **60 dias** (e avisa por e-mail): é só reativar em **Actions** ou fazer qualquer commit.
- Se o projeto pausar mesmo assim: painel do Supabase › **Restore project**.

## Checklist final de testes

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

## Publicar na internet (futuro)

O `npm run build` gera um site estático (pasta `dist/`). Em serviços como Vercel ou Netlify, configure para **todas as rotas abrirem o `index.html`** (o React Router cuida do resto) e coloque as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel do serviço. Depois, adicione o endereço final nas URLs do Supabase (passo 3 acima).
