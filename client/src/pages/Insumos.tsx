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

export default function Insumos() {
  const [isOpen, setIsOpen] = useState(false);
  const [proximoCodigo, setProximoCodigo] = useState("1000");
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    unidade: "kg",
    precoUnitario: "",
  });

  // Queries
  const { data: insumos = [], isLoading: insumosLoading, refetch: refetchInsumos } = trpc.insumos.list.useQuery();
  const { data: proximoCodigoData } = trpc.insumos.proximoCodigo.useQuery();

  useEffect(() => {
    if (proximoCodigoData) {
      setProximoCodigo(proximoCodigoData);
      setFormData((prev) => ({ ...prev, codigo: proximoCodigoData }));
    }
  }, [proximoCodigoData]);

  // Mutations
  const criarInsumoMutation = trpc.insumos.create.useMutation({
    onSuccess: () => {
      toast.success("Insumo criado com sucesso!");
      setFormData({
        codigo: proximoCodigo,
        nome: "",
        descricao: "",
        unidade: "kg",
        precoUnitario: "",
      });
      setIsOpen(false);
      refetchInsumos();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar se nome está em maiúsculo
    if (formData.nome !== formData.nome.toUpperCase()) {
      toast.error("Nome do insumo deve estar em MAIÚSCULO!");
      return;
    }

    if (!formData.nome || !formData.unidade || !formData.precoUnitario) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    criarInsumoMutation.mutate(formData);
  };

  const handleNomeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nome: value.toUpperCase(),
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Insumos</h1>
            <p className="text-muted-foreground">
              Controle de ingredientes e matérias-primas
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Insumo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Insumo</DialogTitle>
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
                    Código automático (começa com 1000)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Nome (MAIÚSCULO) *</label>
                  <Input
                    placeholder="Ex: TOMATE"
                    value={formData.nome}
                    onChange={(e) => handleNomeChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Será convertido automaticamente para MAIÚSCULO
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    placeholder="Ex: Tomate fresco"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Unidade *</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.unidade}
                      onChange={(e) =>
                        setFormData({ ...formData, unidade: e.target.value })
                      }
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="un">un</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preço Unitário (R$) *</label>
                    <Input
                      placeholder="Ex: 5.50"
                      type="number"
                      step="0.01"
                      value={formData.precoUnitario}
                      onChange={(e) =>
                        setFormData({ ...formData, precoUnitario: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={criarInsumoMutation.isPending}>
                  {criarInsumoMutation.isPending ? "Criando..." : "Criar Insumo"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de Insumos */}
        <Card>
          <CardHeader>
            <CardTitle>Insumos Cadastrados</CardTitle>
            <CardDescription>
              Total de {insumos.length} insumos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {insumosLoading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Preço Unitário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insumos.map((insumo) => (
                      <TableRow key={insumo.id}>
                        <TableCell className="font-mono font-bold text-blue-600">
                          {insumo.codigo}
                        </TableCell>
                        <TableCell className="font-medium">{insumo.nome}</TableCell>
                        <TableCell>{insumo.descricao || "-"}</TableCell>
                        <TableCell>{insumo.unidade}</TableCell>
                        <TableCell>R$ {parseFloat(insumo.precoUnitario).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
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
