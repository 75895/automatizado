import {
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  serial, // Novo: Usado para auto-incremento
  integer, // Novo: Usado para chaves estrangeiras e inteiros normais
  pgEnum, // Novo: Usado para ENUMs
} from "drizzle-orm/pg-core"; // <--- MUDANÇA CRUCIAL: pg-core

import { sql } from "drizzle-orm"; // Novo: Para usar funções SQL como now()

// 1. Definição do ENUM para Papéis de Usuário
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Mudado para serial
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(), // Mudado para pgEnum
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(), // Removido .onUpdateNow()
  lastSignedIn: timestamp("lastSignedIn").default(sql`now()`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 2. Definição do ENUM para Status de Mesas
export const mesaStatusEnum = pgEnum("mesa_status", ["disponivel", "ocupada", "reservada"]);

/**
 * Mesas - Mesas do restaurante
 */
export const mesas = pgTable("mesas", {
  id: serial("id").primaryKey(),
  numero: integer("numero").notNull().unique(),
  capacidade: integer("capacidade").default(4).notNull(),
  status: mesaStatusEnum("status").default("disponivel").notNull(), // Mudado para pgEnum
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(), // Removido .onUpdateNow()
});

export type Mesa = typeof mesas.$inferSelect;
export type InsertMesa = typeof mesas.$inferInsert;

// 3. Definição do ENUM para Status de Comandas
export const comandaStatusEnum = pgEnum("comanda_status", ["aberta", "fechada", "cancelada"]);

/**
 * Comandas - Pedidos dos clientes
 */
export const comandas = pgTable("comandas", {
  id: serial("id").primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  mesaId: integer("mesaId"),
  status: comandaStatusEnum("status").default("aberta").notNull(), // Mudado para pgEnum
  totalItens: integer("totalItens").default(0).notNull(),
  totalValor: decimal("totalValor", { precision: 10, scale: 2 }).default("0").notNull(),
  dataAbertura: timestamp("dataAbertura").default(sql`now()`).notNull(),
  dataFechamento: timestamp("dataFechamento"),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(), // Removido .onUpdateNow()
});

export type Comanda = typeof comandas.$inferSelect;
export type InsertComanda = typeof comandas.$inferInsert;

// 4. Definição do ENUM para Status de Itens da Comanda
export const itemStatusEnum = pgEnum("item_status", ["pendente", "preparando", "pronto", "servido"]);

/**
 * ItensComanda - Itens dentro de uma comanda
 */
export const itensComanda = pgTable("itensComanda", {
  id: serial("id").primaryKey(),
  comandaId: integer("comandaId").notNull(),
  produtoId: integer("produtoId").notNull(),
  quantidade: integer("quantidade").notNull(),
  precoUnitario: decimal("precoUnitario", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  status: itemStatusEnum("status").default("pendente").notNull(), // Mudado para pgEnum
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(), // Removido .onUpdateNow()
});

export type ItemComanda = typeof itensComanda.$inferSelect;
export type InsertItemComanda = typeof itensComanda.$inferInsert;

// 5. Definição do ENUM para Forma de Pagamento
export const pagamentoEnum = pgEnum("pagamento_forma", ["dinheiro", "debito", "credito", "pix"]);

// 6. Definição do ENUM para Status de Venda
export const vendaStatusEnum = pgEnum("venda_status", ["pendente", "paga", "cancelada"]);

/**
 * Vendas - Registro de vendas finalizadas
 */
export const vendas = pgTable("vendas", {
  id: serial("id").primaryKey(),
  numeroVenda: varchar("numeroVenda", { length: 50 }).notNull().unique(),
  numeroNota: varchar("numeroNota", { length: 50 }).unique(), // Número da nota fiscal
  comandaId: integer("comandaId"),
  totalItens: integer("totalItens").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0").notNull(),
  totalVenda: decimal("totalVenda", { precision: 10, scale: 2 }).notNull(),
  formaPagamento: pagamentoEnum("formaPagamento").notNull(), // Mudado para pgEnum
  status: vendaStatusEnum("status").default("pendente").notNull(), // Mudado para pgEnum
  dataVenda: timestamp("dataVenda").default(sql`now()`).notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(), // Removido .onUpdateNow()
});

export type Venda = typeof vendas.$inferSelect;
export type InsertVenda = typeof vendas.$inferInsert;

// 7. Definição do ENUM para Tipo de Movimentação
export const movimentacaoTipoEnum = pgEnum("movimentacao_tipo", ["entrada", "saida", "ajuste"]);

/**
 * MovimentacoesEstoque - Histórico de movimentações de estoque
 */
export const movimentacoesEstoque = pgTable("movimentacoesEstoque", {
  id: serial("id").primaryKey(),
  produtoId: integer("produtoId").notNull(),
  tipo: movimentacaoTipoEnum("tipo").notNull(), // Mudado para pgEnum
  quantidade: integer("quantidade").notNull(),
  motivo: text("motivo"),
  usuarioId: integer("usuarioId"),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
});

export type MovimentacaoEstoque = typeof movimentacoesEstoque.$inferSelect;
export type InsertMovimentacaoEstoque = typeof movimentacoesEstoque.$inferInsert;

// Tabelas restantes (Insumos, EstoqueInsumos, Produtos, FichaTecnica, Estoque)
// O restante das tabelas também precisa ser ajustado. Vou fornecer o código completo.

/**
 * Insumos - Ingredientes e matérias-primas
 */
export const insumos = pgTable("insumos", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(), // Começa com 1000
  nome: varchar("nome", { length: 255 }).notNull(), // Obrigatoriamente em MAIÚSCULO
  descricao: text("descricao"),
  unidade: varchar("unidade", { length: 50 }).notNull(), // kg, L, unidade, etc
  precoUnitario: decimal("precoUnitario", { precision: 10, scale: 2 }).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),
});

export type Insumo = typeof insumos.$inferSelect;
export type InsertInsumo = typeof insumos.$inferInsert;

/**
 * Estoque de Insumos
 */
export const estoqueInsumos = pgTable("estoqueInsumos", {
  id: serial("id").primaryKey(),
  insumoId: integer("insumoId").notNull(),
  quantidade: decimal("quantidade", { precision: 10, scale: 3 }).default("0").notNull(),
  quantidadeMinima: decimal("quantidadeMinima", { precision: 10, scale: 3 }).default("10").notNull(),
  ultimaAtualizacao: timestamp("ultimaAtualizacao").default(sql`now()`).notNull(),
});

export type EstoqueInsumo = typeof estoqueInsumos.$inferSelect;
export type InsertEstoqueInsumo = typeof estoqueInsumos.$inferInsert;

/**
 * Produtos - Itens do cardápio (Pratos/Bebidas)
 */
export const produtos = pgTable("produtos", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(), // Começa com 2000
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  categoria: varchar("categoria", { length: 100 }),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),
});

export type Produto = typeof produtos.$inferSelect;
export type InsertProduto = typeof produtos.$inferInsert;

/**
 * Ficha Técnica - Associa insumos aos produtos
 */
export const fichaTecnica = pgTable("fichaTecnica", {
  id: serial("id").primaryKey(),
  produtoId: integer("produtoId").notNull(),
  insumoId: integer("insumoId").notNull(),
  quantidade: decimal("quantidade", { precision: 10, scale: 3 }).notNull(), // Quantidade de insumo por prato
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),
});

export type FichaTecnica = typeof fichaTecnica.$inferSelect;
export type InsertFichaTecnica = typeof fichaTecnica.$inferInsert;

/**
 * Estoque - Controle de quantidade de produtos
 */
export const estoque = pgTable("estoque", {
  id: serial("id").primaryKey(),
  produtoId: integer("produtoId").notNull(),
  quantidade: integer("quantidade").default(0).notNull(),
  quantidadeMinima: integer("quantidadeMinima").default(10).notNull(),
  ultimaAtualizacao: timestamp("ultimaAtualizacao").default(sql`now()`).notNull(),
});

export type Estoque = typeof estoque.$inferSelect;
export type InsertEstoque = typeof estoque.$inferInsert;
