import { Link } from 'react-router-dom';
import { Eye, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProdutoResumo {
  id: string;
  codigoInterno: string;
  nome: string;
  categoriaNome?: string;
  materialNome?: string;
  tipoProduto: string;
  precoVenda?: number;
  genero?: string;
  destaque?: boolean;
  ativo?: boolean;
  imagemPrincipalUrl?: string;
}

interface ProductCardProps {
  produto: ProdutoResumo;
}

export function ProductCard({ produto }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {produto.imagemPrincipalUrl ? (
          <img
            src={produto.imagemPrincipalUrl}
            alt={produto.nome}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-4xl">&#128142;</span>
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            to={`/catalogo/${produto.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm hover:bg-gold hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/catalogo/${produto.id}/editar`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm hover:bg-gold hover:text-white"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
        </div>
        {produto.destaque && (
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Destaque
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              to={`/catalogo/${produto.id}`}
              className="block truncate text-sm font-semibold text-foreground hover:text-gold"
            >
              {produto.nome}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {produto.materialNome ?? 'Sem material'}
            </p>
          </div>
          <Badge className={produto.ativo
            ? 'bg-success/10 text-success shrink-0 text-[10px]'
            : 'bg-danger/10 text-danger shrink-0 text-[10px]'
          }>
            {produto.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <p className="font-mono text-base font-bold text-foreground">
            {(produto.precoVenda ?? 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {produto.codigoInterno}
          </p>
        </div>
      </div>
    </div>
  );
}
