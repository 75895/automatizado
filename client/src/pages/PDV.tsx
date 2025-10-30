import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Check, Printer } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PDV() {
  const [comandaSelecionada, setComandaSelecionada] = useState<number | null>(null);
  const [isNovaComanda, setIsNovaComanda] = useState(false);
  const [numeroComanda, setNumeroComanda] = useState("");
  const [mesaId, setMesaId] = useState<number | undefined>();
  const [itemForm, setItemForm] = useState({
    produtoId: 0,
    quantidade: 1,
  });
  const [formaPagamento, setFormaPagamento] = useState<"dinheiro" | "debito" | "credito" | "pix">("dinheiro");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Queries
  const { data: comandas = [], refetch: refetchComandas } = trpc.comandas.listAbertas.useQuery();
  const { data: produtos = [] } = trpc.produtos.list.useQuery();
  const { data: mesas = [] } = trpc.mesas.list.useQuery();

  const comandaAtual = comandaSelecionada
    ? comandas.find((c) => c.id === comandaSelecionada)
    : null;

  const { data: itensComanda = [] } = trpc.comandas.getItens.useQuery(
    { comandaId: comandaSelecionada || 0 },
    { enabled: !!comandaSelecionada }
  );

  // Mutations
  const criarComandaMutation = trpc.comandas.create.useMutation({
    onSuccess: (result: any) => {
      toast.success("Comanda criada com sucesso!");
      setNumeroComanda("");
      setMesaId(undefined);
      setIsNovaComanda(false);
      refetchComandas();
      setComandaSelecionada(result.insertId || result.id);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const adicionarItemMutation = trpc.comandas.adicionarItem.useMutation({
    onSuccess: () => {
      toast.success("Item adicionado!");
      setItemForm({ produtoId: 0, quantidade: 1 });
      refetchComandas();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const fecharComandaMutation = trpc.comandas.fechar.useMutation({
    onSuccess: (result: any) => {
      toast.success("Comanda fechada com sucesso!");
      setComandaSelecionada(null);
      setShowPaymentDialog(false);
      refetchComandas();
      
      // Imprimir nota fiscal automaticamente
      setTimeout(() => {
        imprimirNotaFiscal(result.numeroNota, comandaAtual);
      }, 500);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleNovaComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroComanda) {
      toast.error("Número da comanda é obrigatório!");
      return;
    }
    criarComandaMutation.mutate({
      numero: numeroComanda,
      mesaId,
    });
  };

  const handleAdicionarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comandaSelecionada || !itemForm.produtoId) {
      toast.error("Selecione um produto!");
      return;
    }

    const produto = produtos.find((p) => p.id === itemForm.produtoId);
    if (!produto) return;

    adicionarItemMutation.mutate({
      comandaId: comandaSelecionada,
      produtoId: itemForm.produtoId,
      quantidade: itemForm.quantidade,
      precoUnitario: produto.preco,
    });
  };

  const handleFecharComanda = () => {
    if (!comandaSelecionada) return;
    fecharComandaMutation.mutate({
      comandaId: comandaSelecionada,
      formaPagamento,
    });
  };

  const imprimirNotaFiscal = (numeroNota: string, comanda: any) => {
    const conteudo = `
      ========================================
      NOTA FISCAL ELETRÔNICA
      ========================================
      
      Número: ${numeroNota}
      Comanda: ${comanda?.numero || "N/A"}
      Data: ${new Date().toLocaleString("pt-BR")}
      
      ----------------------------------------
      ITENS:
      ----------------------------------------
      ${itensComanda
        .map((item) => {
          const produto = produtos.find((p) => p.id === item.produtoId);
          return `${produto?.nome || "Produto"} x${item.quantidade}
      R$ ${parseFloat(item.precoUnitario).toFixed(2)} = R$ ${parseFloat(item.subtotal).toFixed(2)}`;
        })
        .join("\n")}
      
      ----------------------------------------
      SUBTOTAL:        R$ ${parseFloat(comanda?.totalValor || "0").toFixed(2)}
      DESCONTO:        R$ 0.00
      ----------------------------------------
      TOTAL:           R$ ${parseFloat(comanda?.totalValor || "0").toFixed(2)}
      
      Forma de Pagamento: ${formaPagamento.toUpperCase()}
      
      ========================================
      Obrigado pela compra!
      ========================================
    `;

    const janelaImpressao = window.open("", "", "width=400,height=600");
    if (janelaImpressao) {
      janelaImpressao.document.write(`
        <html>
          <head>
            <title>Nota Fiscal</title>
            <style>
              body { font-family: monospace; font-size: 12px; margin: 0; padding: 10px; }
              pre { margin: 0; }
            </style>
          </head>
          <body>
            <pre>${conteudo}</pre>
            <script>
              window.print();
              window.onafterprint = function() { window.close(); };
            </script>
          </body>
        </html>
      `);
      janelaImpressao.document.close();
    }
  };

  const totalComanda = comandaAtual?.totalValor || "0";

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comandas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Comandas Abertas</h2>
            <Dialog open={isNovaComanda} onOpenChange={setIsNovaComanda}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Comanda</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleNovaComanda} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Número da Comanda *</label>
                    <Input
                      placeholder="Ex: 001"
                      value={numeroComanda}
                      onChange={(e) => setNumeroComanda(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mesa</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={mesaId || ""}
                      onChange={(e) => setMesaId(e.target.value ? parseInt(e.target.value) : undefined)}
                    >
                      <option value="">Sem mesa</option>
                      {mesas.map((mesa) => (
                        <option key={mesa.id} value={mesa.id}>
                          Mesa {mesa.numero} ({mesa.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full" disabled={criarComandaMutation.isPending}>
                    {criarComandaMutation.isPending ? "Criando..." : "Criar Comanda"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {comandas.map((comanda) => (
              <Card
                key={comanda.id}
                className={`cursor-pointer transition ${
                  comandaSelecionada === comanda.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setComandaSelecionada(comanda.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Comanda #{comanda.numero}</p>
                      <p className="text-sm text-muted-foreground">
                        {comanda.totalItens} itens
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {parseFloat(comanda.totalValor).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detalhes da Comanda */}
        {comandaAtual ? (
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comanda #{comandaAtual.numero}</CardTitle>
                <CardDescription>
                  {comandaAtual.totalItens} itens | Total: R$ {parseFloat(totalComanda).toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Adicionar Item */}
                <form onSubmit={handleAdicionarItem} className="space-y-3 border-b pb-4">
                  <div>
                    <label className="text-sm font-medium">Produto</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={itemForm.produtoId}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, produtoId: parseInt(e.target.value) })
                      }
                    >
                      <option value={0}>Selecione um produto</option>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} - R$ {parseFloat(p.preco).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={itemForm.quantidade}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          quantidade: parseInt(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <Button type="submit" disabled={adicionarItemMutation.isPending}>
                      Adicionar
                    </Button>
                  </div>
                </form>

                {/* Itens da Comanda */}
                <div className="space-y-2">
                  {itensComanda.map((item) => {
                    const produto = produtos.find((p) => p.id === item.produtoId);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div>
                          <p className="font-medium">{produto?.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantidade}x R$ {parseFloat(item.precoUnitario).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          R$ {parseFloat(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      R$ {parseFloat(totalComanda).toFixed(2)}
                    </span>
                  </div>

                  <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={fecharComandaMutation.isPending}>
                        <Check className="mr-2 h-4 w-4" />
                        Fechar Comanda
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Selecione a Forma de Pagamento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Button
                          variant={formaPagamento === "dinheiro" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setFormaPagamento("dinheiro")}
                        >
                          💵 Dinheiro
                        </Button>
                        <Button
                          variant={formaPagamento === "debito" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setFormaPagamento("debito")}
                        >
                          💳 Débito
                        </Button>
                        <Button
                          variant={formaPagamento === "credito" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setFormaPagamento("credito")}
                        >
                          💳 Crédito
                        </Button>
                        <Button
                          variant={formaPagamento === "pix" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setFormaPagamento("pix")}
                        >
                          📱 PIX
                        </Button>
                        <Button
                          className="w-full mt-4"
                          onClick={handleFecharComanda}
                          disabled={fecharComandaMutation.isPending}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          {fecharComandaMutation.isPending ? "Processando..." : "Confirmar e Imprimir"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center">
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  Selecione uma comanda ou crie uma nova
                </p>
                <Button onClick={() => setIsNovaComanda(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Comanda
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
