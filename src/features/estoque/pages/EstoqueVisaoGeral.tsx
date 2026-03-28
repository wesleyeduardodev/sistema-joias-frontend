import { Link } from 'react-router-dom';
import { Package, Lock, Eye, Truck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/data-display/StatCard';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { useEstoqueResumo, useEstoqueAlertas } from '../hooks/useEstoque';

const localizacaoLabels: Record<string, string> = {
  COFRE: 'Cofre',
  VITRINE: 'Vitrine',
  REPRESENTANTE: 'Representante',
  TRANSITO: 'Em Transito',
  VENDIDO: 'Vendido',
  CONSIGNADO: 'Consignado',
};

export function EstoqueVisaoGeral() {
  const { data: resumo, isLoading } = useEstoqueResumo();
  const { data: alertas } = useEstoqueAlertas();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const cofreQtd = resumo?.porLocalizacao?.find((l) => l.localizacao === 'COFRE')?.quantidade ?? 0;
  const vitrineQtd = resumo?.porLocalizacao?.find((l) => l.localizacao === 'VITRINE')?.quantidade ?? 0;
  const consignadoQtd = resumo?.porLocalizacao?.find((l) => l.localizacao === 'CONSIGNADO')?.quantidade ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estoque</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visao geral do inventario e movimentacoes
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/estoque/movimentacoes">
            <Button variant="outline">Movimentacoes</Button>
          </Link>
          <Link to="/estoque/inventario">
            <Button variant="outline">Inventario</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Pecas"
          value={resumo?.totalPecas?.toLocaleString('pt-BR') ?? '0'}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="No Cofre"
          value={cofreQtd.toLocaleString('pt-BR')}
          icon={<Lock className="h-5 w-5" />}
        />
        <StatCard
          title="Na Vitrine"
          value={vitrineQtd.toLocaleString('pt-BR')}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          title="Consignado"
          value={consignadoQtd.toLocaleString('pt-BR')}
          icon={<Truck className="h-5 w-5" />}
        />
      </div>

      {alertas && alertas.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">
              Alertas de Estoque
            </h3>
          </div>
          <div className="space-y-2">
            {alertas.map((alerta) => (
              <div
                key={alerta.produtoId}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{alerta.produtoNome}</p>
                  <p className="text-xs text-muted-foreground">
                    {alerta.produtoCodigoInterno}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-warning/10 text-warning">{alerta.tipo}</Badge>
                  <p className="mt-1 text-xs text-muted-foreground">{alerta.mensagem}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Estoque por Categoria */}
        <div className="rounded-xl border border-border bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Estoque por Categoria
          </h3>
          <div className="space-y-3">
            {(resumo?.porCategoria ?? []).map((item) => {
              const max = Math.max(...(resumo?.porCategoria?.map((c) => c.quantidade) ?? [1]));
              const pct = (item.quantidade / max) * 100;
              return (
                <div key={item.categoria}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="text-foreground">{item.categoria}</span>
                    <span className="font-mono text-muted-foreground">{item.quantidade}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-gold"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estoque por Localizacao */}
        <div className="rounded-xl border border-border bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Estoque por Localizacao
          </h3>
          <div className="flex items-center justify-center">
            <div className="space-y-3 w-full">
              {(resumo?.porLocalizacao ?? []).map((item) => {
                const total = (resumo?.porLocalizacao ?? []).reduce((s, c) => s + c.quantidade, 0) || 1;
                const pct = ((item.quantidade / total) * 100).toFixed(1);
                return (
                  <div key={item.localizacao} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-gold" />
                      <span className="text-sm">
                        {localizacaoLabels[item.localizacao] || item.localizacao}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">
                      {item.quantidade} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
