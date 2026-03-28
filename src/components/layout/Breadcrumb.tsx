import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  catalogo: 'Catalogo',
  estoque: 'Estoque',
  vendas: 'Vendas',
  consignacao: 'Consignacao',
  representantes: 'Representantes',
  clientes: 'Clientes',
  configuracoes: 'Configuracoes',
  novo: 'Novo',
  editar: 'Editar',
};

export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <span className="text-sm font-medium text-foreground">Dashboard</span>
    );
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link to="/" className="text-muted-foreground hover:text-foreground">
        Dashboard
      </Link>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = routeLabels[segment] ?? segment;

        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                to={path}
                className="text-muted-foreground hover:text-foreground"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
