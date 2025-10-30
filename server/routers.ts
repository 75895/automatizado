import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // INSUMOS
  // ============================================================================
  insumos: router({
    list: publicProcedure.query(async () => {
      return await db.getInsumos();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getInsumoById(input.id);
      }),

    proximoCodigo: publicProcedure.query(async () => {
      return await db.getProximoCodigoInsumo();
    }),

    create: protectedProcedure
      .input(
        z.object({
          codigo: z.string(),
          nome: z.string().min(1),
          descricao: z.string().optional(),
          unidade: z.string(),
          precoUnitario: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.criarInsumo(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().optional(),
          descricao: z.string().optional(),
          unidade: z.string().optional(),
          precoUnitario: z.string().optional(),
          ativo: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.atualizarInsumo(id, data);
      }),

    estoqueByInsumoId: publicProcedure
      .input(z.object({ insumoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEstoqueInsumoByInsumoId(input.insumoId);
      }),

    atualizarEstoque: protectedProcedure
      .input(
        z.object({
          insumoId: z.number(),
          quantidade: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.atualizarEstoqueInsumo(input.insumoId, input.quantidade);
      }),
  }),

  // ============================================================================
  // FICHA TÉCNICA
  // ============================================================================
  fichaTecnica: router({
    getByProdutoId: publicProcedure
      .input(z.object({ produtoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFichaTecnicaByProdutoId(input.produtoId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          produtoId: z.number(),
          insumoId: z.number(),
          quantidade: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.criarFichaTecnica(input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deletarFichaTecnica(input.id);
      }),

    calcularCusto: publicProcedure
      .input(z.object({ produtoId: z.number() }))
      .query(async ({ input }) => {
        return await db.calcularCustoProduto(input.produtoId);
      }),
  }),

  // ============================================================================
  // PRODUTOS
  // ============================================================================
  produtos: router({
    list: publicProcedure.query(async () => {
      return await db.getProdutos();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProdutoById(input.id);
      }),

    proximoCodigo: publicProcedure.query(async () => {
      return await db.getProximoCodigoProduto();
    }),

    create: protectedProcedure
      .input(
        z.object({
          codigo: z.string(),
          nome: z.string().min(1),
          descricao: z.string().optional(),
          preco: z.string(),
          categoria: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.criarProduto(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().optional(),
          descricao: z.string().optional(),
          preco: z.string().optional(),
          categoria: z.string().optional(),
          ativo: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.atualizarProduto(id, data);
      }),
  }),

  // ============================================================================
  // ESTOQUE
  // ============================================================================
  estoque: router({
    list: publicProcedure.query(async () => {
      return await db.getEstoque();
    }),

    getByProdutoId: publicProcedure
      .input(z.object({ produtoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEstoqueByProdutoId(input.produtoId);
      }),

    atualizar: protectedProcedure
      .input(
        z.object({
          produtoId: z.number(),
          quantidade: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.atualizarEstoque(input.produtoId, input.quantidade);
      }),

    registrarMovimentacao: protectedProcedure
      .input(
        z.object({
          produtoId: z.number(),
          tipo: z.enum(["entrada", "saida", "ajuste"]),
          quantidade: z.number(),
          motivo: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await db.registrarMovimentacaoEstoque({
          ...input,
          usuarioId: ctx.user?.id,
        });
      }),
  }),

  // ============================================================================
  // MESAS
  // ============================================================================
  mesas: router({
    list: publicProcedure.query(async () => {
      return await db.getMesas();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMesaById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          numero: z.number(),
          capacidade: z.number().default(4),
        })
      )
      .mutation(async ({ input }) => {
        return await db.criarMesa(input);
      }),

    atualizarStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["disponivel", "ocupada", "reservada"]),
        })
      )
      .mutation(async ({ input }) => {
        return await db.atualizarStatusMesa(input.id, input.status);
      }),
  }),

  // ============================================================================
  // COMANDAS (PDV)
  // ============================================================================
  comandas: router({
    listAbertas: publicProcedure.query(async () => {
      return await db.getComandasAbertas();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getComandaById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          numero: z.string(),
          mesaId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.criarComanda(input);
      }),

    adicionarItem: protectedProcedure
      .input(
        z.object({
          comandaId: z.number(),
          produtoId: z.number(),
          quantidade: z.number(),
          precoUnitario: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.adicionarItemComanda(input);
      }),

    getItens: publicProcedure
      .input(z.object({ comandaId: z.number() }))
      .query(async ({ input }) => {
        return await db.getItensComanda(input.comandaId);
      }),

    fechar: protectedProcedure
      .input(
        z.object({
          comandaId: z.number(),
          formaPagamento: z.enum(["dinheiro", "debito", "credito", "pix"]),
        })
      )
      .mutation(async ({ input }) => {
        return await db.fecharComanda(input.comandaId, input.formaPagamento);
      }),
  }),

  // ============================================================================
  // VENDAS
  // ============================================================================
  vendas: router({
    list: publicProcedure
      .input(
        z.object({
          dataInicio: z.date().optional(),
          dataFim: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        return await db.getVendas(input);
      }),

    relatorio: publicProcedure
      .input(
        z.object({
          dataInicio: z.date().optional(),
          dataFim: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        return await db.getRelatorioVendas(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
