import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/catalogo': 'Catalogo',
  '/estoque': 'Estoque',
  '/vendas': 'Vendas',
  '/consignacao': 'Consignacao',
  '/representantes': 'Representantes',
  '/clientes': 'Clientes',
  '/configuracoes': 'Configuracoes',
};

export function PlaceholderPage() {
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? 'Pagina';

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
        <Construction className="h-10 w-10 text-gold" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        Em construcao &mdash; Fase 2
      </p>
    </div>
  );
}
