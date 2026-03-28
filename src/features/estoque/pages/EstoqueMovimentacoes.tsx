import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { MovimentacaoForm } from '../components/MovimentacaoForm';
import { usePosicaoEstoque } from '../hooks/useEstoque';

const localizacaoLabels: Record<string, string> = {
  COFRE: 'Cofre',
  VITRINE: 'Vitrine',
  REPRESENTANTE: 'Representante',
  TRANSITO: 'Em Transito',
  VENDIDO: 'Vendido',
  CONSIGNADO: 'Consignado',
};

export function EstoqueMovimentacoes() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: posicoes, isLoading } = usePosicaoEstoque();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movimentacoes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registre entradas, saidas e transferencias de estoque
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-gold to-gold-light text-white shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nova Movimentacao
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Codigo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Material</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Localizacao</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {(posicoes ?? []).map((p) => (
                <tr key={`${p.produtoId}-${p.localizacao}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{p.produtoNome}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.produtoCodigoInterno}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.categoriaNome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.materialNome}</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-gold/10 text-gold">
                      {localizacaoLabels[p.localizacao] || p.localizacao}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">{p.saldo}</td>
                </tr>
              ))}
              {(!posicoes || posicoes.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <MovimentacaoForm open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
