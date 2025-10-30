import { eq, and, desc, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  produtos,
  estoque,
  mesas,
  comandas,
  itensComanda,
  vendas,
  movimentacoesEstoque,
  insumos,
  estoqueInsumos,
  fichaTecnica,
  Produto,
  Estoque,
  Mesa,
  Comanda,
  ItemComanda,
  Venda,
  Insumo,
  FichaTecnica,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// INSUMOS
// ============================================================================

export async function getProximoCodigoInsumo() {
  const db = await getDb();
  if (!db) return "1000";
  
  const resultado = await db
    .select()
    .from(insumos)
    .orderBy(desc(insumos.codigo))
    .limit(1);

  if (resultado.length === 0) return "1000";
  
  const ultimoCodigo = parseInt(resultado[0].codigo);
  return String(ultimoCodigo + 1);
}

export async function getInsumos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(insumos).where(eq(insumos.ativo, true));
}

export async function getInsumoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(insumos).where(eq(insumos.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getInsumoByCodigo(codigo: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(insumos).where(eq(insumos.codigo, codigo)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function criarInsumo(data: {
  codigo: string;
  nome: string;
  descricao?: string;
  unidade: string;
  precoUnitario: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Validar se nome está em maiúsculo
  if (data.nome !== data.nome.toUpperCase()) {
    throw new Error("Nome do insumo deve estar em MAIÚSCULO");
  }

  const result = await db.insert(insumos).values({
    codigo: data.codigo,
    nome: data.nome,
    descricao: data.descricao,
    unidade: data.unidade,
    precoUnitario: data.precoUnitario,
  });
  return result;
}

export async function atualizarInsumo(
  id: number,
  data: Partial<{
    nome: string;
    descricao: string;
    unidade: string;
    precoUnitario: string;
    ativo: boolean;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (data.nome && data.nome !== data.nome.toUpperCase()) {
    throw new Error("Nome do insumo deve estar em MAIÚSCULO");
  }

  return db.update(insumos).set(data).where(eq(insumos.id, id));
}

export async function getEstoqueInsumoByInsumoId(insumoId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(estoqueInsumos)
    .where(eq(estoqueInsumos.insumoId, insumoId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function atualizarEstoqueInsumo(insumoId: number, quantidade: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const estoqueAtual = await getEstoqueInsumoByInsumoId(insumoId);
  if (!estoqueAtual) {
    return db.insert(estoqueInsumos).values({
      insumoId,
      quantidade,
    });
  }

  return db
    .update(estoqueInsumos)
    .set({ quantidade })
    .where(eq(estoqueInsumos.insumoId, insumoId));
}

// ============================================================================
// FICHA TÉCNICA
// ============================================================================

export async function criarFichaTecnica(data: {
  produtoId: number;
  insumoId: number;
  quantidade: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(fichaTecnica).values(data);
}

export async function getFichaTecnicaByProdutoId(produtoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(fichaTecnica).where(eq(fichaTecnica.produtoId, produtoId));
}

export async function deletarFichaTecnica(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(fichaTecnica).where(eq(fichaTecnica.id, id));
}

export async function calcularCustoProduto(produtoId: number) {
  const db = await getDb();
  if (!db) return "0";

  const fichas = await getFichaTecnicaByProdutoId(produtoId);
  let custTotal = 0;

  for (const ficha of fichas) {
    const insumo = await getInsumoById(ficha.insumoId);
    if (insumo) {
      custTotal += parseFloat(insumo.precoUnitario) * parseFloat(ficha.quantidade);
    }
  }

  return custTotal.toFixed(2);
}

// ============================================================================
// PRODUTOS
// ============================================================================

export async function getProximoCodigoProduto() {
  const db = await getDb();
  if (!db) return "2000";
  
  const resultado = await db
    .select()
    .from(produtos)
    .orderBy(desc(produtos.codigo))
    .limit(1);

  if (resultado.length === 0) return "2000";
  
  const ultimoCodigo = parseInt(resultado[0].codigo);
  return String(ultimoCodigo + 1);
}

export async function getProdutos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(produtos).where(eq(produtos.ativo, true));
}

export async function getProdutoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(produtos).where(eq(produtos.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProdutoByCodigo(codigo: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(produtos).where(eq(produtos.codigo, codigo)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function criarProduto(data: {
  codigo: string;
  nome: string;
  descricao?: string;
  preco: string;
  categoria?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(produtos).values({
    codigo: data.codigo,
    nome: data.nome,
    descricao: data.descricao,
    preco: data.preco,
    categoria: data.categoria,
  });
  return result;
}

export async function atualizarProduto(
  id: number,
  data: Partial<{
    nome: string;
    descricao: string;
    preco: string;
    categoria: string;
    ativo: boolean;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(produtos).set(data).where(eq(produtos.id, id));
}

// ============================================================================
// ESTOQUE
// ============================================================================

export async function getEstoqueByProdutoId(produtoId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(estoque)
    .where(eq(estoque.produtoId, produtoId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getEstoque() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(estoque);
}

export async function atualizarEstoque(produtoId: number, quantidade: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const estoqueAtual = await getEstoqueByProdutoId(produtoId);
  if (!estoqueAtual) {
    return db.insert(estoque).values({
      produtoId,
      quantidade,
    });
  }

  return db
    .update(estoque)
    .set({ quantidade })
    .where(eq(estoque.produtoId, produtoId));
}

export async function registrarMovimentacaoEstoque(data: {
  produtoId: number;
  tipo: "entrada" | "saida" | "ajuste";
  quantidade: number;
  motivo?: string;
  usuarioId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(movimentacoesEstoque).values({
    produtoId: data.produtoId,
    tipo: data.tipo,
    quantidade: data.quantidade,
    motivo: data.motivo,
    usuarioId: data.usuarioId,
  });

  const estoqueAtual = await getEstoqueByProdutoId(data.produtoId);
  const novaQuantidade =
    data.tipo === "saida"
      ? (estoqueAtual?.quantidade || 0) - data.quantidade
      : (estoqueAtual?.quantidade || 0) + data.quantidade;

  await atualizarEstoque(data.produtoId, novaQuantidade);
}

// ============================================================================
// MESAS
// ============================================================================

export async function getMesas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mesas);
}

export async function getMesaById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(mesas).where(eq(mesas.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function criarMesa(data: { numero: number; capacidade: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(mesas).values(data);
}

export async function atualizarStatusMesa(id: number, status: "disponivel" | "ocupada" | "reservada") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(mesas).set({ status }).where(eq(mesas.id, id));
}

// ============================================================================
// COMANDAS
// ============================================================================

export async function getComandasAbertas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comandas).where(eq(comandas.status, "aberta"));
}

export async function getComandaById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(comandas).where(eq(comandas.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function criarComanda(data: { numero: string; mesaId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(comandas).values(data);
}

export async function adicionarItemComanda(data: {
  comandaId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subtotal = (
    parseFloat(data.precoUnitario) * data.quantidade
  ).toFixed(2);

  const result = await db.insert(itensComanda).values({
    comandaId: data.comandaId,
    produtoId: data.produtoId,
    quantidade: data.quantidade,
    precoUnitario: data.precoUnitario,
    subtotal,
  });

  await atualizarTotalComanda(data.comandaId);

  return result;
}

export async function atualizarTotalComanda(comandaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const itens = await db
    .select()
    .from(itensComanda)
    .where(eq(itensComanda.comandaId, comandaId));

  const totalItens = itens.length;
  const totalValor = itens
    .reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
    .toFixed(2);

  return db
    .update(comandas)
    .set({
      totalItens,
      totalValor,
    })
    .where(eq(comandas.id, comandaId));
}

export async function getItensComanda(comandaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(itensComanda).where(eq(itensComanda.comandaId, comandaId));
}

export async function fecharComanda(
  comandaId: number,
  formaPagamento: "dinheiro" | "debito" | "credito" | "pix"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const comanda = await getComandaById(comandaId);
  if (!comanda) throw new Error("Comanda not found");

  await db
    .update(comandas)
    .set({
      status: "fechada",
      dataFechamento: new Date(),
    })
    .where(eq(comandas.id, comandaId));

  if (comanda.mesaId) {
    await atualizarStatusMesa(comanda.mesaId, "disponivel");
  }

  const numeroVenda = `V-${Date.now()}`;
  const numeroNota = `NF-${Date.now()}`;
  
  await db.insert(vendas).values({
    numeroVenda,
    numeroNota,
    comandaId,
    totalItens: comanda.totalItens,
    subtotal: comanda.totalValor,
    desconto: "0",
    totalVenda: comanda.totalValor,
    formaPagamento,
    status: "paga",
  });

  return { numeroVenda, numeroNota };
}

// ============================================================================
// VENDAS
// ============================================================================

export async function getVendas(filtro?: { dataInicio?: Date; dataFim?: Date }): Promise<Venda[]> {
  const db = await getDb();
  if (!db) return [];

  if (filtro?.dataInicio || filtro?.dataFim) {
    const conditions = [];
    if (filtro.dataInicio) {
      conditions.push(gte(vendas.dataVenda, filtro.dataInicio));
    }
    if (filtro.dataFim) {
      conditions.push(lte(vendas.dataVenda, filtro.dataFim));
    }
    if (conditions.length > 0) {
      return await db
        .select()
        .from(vendas)
        .where(and(...conditions))
        .orderBy(desc(vendas.dataVenda));
    }
  }

  return await db.select().from(vendas).orderBy(desc(vendas.dataVenda));
}

export async function getRelatorioVendas(filtro?: { dataInicio?: Date; dataFim?: Date }) {
  const vendas_list: Venda[] = await getVendas(filtro);

  const totalVendas = vendas_list.length;
  const totalValor = vendas_list.reduce((sum, v) => sum + parseFloat(v.totalVenda), 0);
  const ticketMedio = totalVendas > 0 ? totalValor / totalVendas : 0;

  return {
    totalVendas,
    totalValor: totalValor.toFixed(2),
    ticketMedio: ticketMedio.toFixed(2),
    vendas: vendas_list,
  };
}
