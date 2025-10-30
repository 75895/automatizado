import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Package, ShoppingCart, Table2, TrendingUp } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full space-y-8">
            {/* Logo */}
            <div className="text-center">
              {APP_LOGO && (
                <img
                  src={APP_LOGO}
                  alt={APP_TITLE}
                  className="h-16 w-16 mx-auto mb-4"
                />
              )}
              <h1 className="text-3xl font-bold text-white">{APP_TITLE}</h1>
              <p className="text-slate-400 mt-2">
                Sistema de Gestão de Restaurante Automatizado
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <Package className="h-5 w-5 text-blue-400" />
                <span>Gestão completa de estoque</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <ShoppingCart className="h-5 w-5 text-green-400" />
                <span>PDV integrado com mesas</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Table2 className="h-5 w-5 text-orange-400" />
                <span>Controle de mesas em tempo real</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span>Relatórios de vendas detalhados</span>
              </div>
            </div>

            {/* Login Button */}
            <div>
              <a href={getLoginUrl()}>
                <Button className="w-full h-12 text-base">
                  Entrar no Sistema
                </Button>
              </a>
            </div>

            {/* Footer */}
            <p className="text-center text-slate-500 text-sm">
              Powered by Manus
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            )}
            <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Bem-vindo, {user?.name || "Usuário"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Bem-vindo ao Sistema de Gestão
          </h2>
          <p className="text-xl text-muted-foreground">
            Gerencie seu restaurante de forma simples e eficiente
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate("/estoque")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Estoque
              </CardTitle>
              <CardDescription>
                Controle de produtos e quantidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Acessar</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate("/pdv")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                PDV
              </CardTitle>
              <CardDescription>
                Criar comandas e registrar vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Acessar</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate("/mesas")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="h-5 w-5" />
                Mesas
              </CardTitle>
              <CardDescription>
                Gerenciar mesas do restaurante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Acessar</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate("/relatorios")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Relatórios
              </CardTitle>
              <CardDescription>
                Análise de vendas e desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Acessar</Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>Powered by Manus - Sistema de Gestão Automatizado</p>
        </div>
      </div>
    </div>
  );
}
