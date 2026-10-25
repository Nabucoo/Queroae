# Plano de deploy do QueroAê

Objetivo: colocar o site no ar **sem gastar nada**, **seguro o bastante para a família** e servindo de **portfólio**.

Serviços (todos gratuitos): **GitHub** (código), **Vercel** (site no ar), **Supabase** (banco e login, já em uso), **Gmail** (e-mails, já em uso).

**Estamos em:** Fase 0 · Decidir

---

## Fases

- [ ] **Fase 0 · Decidir:** escolher o que arrumar antes de subir
- [ ] **Fase 1 · Ajustar:** fazer as correções escolhidas (código e, com autorização, banco)
- [ ] **Fase 2 · GitHub:** enviar o código para o GitHub (portfólio e fonte do deploy)
- [ ] **Fase 3 · Vercel:** conectar o GitHub, cadastrar as chaves e publicar
- [ ] **Fase 4 · Supabase:** apontar o login e os e-mails para o endereço do site no ar
- [ ] **Fase 5 · Testar no ar:** checklist curto no site publicado
- [ ] **Fase 6 · Manter de graça:** impedir que o Supabase "durma" e finalizar o README de portfólio

---

## Fase 0 · Decisões

### Obrigatórios (fazem parte do deploy)
- [ ] Rotas sem erro 404 ao apertar F5 (Fase 1)
- [ ] "Site URL" e "Redirect URLs" do Supabase com o endereço do site (Fase 4)
- [ ] Chaves `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` e Node 22 na Vercel (Fase 3)

### Opcionais (a decidir, um por um)
| # | Item | Decisão |
|---|---|---|
| A | Limite de tamanho dos textos no banco | ✅ **feito** (6 regras CHECK pelo painel, conferidas; nome do cadastro ≤ 60; link na tela ≤ 2000) |
| B | Esconder as funções auxiliares do banco | ✅ **feito** (7 funções no esquema `privado`, testado pela API) + admin remove integrantes com dupla confirmação + trigger que libera os presentes de quem sai |
| C | Religar "Confirm email" e senha mínima de 8 | a decidir |
| D | Não deixar o Supabase "dormir" (acesso semanal automático) | a decidir |
| E | Corrigir o botão "Copiar" | a decidir |
| F | Prévia bonita no WhatsApp | a decidir |
| G | README de portfólio | a decidir |
| H | Separar o código por tela (code splitting) | a decidir |
| I | E-mail remetente próprio do app | a decidir |
| J | Arquivos internos no repositório público | a decidir |
| K | Política de privacidade | a decidir |
| — | Backup automático e apagar conta "tudo ou nada" | fora do plano (backup é pago; risco baixo) |
