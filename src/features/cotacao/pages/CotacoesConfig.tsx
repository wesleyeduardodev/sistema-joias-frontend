import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/data-display/DataTable';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import {
  useCotacoesAtuais,
  useCotacoesHistorico,
  useRegistrarCotacao,
} from '../hooks/useCotacoes';
import { toast } from 'sonner';
import type { Cotacao, CotacaoFormData, TipoMetal } from '../types';

const tiposMetalOptions = [
  { value: 'OURO', label: 'Ouro' },
  { value: 'PRATA', label: 'Prata' },
  { value: 'PLATINA', label: 'Platina' },
  { value: 'ACO', label: 'Aco' },
  { value: 'TITANIO', label: 'Titanio' },
  { value: 'OUTRO', label: 'Outro' },
];

const quilatagensOuro = ['10K', '14K', '18K', '22K', '24K'];

const schema = z.object({
  tipoMetal: z.string().min(1, 'Selecione o tipo de metal'),
  quilatagem: z.string().min(1, 'Informe a quilatagem'),
  precoGrama: z.coerce.number().min(0.01, 'Valor deve ser positivo'),
  dataCotacao: z.string().min(1, 'Informe a data'),
  fonte: z.string().min(1, 'Informe a fonte'),
});

const tipoMetalLabels: Record<string, string> = {
  OURO: 'Ouro',
  PRATA: 'Prata',
  PLATINA: 'Platina',
  ACO: 'Aco',
  TITANIO: 'Titanio',
  OUTRO: 'Outro',
};

const historicoColumns: Column<Cotacao>[] = [
  {
    key: 'dataCotacao',
    header: 'Data',
    sortable: true,
    render: (c) =>
      new Date(c.dataCotacao + 'T00:00:00').toLocaleDateString('pt-BR'),
  },
  {
    key: 'tipoMetal',
    header: 'Metal',
    sortable: true,
    render: (c) => tipoMetalLabels[c.tipoMetal] || c.tipoMetal,
  },
  { key: 'quilatagem', header: 'Quilatagem' },
  {
    key: 'precoGrama',
    header: 'Valor/g',
    className: 'font-mono text-right',
    render: (c) =>
      c.precoGrama.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  },
  { key: 'fonte', header: 'Fonte' },
];

export function CotacoesConfig() {
  const { data: cotacoesAtuais, isLoading: loadingAtuais } = useCotacoesAtuais();
  const [metalFiltro, setMetalFiltro] = useState<TipoMetal | undefined>();
  const { data: historico, isLoading: loadingHistorico } = useCotacoesHistorico(metalFiltro);
  const registrar = useRegistrarCotacao();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CotacaoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      dataCotacao: new Date().toISOString().slice(0, 10),
    },
  });

  const tipoMetalValue = watch('tipoMetal');

  async function onSubmit(data: CotacaoFormData) {
    try {
      await registrar.mutateAsync(data);
      toast.success('Cotacao registrada com sucesso');
      reset();
      setShowForm(false);
    } catch {
      toast.error('Erro ao registrar cotacao');
    }
  }

  if (loadingAtuais) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cotacoes de Metais</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as cotacoes de metais preciosos
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-gold to-gold-light text-white shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nova Cotacao
        </Button>
      </div>

      {/* Cotacoes atuais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(cotacoesAtuais ?? []).map((cotacao) => (
          <div
            key={cotacao.id}
            className="rounded-xl border border-border bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {tipoMetalLabels[cotacao.tipoMetal] || cotacao.tipoMetal}
                  {cotacao.quilatagem ? ` ${cotacao.quilatagem}` : ''}
                </p>
                <p className="mt-2 font-mono text-2xl font-bold text-foreground">
                  {cotacao.precoGrama.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  <span className="text-sm font-normal text-muted-foreground">/g</span>
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                <TrendingUp className="h-4 w-4 text-gold" />
              </div>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Data: {new Date(cotacao.dataCotacao + 'T00:00:00').toLocaleDateString('pt-BR')}
              {cotacao.fonte ? ` | Fonte: ${cotacao.fonte}` : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Form nova cotacao */}
      {showForm && (
        <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Registrar Nova Cotacao
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Tipo de Metal</Label>
                <select
                  {...register('tipoMetal')}
                  className="mt-1.5 h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-ring"
                >
                  <option value="">Selecione...</option>
                  {tiposMetalOptions.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                {errors.tipoMetal && (
                  <p className="mt-1 text-xs text-danger">{errors.tipoMetal.message}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Quilatagem</Label>
                {tipoMetalValue === 'OURO' ? (
                  <select
                    {...register('quilatagem')}
                    className="mt-1.5 h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-ring"
                  >
                    <option value="">Selecione...</option>
                    {quilatagensOuro.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    {...register('quilatagem')}
                    placeholder="Ex: 925"
                    className="mt-1.5 h-10"
                  />
                )}
                {errors.quilatagem && (
                  <p className="mt-1 text-xs text-danger">{errors.quilatagem.message}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Valor por Grama (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('precoGrama', { valueAsNumber: true })}
                  placeholder="350.00"
                  className="mt-1.5 h-10 font-mono"
                />
                {errors.precoGrama && (
                  <p className="mt-1 text-xs text-danger">{errors.precoGrama.message}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Data</Label>
                <Input
                  type="date"
                  {...register('dataCotacao')}
                  className="mt-1.5 h-10"
                />
                {errors.dataCotacao && (
                  <p className="mt-1 text-xs text-danger">{errors.dataCotacao.message}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Fonte</Label>
                <Input
                  {...register('fonte')}
                  placeholder="Ex: Kitco, IBGM"
                  className="mt-1.5 h-10"
                />
                {errors.fonte && (
                  <p className="mt-1 text-xs text-danger">{errors.fonte.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={registrar.isPending}
                className="bg-gradient-to-r from-gold to-gold-light text-white"
              >
                {registrar.isPending ? 'Salvando...' : 'Registrar'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Historico */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Historico de Cotacoes
          </h3>
          <select
            value={metalFiltro ?? ''}
            onChange={(e) =>
              setMetalFiltro((e.target.value || undefined) as TipoMetal | undefined)
            }
            className="h-8 rounded-lg border border-border bg-white px-3 text-xs outline-none focus:border-gold"
          >
            <option value="">Todos os metais</option>
            {tiposMetalOptions.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {loadingHistorico ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable
            columns={historicoColumns}
            data={historico ?? []}
            keyExtractor={(c) => c.id}
            emptyMessage="Nenhuma cotacao registrada"
          />
        )}
      </div>
    </div>
  );
}
