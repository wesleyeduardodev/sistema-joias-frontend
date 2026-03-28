import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/forms/SearchBar';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { ProductCard } from '../components/ProductCard';
import { FilterPanel } from '../components/FilterPanel';
import { useProdutos } from '../hooks/useProdutos';
import type { ProdutoFiltros } from '../types';

export function CatalogoListagem() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtros, setFiltros] = useState<ProdutoFiltros>({
    pagina: 1,
    porPagina: 12,
  });

  const { data, isLoading } = useProdutos(filtros);

  const produtos = data?.content ?? [];
  const totalElements = data?.page?.totalElements ?? 0;
  const totalPages = data?.page?.totalPages ?? 0;
  const currentPage = filtros.pagina ?? 1;

  const handleSearchChange = useCallback(
    (busca: string) => {
      setFiltros((prev) => ({ ...prev, busca: busca || undefined, pagina: 1 }));
    },
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catalogo de Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seu catalogo de joias
          </p>
        </div>
        <Link to="/catalogo/novo">
          <Button className="bg-gradient-to-r from-gold to-gold-light text-white shadow-md hover:shadow-lg">
            <Plus className="mr-1.5 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <SearchBar
        value={filtros.busca}
        onChange={handleSearchChange}
        placeholder="Buscar por nome, SKU, material..."
        className="w-full"
      />

      <FilterPanel filtros={filtros} onChange={setFiltros} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalElements} resultado{totalElements !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md p-1.5 ${
              viewMode === 'grid'
                ? 'bg-gold/10 text-gold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md p-1.5 ${
              viewMode === 'list'
                ? 'bg-gold/10 text-gold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : produtos.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Nenhum produto encontrado
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente ajustar seus filtros ou adicione um novo produto
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {produtos.map((produto) => (
            <Link
              key={produto.id}
              to={`/catalogo/${produto.id}`}
              className="flex items-center gap-4 rounded-lg border border-border bg-white p-4 transition-colors hover:border-gold/30"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                {produto.imagemPrincipalUrl ? (
                  <img
                    src={produto.imagemPrincipalUrl}
                    alt={produto.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">&#128142;</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{produto.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {produto.materialNome} &middot; SKU: {produto.codigoInterno}
                </p>
              </div>
              <p className="shrink-0 font-mono font-bold text-foreground">
                {(produto.precoVenda ?? 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setFiltros((p) => ({ ...p, pagina: (p.pagina ?? 1) - 1 }))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 2
            )
            .map((p, i, arr) => (
              <span key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <span className="px-1 text-muted-foreground">...</span>
                )}
                <button
                  onClick={() => setFiltros((f) => ({ ...f, pagina: p }))}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                    p === currentPage
                      ? 'bg-gold text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setFiltros((p) => ({ ...p, pagina: (p.pagina ?? 1) + 1 }))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
