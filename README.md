# Sistema de Gestão de Restaurante Automatizado

Um sistema completo e automatizado para gerenciar restaurantes, com funcionalidades de estoque, ponto de venda (PDV), gestão de mesas e relatórios de vendas.

## 🚀 Características

- **Gestão de Estoque**: Controle completo de produtos, quantidades e movimentações
- **PDV (Ponto de Venda)**: Sistema integrado para criar comandas e registrar vendas
- **Gestão de Mesas**: Visualizar e gerenciar o status das mesas do restaurante
- **Relatórios**: Análise detalhada de vendas com filtros por período
- **Autenticação**: Sistema de login seguro com Manus OAuth
- **Interface Responsiva**: Design moderno e adaptável para desktop e mobile

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **tRPC** - RPC type-safe

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **tRPC** - RPC type-safe
- **Drizzle ORM** - ORM moderno

### Banco de Dados
- **MySQL/PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - Gerenciamento de schema

### Autenticação
- **Manus OAuth** - Sistema de autenticação

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou pnpm
- Banco de dados MySQL ou PostgreSQL

## 🔧 Instalação Local

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/restaurante-automatizado.git
cd restaurante-automatizado
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://usuario:senha@localhost:3306/restaurante

# OAuth
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# App Info
VITE_APP_TITLE=Sistema de Gestão de Restaurante
VITE_APP_LOGO=https://seu-logo-url.com/logo.png

# Owner Info
OWNER_NAME=Nome do Proprietário
OWNER_OPEN_ID=seu_open_id

# APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
```

### 4. Configure o banco de dados
```bash
pnpm db:push
```

### 5. Inicie o servidor de desenvolvimento
```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Estrutura do Projeto

```
restaurante-automatizado/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   └── App.tsx        # Componente raiz
│   └── index.html
├── server/                 # Backend Node.js/Express
│   ├── routers.ts         # Rotas tRPC
│   ├── db.ts              # Funções de banco de dados
│   └── _core/             # Configurações principais
├── drizzle/               # Migrations e schema
│   ├── schema.ts          # Definição das tabelas
│   └── migrations/        # Histórico de migrations
├── shared/                # Código compartilhado
└── package.json
```

## 🗄️ Banco de Dados

### Tabelas Principais

- **users** - Usuários autenticados
- **produtos** - Itens do cardápio
- **estoque** - Controle de quantidade de produtos
- **mesas** - Mesas do restaurante
- **comandas** - Pedidos dos clientes
- **itensComanda** - Itens dentro de uma comanda
- **vendas** - Registro de vendas finalizadas
- **movimentacoesEstoque** - Histórico de movimentações

## 🚀 Deploy

### Frontend (Vercel/GitHub Pages)

1. **Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **GitHub Pages:**
   - Configure o repositório no GitHub
   - Ative GitHub Pages nas configurações
   - Configure o workflow de CI/CD

### Backend (Render)

1. Crie uma conta em [Render](https://render.com)
2. Crie um novo serviço Web
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente
5. Deploy automático em cada push

### Banco de Dados

- Use um serviço gerenciado como:
  - [Railway](https://railway.app)
  - [Render](https://render.com)
  - [PlanetScale](https://planetscale.com)
  - [AWS RDS](https://aws.amazon.com/rds/)

## 📚 Documentação das APIs

### Produtos
- `GET /api/trpc/produtos.list` - Listar todos os produtos
- `GET /api/trpc/produtos.getById` - Obter produto por ID
- `POST /api/trpc/produtos.create` - Criar novo produto
- `POST /api/trpc/produtos.update` - Atualizar produto

### Estoque
- `GET /api/trpc/estoque.list` - Listar estoque
- `POST /api/trpc/estoque.atualizar` - Atualizar quantidade
- `POST /api/trpc/estoque.registrarMovimentacao` - Registrar entrada/saída

### Mesas
- `GET /api/trpc/mesas.list` - Listar mesas
- `POST /api/trpc/mesas.create` - Criar mesa
- `POST /api/trpc/mesas.atualizarStatus` - Atualizar status

### Comandas
- `GET /api/trpc/comandas.listAbertas` - Listar comandas abertas
- `POST /api/trpc/comandas.create` - Criar comanda
- `POST /api/trpc/comandas.adicionarItem` - Adicionar item
- `POST /api/trpc/comandas.fechar` - Fechar comanda

### Vendas
- `GET /api/trpc/vendas.list` - Listar vendas
- `GET /api/trpc/vendas.relatorio` - Gerar relatório

## 🔐 Segurança

- Autenticação via Manus OAuth
- Variáveis de ambiente protegidas
- HTTPS em produção
- Validação de entrada com Zod
- CORS configurado

## 📝 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Suporte

Para suporte, entre em contato ou abra uma issue no GitHub.

## 🎯 Roadmap

- [ ] Integração com sistemas de pagamento
- [ ] Relatórios avançados e gráficos
- [ ] Aplicativo mobile
- [ ] Integração com impressoras
- [ ] Sistema de cupom fiscal
- [ ] Controle de acesso por usuário
- [ ] Backup automático do banco de dados

---

**Desenvolvido com ❤️ usando Manus**
