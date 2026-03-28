interface PriceCalculatorProps {
  custoMetal: number;
  custoPedras: number;
  custoMaoObra: number;
  custosIndiretos: number;
  markup: number;
  precoFinal: number;
}

export function PriceCalculator({
  custoMetal,
  custoPedras,
  custoMaoObra,
  custosIndiretos,
  markup,
  precoFinal,
}: PriceCalculatorProps) {
  const custoTotal = custoMetal + custoPedras + custoMaoObra + custosIndiretos;
  const lucro = precoFinal - custoTotal;
  const margemPercent = precoFinal > 0 ? (lucro / precoFinal) * 100 : 0;

  function fmt(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const items = [
    { label: 'Metal', value: custoMetal, color: '#C9A84C' },
    { label: 'Pedras', value: custoPedras, color: '#059669' },
    { label: 'Mao de Obra', value: custoMaoObra, color: '#D97706' },
    { label: 'Indiretos', value: custosIndiretos, color: '#6B7280' },
  ];

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Resumo Financeiro
      </h4>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-mono font-medium">{fmt(item.value)}</span>
          </div>
        ))}
      </div>

      <div className="my-3 h-px bg-border" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">Custo Total</span>
        <span className="font-mono font-bold">{fmt(custoTotal)}</span>
      </div>

      <div className="mt-1 flex items-baseline justify-between text-xs text-muted-foreground">
        <span>Markup {markup}x</span>
      </div>

      <div className="my-3 h-px bg-border" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-gold">Preco Final</span>
        <span className="font-mono text-lg font-bold text-gold">{fmt(precoFinal)}</span>
      </div>

      <div className="mt-1 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">Lucro</span>
        <span className="font-mono font-medium text-success">
          {fmt(lucro)} ({margemPercent.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}
