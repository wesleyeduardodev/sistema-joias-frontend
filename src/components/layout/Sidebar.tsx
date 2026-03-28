import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
  Package,
  ShoppingCart,
  Truck,
  Users,
  UserPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/stores/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Gem, label: 'Catalogo', path: '/catalogo' },
  { icon: Package, label: 'Estoque', path: '/estoque' },
  { icon: ShoppingCart, label: 'Vendas', path: '/vendas' },
  { icon: Truck, label: 'Consignacao', path: '/consignacao' },
  { icon: Users, label: 'Representantes', path: '/representantes' },
  { icon: UserPlus, label: 'Clientes', path: '/clientes' },
  { icon: Settings, label: 'Configuracoes', path: '/configuracoes' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, onClose }: SidebarProps) {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-[#1A1A1A] text-white transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-5">
        <span
          className={cn(
            'font-bold tracking-[0.2em] text-gold transition-all duration-300',
            collapsed ? 'text-sm' : 'text-lg'
          )}
        >
          {collapsed ? 'JG' : 'JOIASGESTOR'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-l-2 border-gold bg-white/5 text-gold'
                  : 'border-l-2 border-transparent text-gray-400 hover:bg-white/5 hover:text-gold-light'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>

        <button
          onClick={onToggle}
          className="mt-2 flex w-full items-center justify-center rounded-md py-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
