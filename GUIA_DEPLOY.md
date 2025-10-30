# 📚 Guia Completo: Setup Local e Deploy

## PARTE 1: DOWNLOAD E CONFIGURAÇÃO LOCAL

### Passo 1: Baixar o Projeto

1. Acesse o painel de controle do Manus
2. Clique em **"Code"** no Management UI
3. Clique em **"Download all files"**
4. Extraia o arquivo ZIP em uma pasta de sua escolha

### Passo 2: Abrir no VSCode

```bash
# Abra a pasta do projeto no VSCode
# Ou use o terminal:
cd caminho/para/restaurante_automatizado
code .
```

### Passo 3: Instalar Dependências

```bash
# Instale as dependências do projeto
pnpm install

# Se não tiver pnpm instalado, instale globalmente:
npm install -g pnpm
```

### Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env.local`
2. Copie o conteúdo abaixo e preencha com seus dados:

```env
# Database
DATABASE_URL=mysql://usuario:senha@localhost:3306/restaurante

# OAuth Manus
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=sua_chave_secreta_aleatoria

# Informações do Proprietário
OWNER_OPEN_ID=seu_open_id
OWNER_NAME="Seu Nome"

# App
VITE_APP_TITLE="Sistema de Gestão de Restaurante"
VITE_APP_LOGO=https://seu-logo.png

# APIs Manus
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
```

### Passo 5: Configurar Banco de Dados Local

```bash
# Se estiver usando MySQL localmente:
# 1. Crie um banco de dados
mysql -u root -p
CREATE DATABASE restaurante;
EXIT;

# 2. Execute as migrações
pnpm db:push
```

### Passo 6: Rodar Localmente

```bash
# Inicie o servidor de desenvolvimento
pnpm dev

# O projeto abrirá em: http://localhost:5173
```

---

## PARTE 2: DEPLOY DO BACKEND NO RENDER

### Passo 1: Preparar o Repositório GitHub

```bash
# 1. Crie um repositório no GitHub
# https://github.com/new

# 2. No terminal do projeto:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/restaurante-automatizado.git
git push -u origin main
```

### Passo 2: Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Sign up"**
3. Conecte com sua conta GitHub
4. Autorize o Render a acessar seus repositórios

### Passo 3: Criar Web Service para o Backend

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório GitHub
4. Preencha as informações:

```
Name: restaurante-backend
Environment: Node
Build Command: pnpm install && pnpm db:push
Start Command: pnpm start
```

### Passo 4: Configurar Variáveis de Ambiente no Render

1. Na página do Web Service, vá para **"Environment"**
2. Adicione as seguintes variáveis:

```
DATABASE_URL=mysql://usuario:senha@seu-host-mysql.com:3306/restaurante
JWT_SECRET=sua_chave_secreta_aleatoria
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=Seu Nome
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
```

### Passo 5: Deploy Automático

- O Render fará deploy automaticamente quando você fizer push para a branch `main`
- Você receberá a URL do backend: `https://seu-app.onrender.com`

---

## PARTE 3: DEPLOY DO FRONTEND NO GITHUB PAGES

### Passo 1: Preparar o Projeto para GitHub Pages

1. Abra o arquivo `vite.config.ts` na raiz do projeto
2. Adicione a configuração para GitHub Pages:

```typescript
export default defineConfig({
  base: '/restaurante-automatizado/', // Substitua pelo nome do seu repositório
  // ... resto da configuração
})
```

### Passo 2: Criar Arquivo de Deploy (GitHub Actions)

1. Na raiz do projeto, crie a pasta: `.github/workflows`
2. Crie um arquivo chamado `deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build
      run: pnpm build
      env:
        VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
        OAUTH_SERVER_URL: ${{ secrets.OAUTH_SERVER_URL }}
        VITE_OAUTH_PORTAL_URL: ${{ secrets.VITE_OAUTH_PORTAL_URL }}
        VITE_APP_TITLE: "Sistema de Gestão de Restaurante"
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./client/dist
```

### Passo 3: Configurar Secrets no GitHub

1. No seu repositório GitHub, vá para **Settings → Secrets and variables → Actions**
2. Clique em **"New repository secret"**
3. Adicione os seguintes secrets:

```
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### Passo 4: Ativar GitHub Pages

1. No repositório, vá para **Settings → Pages**
2. Em **"Source"**, selecione **"Deploy from a branch"**
3. Selecione **"gh-pages"** como branch
4. Clique em **"Save"**

### Passo 5: Fazer Push e Deploy

```bash
# Faça um commit e push
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main

# O GitHub Actions executará automaticamente
# Você verá o progresso em: Actions → Deploy Frontend
```

### Passo 6: Acessar o Frontend

Após o deploy, seu frontend estará disponível em:
```
https://seu-usuario.github.io/restaurante-automatizado/
```

---

## PARTE 4: CONECTAR FRONTEND AO BACKEND

### Passo 1: Atualizar URL da API

1. Abra o arquivo `client/src/main.tsx`
2. Procure por `httpBatchLink`
3. Atualize a URL:

```typescript
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "https://seu-app.onrender.com/api/trpc", // URL do seu backend no Render
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

### Passo 2: Configurar CORS no Backend

1. Abra o arquivo `server/_core/index.ts`
2. Configure CORS para aceitar requisições do GitHub Pages:

```typescript
app.use(cors({
  origin: [
    "https://seu-usuario.github.io",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));
```

### Passo 3: Fazer Deploy Novamente

```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

---

## PARTE 5: BANCO DE DADOS

### Opção 1: MySQL no Render (Recomendado)

1. No Render, clique em **"New +"**
2. Selecione **"MySQL"**
3. Preencha as informações
4. Copie a connection string para `DATABASE_URL`

### Opção 2: Usar Serviço Externo

- **PlanetScale** (MySQL): https://planetscale.com
- **Neon** (PostgreSQL): https://neon.tech
- **Supabase** (PostgreSQL): https://supabase.com

---

## CHECKLIST FINAL

### Antes de fazer Deploy:

- [ ] Projeto baixado e funcionando localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado e migrado
- [ ] Repositório GitHub criado
- [ ] Código feito push para GitHub

### Deploy Backend (Render):

- [ ] Web Service criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] URL do backend anotada

### Deploy Frontend (GitHub Pages):

- [ ] Arquivo `vite.config.ts` configurado
- [ ] Arquivo `.github/workflows/deploy.yml` criado
- [ ] Secrets adicionados no GitHub
- [ ] GitHub Pages ativado
- [ ] Deploy bem-sucedido

### Conexão Final:

- [ ] URL da API atualizada no frontend
- [ ] CORS configurado no backend
- [ ] Teste de conexão realizado

---

## TROUBLESHOOTING

### Erro: "Cannot find module"

```bash
# Limpe cache e reinstale
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Database connection failed"

- Verifique a `DATABASE_URL`
- Certifique-se de que o banco de dados está acessível
- Teste a conexão com: `pnpm db:push`

### Erro: "CORS error"

- Atualize a configuração de CORS no backend
- Certifique-se de que a URL do frontend está na lista de origens permitidas

### Frontend não conecta ao backend

- Verifique a URL da API em `client/src/main.tsx`
- Certifique-se de que o backend está rodando
- Verifique o console do navegador para mensagens de erro

---

## SUPORTE

Se tiver dúvidas durante o processo, entre em contato com o suporte do Manus em:
https://help.manus.im

Boa sorte com seu deploy! 🚀
