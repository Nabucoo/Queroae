# Plano de deploy do QueroAê

Objetivo: colocar o site no ar **sem gastar nada**, **seguro o bastante para a família** e servindo de **portfólio**.

Serviços (todos gratuitos): **GitHub** (código), **Vercel** (site no ar), **Supabase** (banco e login, já em uso), **Gmail** (e-mails, já em uso).

**Estamos em:** Fase 2 · GitHub

---

## Fases

- [x] **Fase 0 · Decidir:** escolher o que arrumar antes de subir
- [x] **Fase 1 · Ajustar:** fazer as correções escolhidas (código e, com autorização, banco)
- [ ] **Fase 2 · GitHub:** enviar o código para o GitHub (portfólio e fonte do deploy)
- [ ] **Fase 3 · Vercel:** conectar o GitHub, cadastrar as chaves e publicar
- [ ] **Fase 4 · Supabase:** apontar o login e os e-mails para o endereço do site no ar
- [ ] **Fase 5 · Testar no ar:** checklist curto no site publicado
- [ ] **Fase 6 · Manter de graça:** impedir que o Supabase "durma" e finalizar o README de portfólio

---

## Fase 0 · Decisões

### Obrigatórios (fazem parte do deploy)
- [x] Rotas sem erro 404 ao apertar F5 (`vercel.json`; confirmar na Fase 5)
- [ ] "Site URL" e "Redirect URLs" do Supabase com o endereço do site (Fase 4)
- [ ] Chaves `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` na Vercel (Fase 3). Node 22 já fixado em `package.json` (`engines`)

### Opcionais (a decidir, um por um)
| # | Item | Decisão |
|---|---|---|
| A | Limite de tamanho dos textos no banco | ✅ **feito** (6 regras CHECK pelo painel, conferidas; nome do cadastro ≤ 60; link na tela ≤ 2000) |
| B | Esconder as funções auxiliares do banco | ✅ **feito** (7 funções no esquema `privado`, testado pela API) + admin remove integrantes com dupla confirmação + trigger que libera os presentes de quem sai |
| C | Religar "Confirm email" e senha mínima de 8 | ✅ **feito** (painel do Supabase + app atualizado para 8 caracteres) |
| D | Não deixar o Supabase "dormir" (acesso semanal automático) | 🟡 **em andamento**: tarefa criada e testada; falta cadastrar os segredos no GitHub (Fase 2) |
| E | Corrigir o botão "Copiar" | ❌ fora (raro: só em navegador sem HTTPS ou que bloqueia a área de transferência) |
| F | Prévia bonita no WhatsApp | 🟡 **em andamento**: imagem (arte P3 + slogan S4) e meta tags prontas; falta o endereço completo em `og:image`/`og:url` (Fase 3) e testar no WhatsApp |
| G | README de portfólio | 🟡 **em andamento**: README reescrito (sem prints, por escolha); falta o link do site (Fase 3) e a revisão final (Fase 6) |
| H | Separar o código por tela (code splitting) | ❌ fora (ganho imperceptível para a família) |
| I | E-mail remetente próprio do app | ✅ **feito** (Gmail próprio do app no SMTP, feito pelo Lucas) |
| J | Arquivos internos no repositório público | ✅ **feito** (prompt inicial e pasta `.taste-skill/` apagados; `.taste-skill/` no `.gitignore`) |
| K | Política de privacidade | ✅ **feito** (página `/privacidade` com contato queroae.app@gmail.com; links no cadastro e no Perfil) |
| — | Backup automático e apagar conta "tudo ou nada" | fora do plano (backup é pago; risco baixo) |
