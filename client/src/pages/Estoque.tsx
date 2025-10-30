import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Estoque() {
  const [isOpen, setIsOpen] = useState(false);
  const [proximoCodigo, setProximoCodigo] = useState("2000");
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
  });

  // Queries
  const { data: produtos = [], isLoading: produtosLoading, refetch: refetchProdutos } = trpc.produtos.list.useQuery();
  const { data: estoque = [] } = trpc.estoque.list.useQuery();
  const { data: proximoCodigoData } = trpc.produtos.proximoCodigo.useQuery();

  useEffect(() => {
    if (proximoCodigoData) {
      setProximoCodigo(proximoCodigoData);
      setFormData((prev) => ({ ...prev, codigo: proximoCodigoData }));
    }
  }, [proximoCodigoData]);

  // Mutations
  const criarProdutoMutation = trpc.produtos.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      setFormData({
        codigo: proximoCodigo,
        nome: "",
        descricao: "",
        preco: "",
        categoria: "",
      });
      setIsOpen(false);
      refetchProdutos();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }
    criarProdutoMutation.mutate(formData);
  };

  const getEstoqueInfo = (produtoId: number) => {
    const est = estoque.find((e) => e.produtoId === produtoId);
    return est || { quantidade: 0, quantidadeMinima: 10 };
  };

  const getStatusEstoque = (quantidade: number, minima: number) => {
    if (quantidade === 0) return { label: "Fora de estoque", variant: "destructive" };
    if (quantidade <= minima) return { label: "Baixo estoque", variant: "warning" };
    return { label: "Em estoque", variant: "default" };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Produtos</h1>
            <p className="text-muted-foreground">
              Controle de produtos e movimentações
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Código</label>
                  <Input
                    disabled
                    value={formData.codigo}
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Código automático (começa com 2000)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    placeholder="Ex: Hambúrguer"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    placeholder="Ex: Hambúrguer com queijo e alface"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Preço (R$) *</label>
                  <Input
                    placeholder="Ex: 25.50"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) =>
                      setFormData({ ...formData, preco: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Input
                    placeholder="Ex: Lanches"
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={criarProdutoMutation.isPending}>
                  {criarProdutoMutation.isPending ? "Criando..." : "Criar Produto"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alertas de Estoque Baixo */}
        <div className="grid gap-4">
          {produtos
            .filter((p) => {
              const est = getEstoqueInfo(p.id);
              return est.quantidade <= est.quantidadeMinima;
            })
            .slice(0, 3)
            .map((p) => {
              const est = getEstoqueInfo(p.id);
              return (
                <Card key={p.id} className="border-warning bg-warning/5">
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-warning" />
                      <div>
                        <p className="font-medium">{p.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {est.quantidade} (Mínimo: {est.quantidadeMinima})
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Tabela de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Total de {produtos.length} produtos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {produtosLoading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.map((produto) => {
                      const est = getEstoqueInfo(produto.id);
                      const status = getStatusEstoque(est.quantidade, est.quantidadeMinima);
                      return (
                        <TableRow key={produto.id}>
                          <TableCell className="font-mono font-bold text-blue-600">
                            {produto.codigo}
                          </TableCell>
                          <TableCell className="font-medium">{produto.nome}</TableCell>
                          <TableCell>{produto.categoria || "-"}</TableCell>
                          <TableCell>R$ {parseFloat(produto.preco).toFixed(2)}</TableCell>
                          <TableCell>{est.quantidade}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant as any}>
                              {status.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
