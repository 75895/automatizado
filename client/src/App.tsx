import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Insumos from "./pages/Insumos";
import FichaTecnica from "./pages/FichaTecnica";
import Produtos from "./pages/Produtos";
import PDV from "./pages/PDV";
import Mesas from "./pages/Mesas";
import Relatorios from "./pages/Relatorios";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/estoque"} component={Estoque} />
      <Route path={"/insumos"} component={Insumos} />
      <Route path={"/produtos"} component={Produtos} />
      <Route path={"/ficha-tecnica"} component={FichaTecnica} />
      <Route path={"/pdv"} component={PDV} />
      <Route path={"/mesas"} component={Mesas} />
      <Route path={"/relatorios"} component={Relatorios} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
