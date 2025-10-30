import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function FichaTecnica() {
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    insumoId: 0,
    quantidade: "",
  });

  // Queries
  const { data: produtos = [], isLoading: produtosLoading } = trpc.produtos.list.useQuery();
  const { data: insumos = [] } = trpc.insumos.list.useQuery();
  
  const { data: fichaTecnica = [], refetch: refetchFicha } = trpc.fichaTecnica.getByProdutoId.useQuery(
    { produtoId: produtoSelecionado || 0 },
    { enabled: !!produtoSelecionado }
  );

  const { data: custoProduto = "0" } = trpc.fichaTecnica.calcularCusto.useQuery(
    { produtoId: produtoSelecionado || 0 },
    { enabled: !!produtoSelecionado }
  );

  // Mutations
  const criarFichaMutation = trpc.fichaTecnica.create.useMutation({
    onSuccess: () => {
      toast.success("Insumo adicionado à ficha técnica!");
      setFormData({ insumoId: 0, quantidade: "" });
      setIsOpen(false);
      refetchFicha();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deletarFichaMutation = trpc.fichaTecnica.delete.useMutation({
    onSuccess: () => {
      toast.success("Insumo removido!");
      refetchFicha();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoSelecionado || !formData.insumoId || !formData.quantidade) {
      toast.error("Preencha todos os campos!");
      return;
    }

    criarFichaMutation.mutate({
      produtoId: produtoSelecionado,
      insumoId: formData.insumoId,
      quantidade: formData.quantidade,
    });
  };

  const produtoAtual = produtoSelecionado
    ? produtos.find((p) => p.id === produtoSelecionado)
    : null;

  const getInsumoNome = (insumoId: number) => {
    return insumos.find((i) => i.id === insumoId)?.nome || "Insumo";
  };

  const getInsumoUnidade = (insumoId: number) => {
    return insumos.find((i) => i.id === insumoId)?.unidade || "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ficha Técnica de Pratos</h1>
          <p className="text-muted-foreground">
            Associe insumos aos produtos e calcule custos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Produtos */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Produtos</h2>
            {produtosLoading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <div className="space-y-2">
                {produtos.map((produto) => (
                  <Card
                    key={produto.id}
                    className={`cursor-pointer transition ${
                      produtoSelecionado === produto.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => setProdutoSelecionado(produto.id)}
                  >
                    <CardContent className="pt-4">
                      <div>
                        <p className="font-mono text-sm text-blue-600 font-bold">
                          {produto.codigo}
                        </p>
                        <p className="font-semibold">{produto.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {parseFloat(produto.preco).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Ficha Técnica */}
          {produtoAtual ? (
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{produtoAtual.nome}</CardTitle>
                  <CardDescription>
                    Código: {produtoAtual.codigo}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Adicionar Insumo */}
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Insumo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Insumo à Ficha</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Insumo *</label>
                          <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.insumoId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                insumoId: parseInt(e.target.value),
                              })
                            }
                          >
                            <option value={0}>Selecione um insumo</option>
                            {insumos.map((insumo) => (
                              <option key={insumo.id} value={insumo.id}>
                                {insumo.nome} ({insumo.unidade})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Quantidade *</label>
                          <Input
                            placeholder="Ex: 0.5"
                            type="number"
                            step="0.01"
                            value={formData.quantidade}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                quantidade: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={criarFichaMutation.isPending}
                        >
                          {criarFichaMutation.isPending
                            ? "Adicionando..."
                            : "Adicionar"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Tabela de Insumos */}
                  {fichaTecnica.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Insumo</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Ação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fichaTecnica.map((ficha) => (
                            <TableRow key={ficha.id}>
                              <TableCell className="font-medium">
                                {getInsumoNome(ficha.insumoId)}
                              </TableCell>
                              <TableCell>
                                {ficha.quantidade} {getInsumoUnidade(ficha.insumoId)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    deletarFichaMutation.mutate({ id: ficha.id })
                                  }
                                  disabled={deletarFichaMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum insumo adicionado ainda
                    </div>
                  )}

                  {/* Custo */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Custo Total:</span>
                      <span className="text-lg font-bold text-red-600">
                        R$ {parseFloat(custoProduto || "0").toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Preço de Venda:</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {parseFloat(produtoAtual.preco).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
                      <span className="font-semibold">Margem de Lucro:</span>
                      <span className="text-lg font-bold text-blue-600">
                        R$ {(
                          parseFloat(produtoAtual.preco) -
                          parseFloat(custoProduto || "0")
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center">
              <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    Selecione um produto para visualizar sua ficha técnica
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
