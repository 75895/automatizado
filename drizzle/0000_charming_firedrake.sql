CREATE TYPE "public"."comanda_status" AS ENUM('aberta', 'fechada', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('pendente', 'preparando', 'pronto', 'servido');--> statement-breakpoint
CREATE TYPE "public"."mesa_status" AS ENUM('disponivel', 'ocupada', 'reservada');--> statement-breakpoint
CREATE TYPE "public"."movimentacao_tipo" AS ENUM('entrada', 'saida', 'ajuste');--> statement-breakpoint
CREATE TYPE "public"."pagamento_forma" AS ENUM('dinheiro', 'debito', 'credito', 'pix');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."venda_status" AS ENUM('pendente', 'paga', 'cancelada');--> statement-breakpoint
CREATE TABLE "comandas" (
	"id" serial PRIMARY KEY NOT NULL,
	"numero" varchar(50) NOT NULL,
	"mesaId" integer,
	"status" "comanda_status" DEFAULT 'aberta' NOT NULL,
	"totalItens" integer DEFAULT 0 NOT NULL,
	"totalValor" numeric(10, 2) DEFAULT '0' NOT NULL,
	"dataAbertura" timestamp DEFAULT now() NOT NULL,
	"dataFechamento" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comandas_numero_unique" UNIQUE("numero")
);
--> statement-breakpoint
CREATE TABLE "estoque" (
	"id" serial PRIMARY KEY NOT NULL,
	"produtoId" integer NOT NULL,
	"quantidade" integer DEFAULT 0 NOT NULL,
	"quantidadeMinima" integer DEFAULT 10 NOT NULL,
	"ultimaAtualizacao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estoqueInsumos" (
	"id" serial PRIMARY KEY NOT NULL,
	"insumoId" integer NOT NULL,
	"quantidade" numeric(10, 3) DEFAULT '0' NOT NULL,
	"quantidadeMinima" numeric(10, 3) DEFAULT '10' NOT NULL,
	"ultimaAtualizacao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fichaTecnica" (
	"id" serial PRIMARY KEY NOT NULL,
	"produtoId" integer NOT NULL,
	"insumoId" integer NOT NULL,
	"quantidade" numeric(10, 3) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insumos" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(50) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"unidade" varchar(50) NOT NULL,
	"precoUnitario" numeric(10, 2) NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insumos_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "itensComanda" (
	"id" serial PRIMARY KEY NOT NULL,
	"comandaId" integer NOT NULL,
	"produtoId" integer NOT NULL,
	"quantidade" integer NOT NULL,
	"precoUnitario" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"status" "item_status" DEFAULT 'pendente' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mesas" (
	"id" serial PRIMARY KEY NOT NULL,
	"numero" integer NOT NULL,
	"capacidade" integer DEFAULT 4 NOT NULL,
	"status" "mesa_status" DEFAULT 'disponivel' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mesas_numero_unique" UNIQUE("numero")
);
--> statement-breakpoint
CREATE TABLE "movimentacoesEstoque" (
	"id" serial PRIMARY KEY NOT NULL,
	"produtoId" integer NOT NULL,
	"tipo" "movimentacao_tipo" NOT NULL,
	"quantidade" integer NOT NULL,
	"motivo" text,
	"usuarioId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(50) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"preco" numeric(10, 2) NOT NULL,
	"categoria" varchar(100),
	"ativo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "produtos_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "vendas" (
	"id" serial PRIMARY KEY NOT NULL,
	"numeroVenda" varchar(50) NOT NULL,
	"numeroNota" varchar(50),
	"comandaId" integer,
	"totalItens" integer NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"desconto" numeric(10, 2) DEFAULT '0' NOT NULL,
	"totalVenda" numeric(10, 2) NOT NULL,
	"formaPagamento" "pagamento_forma" NOT NULL,
	"status" "venda_status" DEFAULT 'pendente' NOT NULL,
	"dataVenda" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendas_numeroVenda_unique" UNIQUE("numeroVenda"),
	CONSTRAINT "vendas_numeroNota_unique" UNIQUE("numeroNota")
);
