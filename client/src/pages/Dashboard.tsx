import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  AlertCircle,
  Clock,
  DollarSign,
  Utensils,
  ChefHat
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: relatorio } = trpc.vendas.relatorio.useQuery({});
  const { data: produtos = [] } = trpc.produtos.list.useQuery();
  const { data: mesas = [] } = trpc.mesas.list.useQuery();
  const { data: comandas = [] } = trpc.comandas.listAbertas.useQuery();
  const { data: estoque = [] } = trpc.estoque.list.useQuery();

  const mesasOcupadas = mesas.filter((m) => m.status === "ocupada").length;
  const produtosBaixoEstoque = estoque.filter((e) => e.quantidade <= e.quantidadeMinima).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo ao seu painel de controle
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de Vendas */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Faturamento Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {parseFloat(relatorio?.totalValor || "0").toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {relatorio?.totalVendas || 0} vendas realizadas
              </p>
            </CardContent>
          </Card>

          {/* Ticket Médio */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                Ticket Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {parseFloat(relatorio?.ticketMedio || "0").toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor médio por venda
              </p>
            </CardContent>
          </Card>

          {/* Mesas Ocupadas */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                Mesas Ocupadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mesasOcupadas}/{mesas.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mesas.length > 0 
                  ? `${Math.round((mesasOcupadas / mesas.length) * 100)}% de ocupação`
                  : "Nenhuma mesa"}
              </p>
            </CardContent>
          </Card>

          {/* Estoque Baixo */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{produtosBaixoEstoque}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Produtos para reabastecer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Ações Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Comandas Abertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Comandas Abertas
              </CardTitle>
              <CardDescription>
                {comandas.length} comanda{comandas.length !== 1 ? "s" : ""} em andamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {comandas.slice(0, 3).map((comanda) => (
                <div
                  key={comanda.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">Comanda #{comanda.numero}</p>
                    <p className="text-sm text-muted-foreground">
                      {comanda.totalItens} itens
                    </p>
                  </div>
                  <Badge variant="outline">
                    R$ {parseFloat(comanda.totalValor).toFixed(2)}
                  </Badge>
                </div>
              ))}
              {comandas.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma comanda aberta
                </p>
              )}
              <Button
                className="w-full mt-2"
                onClick={() => navigate("/pdv")}
                variant="outline"
              >
                Ir para PDV
              </Button>
            </CardContent>
          </Card>

          {/* Produtos em Falta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Produtos em Falta
              </CardTitle>
              <CardDescription>
                {produtosBaixoEstoque} produto{produtosBaixoEstoque !== 1 ? "s" : ""} com estoque baixo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {estoque
                .filter((e) => e.quantidade <= e.quantidadeMinima)
                .slice(0, 3)
                .map((e) => {
                  const produto = produtos.find((p) => p.id === e.produtoId);
                  return (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-sm">{produto?.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.quantidade} de {e.quantidadeMinima}
                        </p>
                      </div>
                      <Badge variant="destructive">Baixo</Badge>
                    </div>
                  );
                })}
              {produtosBaixoEstoque === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Todos os produtos em estoque
                </p>
              )}
              <Button
                className="w-full mt-2"
                onClick={() => navigate("/estoque")}
                variant="outline"
              >
                Ver Estoque
              </Button>
            </CardContent>
          </Card>

          {/* Atalhos Rápidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-purple-500" />
                Atalhos Rápidos
              </CardTitle>
              <CardDescription>
                Acesso rápido às principais funções
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => navigate("/pdv")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Novo Pedido
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => navigate("/insumos")}
              >
                <ChefHat className="mr-2 h-4 w-4" />
                Insumos
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => navigate("/ficha-tecnica")}
              >
                <Utensils className="mr-2 h-4 w-4" />
                Ficha Técnica
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => navigate("/relatorios")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
            <CardDescription>
              Estatísticas de hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="text-2xl font-bold text-green-600">
                  {relatorio?.totalVendas || 0}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {parseFloat(relatorio?.totalValor || "0").toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-sm text-muted-foreground">Produtos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {produtos.length}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <p className="text-sm text-muted-foreground">Mesas</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mesas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
