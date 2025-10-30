import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Insumos - Ingredientes e matérias-primas
 */
export const insumos = mysqlTable("insumos", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(), // Começa com 1000
  nome: varchar("nome", { length: 255 }).notNull(), // Obrigatoriamente em MAIÚSCULO
  descricao: text("descricao"),
  unidade: varchar("unidade", { length: 50 }).notNull(), // kg, L, unidade, etc
  precoUnitario: decimal("precoUnitario", { precision: 10, scale: 2 }).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Insumo = typeof insumos.$inferSelect;
export type InsertInsumo = typeof insumos.$inferInsert;

/**
 * Estoque de Insumos
 */
export const estoqueInsumos = mysqlTable("estoqueInsumos", {
  id: int("id").autoincrement().primaryKey(),
  insumoId: int("insumoId").notNull(),
  quantidade: decimal("quantidade", { precision: 10, scale: 3 }).default("0").notNull(),
  quantidadeMinima: decimal("quantidadeMinima", { precision: 10, scale: 3 }).default("10").notNull(),
  ultimaAtualizacao: timestamp("ultimaAtualizacao").defaultNow().onUpdateNow().notNull(),
});

export type EstoqueInsumo = typeof estoqueInsumos.$inferSelect;
export type InsertEstoqueInsumo = typeof estoqueInsumos.$inferInsert;

/**
 * Produtos - Itens do cardápio (Pratos/Bebidas)
 */
export const produtos = mysqlTable("produtos", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(), // Começa com 2000
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  categoria: varchar("categoria", { length: 100 }),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Produto = typeof produtos.$inferSelect;
export type InsertProduto = typeof produtos.$inferInsert;

/**
 * Ficha Técnica - Associa insumos aos produtos
 */
export const fichaTecnica = mysqlTable("fichaTecnica", {
  id: int("id").autoincrement().primaryKey(),
  produtoId: int("produtoId").notNull(),
  insumoId: int("insumoId").notNull(),
  quantidade: decimal("quantidade", { precision: 10, scale: 3 }).notNull(), // Quantidade de insumo por prato
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FichaTecnica = typeof fichaTecnica.$inferSelect;
export type InsertFichaTecnica = typeof fichaTecnica.$inferInsert;

/**
 * Estoque - Controle de quantidade de produtos
 */
export const estoque = mysqlTable("estoque", {
  id: int("id").autoincrement().primaryKey(),
  produtoId: int("produtoId").notNull(),
  quantidade: int("quantidade").default(0).notNull(),
  quantidadeMinima: int("quantidadeMinima").default(10).notNull(),
  ultimaAtualizacao: timestamp("ultimaAtualizacao").defaultNow().onUpdateNow().notNull(),
});

export type Estoque = typeof estoque.$inferSelect;
export type InsertEstoque = typeof estoque.$inferInsert;

/**
 * Mesas - Mesas do restaurante
 */
export const mesas = mysqlTable("mesas", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull().unique(),
  capacidade: int("capacidade").default(4).notNull(),
  status: mysqlEnum("status", ["disponivel", "ocupada", "reservada"]).default("disponivel").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Mesa = typeof mesas.$inferSelect;
export type InsertMesa = typeof mesas.$inferInsert;

/**
 * Comandas - Pedidos dos clientes
 */
export const comandas = mysqlTable("comandas", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  mesaId: int("mesaId"),
  status: mysqlEnum("status", ["aberta", "fechada", "cancelada"]).default("aberta").notNull(),
  totalItens: int("totalItens").default(0).notNull(),
  totalValor: decimal("totalValor", { precision: 10, scale: 2 }).default("0").notNull(),
  dataAbertura: timestamp("dataAbertura").defaultNow().notNull(),
  dataFechamento: timestamp("dataFechamento"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comanda = typeof comandas.$inferSelect;
export type InsertComanda = typeof comandas.$inferInsert;

/**
 * ItensComanda - Itens dentro de uma comanda
 */
export const itensComanda = mysqlTable("itensComanda", {
  id: int("id").autoincrement().primaryKey(),
  comandaId: int("comandaId").notNull(),
  produtoId: int("produtoId").notNull(),
  quantidade: int("quantidade").notNull(),
  precoUnitario: decimal("precoUnitario", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pendente", "preparando", "pronto", "servido"]).default("pendente").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ItemComanda = typeof itensComanda.$inferSelect;
export type InsertItemComanda = typeof itensComanda.$inferInsert;

/**
 * Vendas - Registro de vendas finalizadas
 */
export const vendas = mysqlTable("vendas", {
  id: int("id").autoincrement().primaryKey(),
  numeroVenda: varchar("numeroVenda", { length: 50 }).notNull().unique(),
  numeroNota: varchar("numeroNota", { length: 50 }).unique(), // Número da nota fiscal
  comandaId: int("comandaId"),
  totalItens: int("totalItens").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0").notNull(),
  totalVenda: decimal("totalVenda", { precision: 10, scale: 2 }).notNull(),
  formaPagamento: mysqlEnum("formaPagamento", ["dinheiro", "debito", "credito", "pix"]).notNull(),
  status: mysqlEnum("status", ["pendente", "paga", "cancelada"]).default("pendente").notNull(),
  dataVenda: timestamp("dataVenda").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Venda = typeof vendas.$inferSelect;
export type InsertVenda = typeof vendas.$inferInsert;

/**
 * MovimentacoesEstoque - Histórico de movimentações de estoque
 */
export const movimentacoesEstoque = mysqlTable("movimentacoesEstoque", {
  id: int("id").autoincrement().primaryKey(),
  produtoId: int("produtoId").notNull(),
  tipo: mysqlEnum("tipo", ["entrada", "saida", "ajuste"]).notNull(),
  quantidade: int("quantidade").notNull(),
  motivo: text("motivo"),
  usuarioId: int("usuarioId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MovimentacaoEstoque = typeof movimentacoesEstoque.$inferSelect;
export type InsertMovimentacaoEstoque = typeof movimentacoesEstoque.$inferInsert;
