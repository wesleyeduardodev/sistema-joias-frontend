import { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, type Column } from '@/components/data-display/DataTable';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useInventario, useRegistrarAjuste } from '../hooks/useEstoque';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { EstoquePosicao, Localizacao } from '../types';

const localizacaoLabels: Record<string, string> = {
  COFRE: 'Cofre',
  VITRINE: 'Vitrine',
  REPRESENTANTE: 'Representante',
  TRANSITO: 'Em Transito',
  VENDIDO: 'Vendido',
  CONSIGNADO: 'Consignado',
};

export function EstoqueInventario() {
  const { data: inventario, isLoading } = useInventario();
  const registrarAjuste = useRegistrarAjuste();
  const [contagens, setContagens] = useState<Record<string, number>>({});

  function itemKey(item: EstoquePosicao) {
    return `${item.produtoId}-${item.localizacao}`;
  }

  function handleContagemChange(item: EstoquePosicao, value: string) {
    const key = itemKey(item);
    setContagens((prev) => ({
      ...prev,
      [key]: value === '' ? 0 : parseInt(value, 10),
    }));
  }

  async function handleAjuste(item: EstoquePosicao) {
    const key = itemKey(item);
    const contagem = contagens[key];
    if (contagem === undefined) return;

    try {
      await registrarAjuste.mutateAsync({
        produtoId: item.produtoId,
        quantidade: contagem,
        localizacao: item.localizacao as Localizacao,
        observacoes: 'Ajuste de inventario',
      });
      toast.success(`Ajuste registrado para ${item.produtoNome}`);
      setContagens((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch {
      toast.error('Erro ao registrar ajuste');
    }
  }

  const columns: Column<EstoquePosicao>[] = [
    {
      key: 'produtoNome',
      header: 'Produto',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.produtoNome}</p>
          <p className="text-xs text-muted-foreground">{item.produtoCodigoInterno}</p>
        </div>
      ),
    },
    {
      key: 'localizacao',
      header: 'Localizacao',
      render: (item) => localizacaoLabels[item.localizacao] || item.localizacao,
    },
    {
      key: 'saldo',
      header: 'Saldo Sistema',
      className: 'font-mono text-right',
      render: (item) => String(item.saldo),
    },
    {
      key: 'contagem',
      header: 'Contagem Fisica',
      className: 'w-32',
      render: (item) => (
        <Input
          type="number"
          min={0}
          value={contagens[itemKey(item)] ?? ''}
          onChange={(e) => handleContagemChange(item, e.target.value)}
          className="h-8 w-24 text-center font-mono"
          placeholder="-"
        />
      ),
    },
    {
      key: 'divergencia',
      header: 'Divergencia',
      className: 'text-right',
      render: (item) => {
        const key = itemKey(item);
        const contagem = contagens[key];
        if (contagem === undefined) return '-';
        const div = contagem - item.saldo;
        return (
          <span
            className={cn(
              'font-mono font-medium',
              div > 0 ? 'text-success' : div < 0 ? 'text-danger' : 'text-muted-foreground'
            )}
          >
            {div > 0 ? '+' : ''}{div}
          </span>
        );
      },
    },
    {
      key: 'acoes',
      header: '',
      className: 'w-24',
      render: (item) => {
        const hasContagem = contagens[itemKey(item)] !== undefined;
        return hasContagem ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAjuste(item)}
            disabled={registrarAjuste.isPending}
          >
            <ClipboardCheck className="mr-1 h-3 w-3" />
            Ajustar
          </Button>
        ) : null;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventario Fisico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare o saldo do sistema com a contagem fisica e registre ajustes
        </p>
      </div>

      <DataTable
        columns={columns}
        data={inventario ?? []}
        keyExtractor={(item) => itemKey(item)}
        emptyMessage="Nenhum item no inventario"
      />
    </div>
  );
}
