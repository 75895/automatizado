# ⚡ Setup Rápido - 5 Minutos

## 1️⃣ BAIXAR E ABRIR NO VSCODE

```bash
# Após extrair o ZIP:
cd restaurante_automatizado
code .
```

## 2️⃣ INSTALAR DEPENDÊNCIAS

```bash
pnpm install
```

## 3️⃣ CRIAR .env.local

Crie um arquivo `.env.local` na raiz com:

```env
DATABASE_URL=mysql://root:password@localhost:3306/restaurante
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=sua_chave_secreta_aleatoria_aqui
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=Seu Nome
VITE_APP_TITLE=Sistema de Gestão de Restaurante
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
```

## 4️⃣ RODAR LOCALMENTE

```bash
pnpm dev
```

Acesse: **http://localhost:5173**

---

# 🚀 DEPLOY NO RENDER + GITHUB PAGES

## BACKEND NO RENDER

### 1. Criar repositório GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/restaurante.git
git push -u origin main
```

### 2. No Render.com

1. Clique em **"New Web Service"**
2. Conecte seu repositório
3. Configure:
   - **Name**: restaurante-backend
   - **Build Command**: `pnpm install && pnpm db:push`
   - **Start Command**: `pnpm start`

4. Adicione variáveis de ambiente (Environment):
   - DATABASE_URL
   - JWT_SECRET
   - VITE_APP_ID
   - OAUTH_SERVER_URL
   - OWNER_OPEN_ID
   - OWNER_NAME
   - BUILT_IN_FORGE_API_URL
   - BUILT_IN_FORGE_API_KEY

5. Clique em **"Create Web Service"**

**Sua URL do backend será**: `https://seu-app.onrender.com`

---

## FRONTEND NO GITHUB PAGES

### 1. Atualizar vite.config.ts

```typescript
export default defineConfig({
  base: '/restaurante/', // Nome do seu repositório
  // ... resto
})
```

### 2. Criar `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install -g pnpm
    - run: pnpm install
    - run: pnpm build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./client/dist
```

### 3. Adicionar Secrets no GitHub

Settings → Secrets → New repository secret

```
VITE_APP_ID=seu_valor
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 4. Ativar GitHub Pages

Settings → Pages → Source: **gh-pages** branch

### 5. Fazer Push

```bash
git add .
git commit -m "Configure deployment"
git push origin main
```

**Seu frontend estará em**: `https://seu-usuario.github.io/restaurante/`

---

## 3️⃣ CONECTAR FRONTEND AO BACKEND

Abra `client/src/main.tsx` e atualize:

```typescript
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "https://seu-app.onrender.com/api/trpc", // ← Sua URL do Render
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});
```

Faça push novamente:

```bash
git add .
git commit -m "Update API URL"
git push origin main
```

---

## ✅ PRONTO!

Seu sistema está online! 🎉

- **Frontend**: https://seu-usuario.github.io/restaurante/
- **Backend**: https://seu-app.onrender.com

---

## 📞 PRECISA DE AJUDA?

Veja o arquivo `GUIA_DEPLOY.md` para instruções detalhadas!
