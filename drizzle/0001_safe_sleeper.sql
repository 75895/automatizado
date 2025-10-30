CREATE TABLE `comandas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`mesaId` int,
	`status` enum('aberta','fechada','cancelada') NOT NULL DEFAULT 'aberta',
	`totalItens` int NOT NULL DEFAULT 0,
	`totalValor` decimal(10,2) NOT NULL DEFAULT '0',
	`dataAbertura` timestamp NOT NULL DEFAULT (now()),
	`dataFechamento` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comandas_id` PRIMARY KEY(`id`),
	CONSTRAINT `comandas_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `estoque` (
	`id` int AUTO_INCREMENT NOT NULL,
	`produtoId` int NOT NULL,
	`quantidade` int NOT NULL DEFAULT 0,
	`quantidadeMinima` int NOT NULL DEFAULT 10,
	`ultimaAtualizacao` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `estoque_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itensComanda` (
	`id` int AUTO_INCREMENT NOT NULL,
	`comandaId` int NOT NULL,
	`produtoId` int NOT NULL,
	`quantidade` int NOT NULL,
	`precoUnitario` decimal(10,2) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`status` enum('pendente','preparando','pronto','servido') NOT NULL DEFAULT 'pendente',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `itensComanda_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mesas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` int NOT NULL,
	`capacidade` int NOT NULL DEFAULT 4,
	`status` enum('disponivel','ocupada','reservada') NOT NULL DEFAULT 'disponivel',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mesas_id` PRIMARY KEY(`id`),
	CONSTRAINT `mesas_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `movimentacoesEstoque` (
	`id` int AUTO_INCREMENT NOT NULL,
	`produtoId` int NOT NULL,
	`tipo` enum('entrada','saida','ajuste') NOT NULL,
	`quantidade` int NOT NULL,
	`motivo` text,
	`usuarioId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `movimentacoesEstoque_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `produtos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`preco` decimal(10,2) NOT NULL,
	`categoria` varchar(100),
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `produtos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numeroVenda` varchar(50) NOT NULL,
	`comandaId` int,
	`totalItens` int NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`desconto` decimal(10,2) NOT NULL DEFAULT '0',
	`totalVenda` decimal(10,2) NOT NULL,
	`formaPagamento` varchar(50),
	`status` enum('pendente','paga','cancelada') NOT NULL DEFAULT 'pendente',
	`dataVenda` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendas_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendas_numeroVenda_unique` UNIQUE(`numeroVenda`)
);
