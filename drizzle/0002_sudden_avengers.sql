CREATE TABLE `estoqueInsumos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`insumoId` int NOT NULL,
	`quantidade` decimal(10,3) NOT NULL DEFAULT '0',
	`quantidadeMinima` decimal(10,3) NOT NULL DEFAULT '10',
	`ultimaAtualizacao` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `estoqueInsumos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fichaTecnica` (
	`id` int AUTO_INCREMENT NOT NULL,
	`produtoId` int NOT NULL,
	`insumoId` int NOT NULL,
	`quantidade` decimal(10,3) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fichaTecnica_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insumos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`unidade` varchar(50) NOT NULL,
	`precoUnitario` decimal(10,2) NOT NULL,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insumos_id` PRIMARY KEY(`id`),
	CONSTRAINT `insumos_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
ALTER TABLE `vendas` MODIFY COLUMN `formaPagamento` enum('dinheiro','debito','credito','pix') NOT NULL;--> statement-breakpoint
ALTER TABLE `produtos` ADD `codigo` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `vendas` ADD `numeroNota` varchar(50);--> statement-breakpoint
ALTER TABLE `produtos` ADD CONSTRAINT `produtos_codigo_unique` UNIQUE(`codigo`);--> statement-breakpoint
ALTER TABLE `vendas` ADD CONSTRAINT `vendas_numeroNota_unique` UNIQUE(`numeroNota`);