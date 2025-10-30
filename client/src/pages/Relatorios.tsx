import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Relatorios() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Queries
  const { data: relatorio, isLoading } = trpc.vendas.relatorio.useQuery({
    dataInicio: dataInicio ? new Date(dataInicio) : undefined,
    dataFim: dataFim ? new Date(dataFim) : undefined,
  });

  const { data: vendas = [] } = trpc.vendas.list.useQuery({
    dataInicio: dataInicio ? new Date(dataInicio) : undefined,
    dataFim: dataFim ? new Date(dataFim) : undefined,
  });

  const handleLimparFiltros = () => {
    setDataInicio("");
    setDataFim("");
  };

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Vendas</h1>
          <p className="text-muted-foreground">
            Análise de vendas e desempenho do restaurante
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Data Início</label>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Data Fim</label>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleLimparFiltros}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        {isLoading ? (
          <div className="text-center py-12">Carregando relatório...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{relatorio?.totalVendas || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Número de transações
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {relatorio?.totalValor || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor total arrecadado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {relatorio?.ticketMedio || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor médio por venda
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Vendas */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento de Vendas</CardTitle>
                <CardDescription>
                  Total de {vendas.length} vendas registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vendas.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma venda registrada no período
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Itens</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead>Desconto</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendas.map((venda) => (
                          <TableRow key={venda.id}>
                            <TableCell className="font-medium">
                              {venda.numeroVenda}
                            </TableCell>
                            <TableCell>
                              {formatarData(venda.dataVenda)}
                            </TableCell>
                            <TableCell>{venda.totalItens}</TableCell>
                            <TableCell>
                              R$ {parseFloat(venda.subtotal).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              R$ {parseFloat(venda.desconto).toFixed(2)}
                            </TableCell>
                            <TableCell className="font-bold">
                              R$ {parseFloat(venda.totalVenda).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-sm font-medium ${
                                  venda.status === "paga"
                                    ? "bg-green-100 text-green-800"
                                    : venda.status === "pendente"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {venda.status === "paga"
                                  ? "Paga"
                                  : venda.status === "pendente"
                                  ? "Pendente"
                                  : "Cancelada"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
