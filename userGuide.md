# Guia do Usuário - Sistema de Gestão de Restaurante Automatizado

## 📍 Acesso ao Sistema

**URL**: https://seu-dominio.com (após deploy)

**Acesso**: Login obrigatório com credenciais Manus OAuth

---

## ⚡ Powered by Manus

Este sistema foi desenvolvido com tecnologia de ponta:

**Frontend**: React 19 + TypeScript + Tailwind CSS + shadcn/ui  
**Backend**: Node.js + Express + TypeScript + tRPC  
**Banco de Dados**: PostgreSQL com Drizzle ORM  
**Autenticação**: Manus OAuth integrado  
**Deployment**: Auto-scaling infrastructure com global CDN

---

## 🎯 Usando Seu Sistema

### 1. **Gestão de Estoque**

Controle completo de produtos e quantidades do seu restaurante.

**Como acessar:**
- Clique em "Estoque" na página inicial ou no menu lateral
- Você verá todos os produtos cadastrados

**Adicionar novo produto:**
1. Clique no botão "Novo Produto"
2. Preencha "Nome" (obrigatório)
3. Adicione "Descrição" (opcional)
4. Digite o "Preço (R$)" (obrigatório)
5. Selecione a "Categoria" (opcional)
6. Clique em "Criar Produto"

**Visualizar estoque:**
- A tabela mostra todos os produtos com:
  - Nome do produto
  - Categoria
  - Preço unitário
  - Quantidade em estoque
  - Status (Em estoque, Baixo estoque, Fora de estoque)

**Alertas:**
- Produtos com estoque baixo aparecem destacados no topo
- Você pode atualizar quantidades diretamente

### 2. **Ponto de Venda (PDV)**

Sistema integrado para criar comandas e registrar vendas.

**Como acessar:**
- Clique em "PDV" na página inicial ou no menu lateral

**Criar nova comanda:**
1. Clique no botão "+" (Novo)
2. Digite o "Número da Comanda" (ex: 001)
3. Selecione a "Mesa" (opcional)
4. Clique em "Criar Comanda"

**Adicionar itens à comanda:**
1. Selecione uma comanda na lista à esquerda
2. Na seção "Produto", escolha um item do cardápio
3. Digite a "Quantidade"
4. Clique em "Adicionar"

**Visualizar comanda:**
- Todos os itens aparecem listados com:
  - Nome do produto
  - Quantidade e preço unitário
  - Subtotal de cada item
  - **Total da comanda** em destaque

**Fechar comanda:**
1. Revise todos os itens
2. Clique em "Fechar Comanda"
3. A venda é registrada automaticamente
4. A mesa fica disponível novamente

### 3. **Gestão de Mesas**

Controle visual do status de cada mesa do seu restaurante.

**Como acessar:**
- Clique em "Mesas" na página inicial ou no menu lateral

**Criar nova mesa:**
1. Clique no botão "Nova Mesa"
2. Digite o "Número da Mesa"
3. Digite a "Capacidade" (número de pessoas)
4. Clique em "Criar Mesa"

**Atualizar status da mesa:**
- Cada mesa é exibida como um card colorido
- Clique nos botões para mudar o status:
  - **Disponível** (verde) - Mesa livre
  - **Ocupada** (vermelho) - Mesa com clientes
  - **Reservada** (amarelo) - Mesa reservada

**Visualizar informações:**
- Número da mesa
- Capacidade
- Status atual
- Botões para alternar status rapidamente

### 4. **Relatórios de Vendas**

Análise detalhada do desempenho do seu restaurante.

**Como acessar:**
- Clique em "Relatórios" na página inicial ou no menu lateral

**Filtrar vendas:**
1. Selecione a "Data Início" (opcional)
2. Selecione a "Data Fim" (opcional)
3. Os dados atualizam automaticamente
4. Clique em "Limpar Filtros" para ver todas as vendas

**Visualizar KPIs:**
- **Total de Vendas**: Número de transações no período
- **Faturamento Total**: Valor total arrecadado
- **Ticket Médio**: Valor médio por venda

**Detalhamento de vendas:**
- Tabela com todas as vendas mostrando:
  - Número da venda
  - Data e hora
  - Quantidade de itens
  - Subtotal
  - Desconto aplicado
  - Total final
  - Status (Paga, Pendente, Cancelada)

---

## 🛠️ Gerenciando Seu Sistema

### Acessar o Painel de Gerenciamento

Clique no ícone de menu (três linhas) no canto superior direito para acessar:

**Settings (Configurações)**
- **General**: Alterar nome e logo do sistema
- **Domains**: Configurar domínio customizado
- **Secrets**: Gerenciar variáveis de ambiente
- **Notifications**: Configurar notificações

**Dashboard**
- Visualizar estatísticas de uso
- Monitorar performance
- Ver analytics do site

**Database**
- Acessar dados diretamente
- Fazer backup
- Gerenciar tabelas

---

## 📱 Acessando de Diferentes Dispositivos

O sistema funciona em:
- **Desktop**: Navegadores Chrome, Firefox, Safari, Edge
- **Tablet**: Interface adaptada para telas menores
- **Mobile**: Versão responsiva completa

---

## ⚙️ Dicas de Uso

### Boas Práticas

1. **Estoque**: Atualize quantidades regularmente para evitar falta de produtos
2. **Mesas**: Mantenha o status atualizado para saber disponibilidade em tempo real
3. **Comandas**: Feche comandas assim que o cliente pagar
4. **Relatórios**: Consulte regularmente para acompanhar o desempenho

### Atalhos Úteis

- **Home**: Volta para a página inicial
- **Logout**: Sai do sistema (canto superior direito)
- **Notificações**: Receba alertas de estoque baixo

---

## 🆘 Próximos Passos

**Fale com o Manus AI anytime para:**
- Adicionar novas funcionalidades
- Customizar o sistema
- Resolver problemas
- Melhorar a interface

**Sugestões de melhorias:**
- Integração com sistemas de pagamento
- Relatórios mais avançados
- Aplicativo mobile
- Integração com impressoras

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte este guia
2. Entre em contato com o suporte
3. Fale com o Manus AI para ajustes

---

**Aproveite seu sistema de gestão automatizado! 🎉**
