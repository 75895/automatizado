import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Mesas() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    capacidade: "4",
  });

  // Queries
  const { data: mesas = [], isLoading: mesasLoading, refetch: refetchMesas } = trpc.mesas.list.useQuery();

  // Mutations
  const criarMesaMutation = trpc.mesas.create.useMutation({
    onSuccess: () => {
      toast.success("Mesa criada com sucesso!");
      setFormData({ numero: "", capacidade: "4" });
      setIsOpen(false);
      refetchMesas();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const atualizarStatusMutation = trpc.mesas.atualizarStatus.useMutation({
    onSuccess: () => {
      toast.success("Status da mesa atualizado!");
      refetchMesas();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numero) {
      toast.error("Número da mesa é obrigatório!");
      return;
    }
    criarMesaMutation.mutate({
      numero: parseInt(formData.numero),
      capacidade: parseInt(formData.capacidade),
    });
  };

  const handleChangeStatus = (mesaId: number, novoStatus: "disponivel" | "ocupada" | "reservada") => {
    atualizarStatusMutation.mutate({
      id: mesaId,
      status: novoStatus,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel":
        return "bg-green-100 text-green-800";
      case "ocupada":
        return "bg-red-100 text-red-800";
      case "reservada":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "ocupada":
        return "Ocupada";
      case "reservada":
        return "Reservada";
      default:
        return status;
    }
  };

  const mesasDisponiveis = mesas.filter((m) => m.status === "disponivel").length;
  const mesasOcupadas = mesas.filter((m) => m.status === "ocupada").length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Mesas</h1>
            <p className="text-muted-foreground">
              Controle de mesas e ocupação do restaurante
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Mesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Mesa</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Número da Mesa *</label>
                  <Input
                    placeholder="Ex: 1"
                    type="number"
                    value={formData.numero}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Capacidade</label>
                  <Input
                    placeholder="Ex: 4"
                    type="number"
                    value={formData.capacidade}
                    onChange={(e) =>
                      setFormData({ ...formData, capacidade: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={criarMesaMutation.isPending}>
                  {criarMesaMutation.isPending ? "Criando..." : "Criar Mesa"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mesas.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mesasDisponiveis}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{mesasOcupadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Mesas Grid */}
        {mesasLoading ? (
          <div className="text-center py-12">Carregando mesas...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mesas.map((mesa) => (
              <Card key={mesa.id} className={`${getStatusColor(mesa.status)} border-2`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">Mesa {mesa.numero}</h3>
                      <p className="text-sm opacity-75">
                        <Users className="inline mr-1 h-4 w-4" />
                        Capacidade: {mesa.capacidade}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={mesa.status === "disponivel" ? "default" : "outline"}
                        onClick={() => handleChangeStatus(mesa.id, "disponivel")}
                        disabled={atualizarStatusMutation.isPending}
                      >
                        Disponível
                      </Button>
                      <Button
                        size="sm"
                        variant={mesa.status === "ocupada" ? "default" : "outline"}
                        onClick={() => handleChangeStatus(mesa.id, "ocupada")}
                        disabled={atualizarStatusMutation.isPending}
                      >
                        Ocupada
                      </Button>
                      <Button
                        size="sm"
                        variant={mesa.status === "reservada" ? "default" : "outline"}
                        onClick={() => handleChangeStatus(mesa.id, "reservada")}
                        disabled={atualizarStatusMutation.isPending}
                      >
                        Reservada
                      </Button>
                    </div>

                    <Badge className="w-full justify-center py-1">
                      {getStatusLabel(mesa.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
