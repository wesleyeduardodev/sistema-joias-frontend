import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCriarMovimentacao } from '../hooks/useEstoque';
import { toast } from 'sonner';
import type { MovimentacaoFormData } from '../types';

const schema = z.object({
  tipo: z.enum(['ENTRADA', 'SAIDA', 'TRANSFERENCIA', 'AJUSTE']),
  produtoId: z.string().min(1, 'Selecione um produto'),
  localizacaoOrigem: z.string().default(''),
  localizacaoDestino: z.string().default(''),
  quantidade: z.coerce.number().min(1, 'Quantidade minima: 1'),
  observacoes: z.string().optional(),
});

interface MovimentacaoFormProps {
  open: boolean;
  onClose: () => void;
}

const tiposMovimentacao = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'SAIDA', label: 'Saida' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'AJUSTE', label: 'Ajuste' },
];

const localizacoes = [
  { value: 'COFRE', label: 'Cofre' },
  { value: 'VITRINE', label: 'Vitrine' },
  { value: 'REPRESENTANTE', label: 'Representante' },
  { value: 'TRANSITO', label: 'Em Transito' },
  { value: 'VENDIDO', label: 'Vendido' },
  { value: 'CONSIGNADO', label: 'Consignado' },
];

export function MovimentacaoForm({ open, onClose }: MovimentacaoFormProps) {
  const criar = useCriarMovimentacao();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MovimentacaoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      tipo: 'ENTRADA',
      quantidade: 1,
      localizacaoOrigem: '',
      localizacaoDestino: '',
    },
  });

  const tipo = watch('tipo');
  const showOrigem = tipo === 'SAIDA' || tipo === 'TRANSFERENCIA' || tipo === 'AJUSTE';
  const showDestino = tipo === 'ENTRADA' || tipo === 'TRANSFERENCIA';

  async function onSubmit(data: MovimentacaoFormData) {
    try {
      await criar.mutateAsync(data);
      toast.success('Movimentacao registrada com sucesso');
      reset();
      onClose();
    } catch {
      toast.error('Erro ao registrar movimentacao');
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Movimentacao</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Tipo</Label>
            <select
              {...register('tipo')}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
            >
              {tiposMovimentacao.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">ID do Produto</Label>
            <Input
              {...register('produtoId')}
              placeholder="UUID do produto"
              className="mt-1.5 h-10"
            />
            {errors.produtoId && (
              <p className="mt-1 text-xs text-danger">{errors.produtoId.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {showOrigem && (
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Origem</Label>
                <select
                  {...register('localizacaoOrigem')}
                  className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
                >
                  <option value="">Selecione...</option>
                  {localizacoes.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            )}
            {showDestino && (
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Destino</Label>
                <select
                  {...register('localizacaoDestino')}
                  className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
                >
                  <option value="">Selecione...</option>
                  {localizacoes.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Quantidade</Label>
            <Input
              type="number"
              min={1}
              {...register('quantidade', { valueAsNumber: true })}
              className="mt-1.5 h-10 font-mono"
            />
            {errors.quantidade && (
              <p className="mt-1 text-xs text-danger">{errors.quantidade.message}</p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Observacoes</Label>
            <textarea
              {...register('observacoes')}
              rows={2}
              className="mt-1.5 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={criar.isPending}
              className="bg-gradient-to-r from-gold to-gold-light text-white"
            >
              {criar.isPending ? 'Salvando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
