import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/features/auth/pages/Login';
import { Registro } from '@/features/auth/pages/Registro';
import { RecuperarSenha } from '@/features/auth/pages/RecuperarSenha';
import { ResetSenha } from '@/features/auth/pages/ResetSenha';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';
import { PlaceholderPage } from '@/components/feedback/PlaceholderPage';

import { CatalogoListagem } from '@/features/catalogo/pages/CatalogoListagem';
import { CatalogoNovo } from '@/features/catalogo/pages/CatalogoNovo';
import { CatalogoDetalhes } from '@/features/catalogo/pages/CatalogoDetalhes';
import { CatalogoEditar } from '@/features/catalogo/pages/CatalogoEditar';

import { EstoqueVisaoGeral } from '@/features/estoque/pages/EstoqueVisaoGeral';
import { EstoqueMovimentacoes } from '@/features/estoque/pages/EstoqueMovimentacoes';
import { EstoqueInventario } from '@/features/estoque/pages/EstoqueInventario';

import { CotacoesConfig } from '@/features/cotacao/pages/CotacoesConfig';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/reset-senha/:token" element={<ResetSenha />} />

      {/* Protected routes */}
      <Route
        element={
          <AuthGuard>
            <AppShell />
          </AuthGuard>
        }
      >
        <Route path="/" element={<PlaceholderPage />} />

        {/* Catalogo */}
        <Route path="/catalogo" element={<CatalogoListagem />} />
        <Route path="/catalogo/novo" element={<CatalogoNovo />} />
        <Route path="/catalogo/:id" element={<CatalogoDetalhes />} />
        <Route path="/catalogo/:id/editar" element={<CatalogoEditar />} />

        {/* Estoque */}
        <Route path="/estoque" element={<EstoqueVisaoGeral />} />
        <Route path="/estoque/movimentacoes" element={<EstoqueMovimentacoes />} />
        <Route path="/estoque/inventario" element={<EstoqueInventario />} />

        {/* Configuracoes */}
        <Route path="/configuracoes/cotacoes" element={<CotacoesConfig />} />

        {/* Placeholder routes */}
        <Route path="/vendas" element={<PlaceholderPage />} />
        <Route path="/consignacao" element={<PlaceholderPage />} />
        <Route path="/representantes" element={<PlaceholderPage />} />
        <Route path="/clientes" element={<PlaceholderPage />} />
        <Route path="/configuracoes" element={<PlaceholderPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
