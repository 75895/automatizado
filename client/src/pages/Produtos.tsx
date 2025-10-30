import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Produtos() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
  });

  const { data: produtos = [], refetch } = trpc.produtos.list.useQuery();

  const { data: proximoCodigo } = trpc.produtos.proximoCodigo.useQuery();

  const criarMutation = trpc.produtos.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      setFormData({ nome: "", descricao: "", preco: "", categoria: "" });
      setIsOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const atualizarMutation = trpc.produtos.update.useMutation({
    onSuccess: () => {
      toast.success("Produto atualizado!");
      setFormData({ nome: "", descricao: "", preco: "", categoria: "" });
      setEditingId(null);
      setIsOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deletarMutation = trpc.produtos.update.useMutation({
    onSuccess: () => {
      toast.success("Produto deletado!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    if (editingId) {
      atualizarMutation.mutate({
        id: editingId,
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco,
        categoria: formData.categoria,
      });
    } else {
      criarMutation.mutate({
        codigo: proximoCodigo || "2000",
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco,
        categoria: formData.categoria,
      });
    }
  };

  const handleEdit = (produto: any) => {
    setEditingId(produto.id);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || "",
      preco: produto.preco,
      categoria: produto.categoria || "",
    });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({ nome: "", descricao: "", preco: "", categoria: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos do seu cardápio
          </p>
        </div>

        {/* Novo Produto */}
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  placeholder="Ex: Hambúrguer Clássico"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  placeholder="Ex: Pão, carne, queijo e alface"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preço *</label>
                <Input
                  placeholder="Ex: 25.90"
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
              <Button
                type="submit"
                className="w-full"
                disabled={criarMutation.isPending || atualizarMutation.isPending}
              >
                {editingId ? "Atualizar" : "Criar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tabela de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
            <CardDescription>
              Total: {produtos.length} produto{produtos.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {produtos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {produto.codigo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {produto.nome}
                        </TableCell>
                        <TableCell>{produto.categoria || "-"}</TableCell>
                        <TableCell>
                          R$ {parseFloat(produto.preco).toFixed(2)}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(produto)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              atualizarMutation.mutate({ id: produto.id, ativo: false })
                            }
                            disabled={atualizarMutation.isPending}
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
                Nenhum produto cadastrado ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
