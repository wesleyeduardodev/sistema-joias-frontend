import { Search, Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ROLE_LABELS } from '@/lib/constants';
import { Breadcrumb } from './Breadcrumb';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user);

  const initials = user?.nome
    ? user.nome
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      {/* Left: menu + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Breadcrumb />
      </div>

      {/* Center: search */}
      <div className="mx-4 hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos, clientes, vendas..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-foreground">
              {user?.nome ?? 'Usuario'}
            </p>
            <Badge variant="secondary" className="text-xs">
              {user?.role ? ROLE_LABELS[user.role] : 'Carregando...'}
            </Badge>
          </div>
          <Avatar className="h-9 w-9 border-2 border-gold/30">
            <AvatarFallback className="bg-gold/10 text-sm font-semibold text-gold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
