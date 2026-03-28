import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/forms/CurrencyInput';
import { TrendingUp } from 'lucide-react';
import { useCotacoesAtuais } from '@/features/cotacao/hooks/useCotacoes';
import type { ProdutoFormData } from '../types';

export function StepPreco() {
  const { watch, setValue, register } = useFormContext<ProdutoFormData>();
  const { data: cotacoes } = useCotacoesAtuais();

  const metalPrincipal = watch('metalPrincipal');
  const pesoMetal = watch('pesoMetal') || 0;
  const custoMetal = watch('custoMetal') || 0;
  const custoPedras = watch('custoPedras') || 0;
  const custoMaoObra = watch('custoMaoObra') || 0;
  const custosIndiretos = watch('custosIndiretos') || 0;
  const markup = watch('markup') || 2;

  const cotacaoAtual = cotacoes?.find((c) =>
    metalPrincipal?.toLowerCase().includes(c.tipoMetal.toLowerCase())
  );

  useEffect(() => {
    if (cotacaoAtual && pesoMetal > 0) {
      setValue('custoMetal', parseFloat((pesoMetal * cotacaoAtual.precoGrama).toFixed(2)));
    }
  }, [cotacaoAtual, pesoMetal, setValue]);

  const custoTotal = custoMetal + custoPedras + custoMaoObra + custosIndiretos;
  const precoCalculado = custoTotal * markup;

  useEffect(() => {
    setValue('custoTotal', parseFloat(custoTotal.toFixed(2)));
    setValue('precoCalculado', parseFloat(precoCalculado.toFixed(2)));
    if (!watch('precoFinal')) {
      setValue('precoFinal', parseFloat(precoCalculado.toFixed(2)));
    }
  }, [custoTotal, precoCalculado, setValue, watch]);

  function formatCurrency(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Etapa 4 &mdash; Precificacao
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Defina os parametros financeiros e margens para este produto
        </p>
      </div>

      {cotacaoAtual && (
        <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
          <TrendingUp className="h-5 w-5 text-gold" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Cotacao atual do {cotacaoAtual.tipoMetal}
              {cotacaoAtual.quilatagem ? ` ${cotacaoAtual.quilatagem}` : ''}:{' '}
              <span className="font-mono font-bold text-gold">
                {formatCurrency(cotacaoAtual.precoGrama)}/g
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Atualizado em {new Date(cotacaoAtual.dataCotacao + 'T00:00:00').toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-5">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Calculo de Custo
        </h4>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Custo do Metal</Label>
            <CurrencyInput
              value={custoMetal}
              onChange={(val) => setValue('custoMetal', val)}
              className="mt-1.5"
            />
            {cotacaoAtual && pesoMetal > 0 && (
              <p className="mt-1 text-[10px] text-muted-foreground">
                {pesoMetal}g x {formatCurrency(cotacaoAtual.precoGrama)} = auto
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Custo das Pedras</Label>
            <CurrencyInput
              value={custoPedras}
              onChange={(val) => setValue('custoPedras', val)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Custo Mao de Obra</Label>
            <CurrencyInput
              value={custoMaoObra}
              onChange={(val) => setValue('custoMaoObra', val)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Custos Indiretos</Label>
            <CurrencyInput
              value={custosIndiretos}
              onChange={(val) => setValue('custosIndiretos', val)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-muted/50 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-muted-foreground">Custo Total</span>
            <span className="font-mono text-xl font-bold text-foreground">
              {formatCurrency(custoTotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Precificacao
        </h4>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Markup</Label>
            <div className="mt-1.5 flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={10}
                step={0.1}
                value={markup}
                onChange={(e) => setValue('markup', parseFloat(e.target.value))}
                className="flex-1 accent-gold"
              />
              <Input
                type="number"
                step={0.1}
                min={1}
                {...register('markup', { valueAsNumber: true })}
                className="h-10 w-20 text-center font-mono"
              />
              <span className="text-sm text-muted-foreground">x</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border-2 border-gold/30 bg-gold/5 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-gold">
              Preco de Venda Calculado
            </span>
            <span className="font-mono text-2xl font-bold text-gold">
              {formatCurrency(precoCalculado)}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Preco de Venda Final *</Label>
            <CurrencyInput
              value={watch('precoFinal') || 0}
              onChange={(val) => setValue('precoFinal', val)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Preco Sugerido (Consignacao)</Label>
            <CurrencyInput
              value={watch('precoConsignacao') || 0}
              onChange={(val) => setValue('precoConsignacao', val)}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
