import { useAuthStore } from '@/features/auth/stores/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const registro = useAuthStore((s) => s.registro);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    registro,
    isAdmin: user?.role === 'ADMIN',
    isVendedor: user?.role === 'VENDEDOR',
    isRepresentante: user?.role === 'REPRESENTANTE',
  };
}
