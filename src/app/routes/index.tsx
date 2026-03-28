import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/features/auth/pages/Login';
import { Registro } from '@/features/auth/pages/Registro';
import { RecuperarSenha } from '@/features/auth/pages/RecuperarSenha';
import { ResetSenha } from '@/features/auth/pages/ResetSenha';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';
import { PlaceholderPage } from '@/components/feedback/PlaceholderPage';

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
        <Route path="/catalogo" element={<PlaceholderPage />} />
        <Route path="/estoque" element={<PlaceholderPage />} />
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
