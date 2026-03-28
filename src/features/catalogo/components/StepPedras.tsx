import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';
import { usePedras } from '../hooks/usePedras';
import type { ProdutoFormData } from '../types';

const lapidacoes = ['Brilhante', 'Princesa', 'Esmeralda', 'Oval', 'Marquise', 'Gota', 'Coracao', 'Cushion'];
const coresDiamante = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const purezas = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2'];

const certificadoras = [
  { value: 'GIA', label: 'GIA' },
  { value: 'IGI', label: 'IGI' },
  { value: 'HRD', label: 'HRD' },
  { value: 'IBGM', label: 'IBGM' },
  { value: 'OUTRO', label: 'Outro' },
];

export function StepPedras() {
  const { register, watch, control, setValue } = useFormContext<ProdutoFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'pedras' });
  const { data: pedrasDisponiveis } = usePedras();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Etapa 3 &mdash; Pedras e Gemas
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione as pedras e classificacoes deste item
          </p>
        </div>
        <Button
          type="button"
          onClick={() =>
            append({
              pedraId: 0,
              tipo: '',
              quantidade: 1,
              peso: 0,
              tipoCravacao: '',
            })
          }
          className="bg-gradient-to-r from-gold to-gold-light text-white hover:shadow-md"
          size="sm"
        >
          <Plus className="mr-1 h-4 w-4" />
          Adicionar Pedra
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma pedra adicionada. Clique em &ldquo;Adicionar Pedra&rdquo; para comecar.
          </p>
        </div>
      )}

      {fields.map((field, index) => {
        const pedraId = watch(`pedras.${index}.pedraId`);
        const selectedPedra = pedrasDisponiveis?.find((p) => p.id === Number(pedraId));
        const isDiamante = selectedPedra?.tipo === 'DIAMANTE' || selectedPedra?.nome?.toLowerCase() === 'diamante';

        return (
          <div key={field.id} className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Pedra #{index + 1} {selectedPedra && `\u2014 ${selectedPedra.nome}`}
              </h4>
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Tipo de Pedra</Label>
                <select
                  {...register(`pedras.${index}.pedraId`, { valueAsNumber: true })}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setValue(`pedras.${index}.pedraId`, id);
                    const pedra = pedrasDisponiveis?.find((p) => p.id === id);
                    setValue(`pedras.${index}.tipo`, pedra?.nome || '');
                  }}
                  className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
                >
                  <option value="">Selecione...</option>
                  {pedrasDisponiveis?.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Quantidade</Label>
                <Input
                  type="number"
                  min={1}
                  {...register(`pedras.${index}.quantidade`, { valueAsNumber: true })}
                  className="mt-1.5 h-10 font-mono"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Peso Total (ct)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`pedras.${index}.peso`, { valueAsNumber: true })}
                  className="mt-1.5 h-10 font-mono"
                />
              </div>
            </div>

            {isDiamante && (
              <div className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gold">
                  Classificacao 4Cs (Diamante)
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider">Lapidacao</Label>
                    <select
                      {...register(`pedras.${index}.lapidacao`)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
                    >
                      <option value="">Selecione...</option>
                      {lapidacoes.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider">Cor</Label>
                    <select
                      {...register(`pedras.${index}.cor`)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
                    >
                      <option value="">Selecione...</option>
                      {coresDiamante.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider">Pureza</Label>
                    <select
                      {...register(`pedras.${index}.pureza`)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
                    >
                      <option value="">Selecione...</option>
                      {purezas.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="rounded-xl border border-border bg-white p-5">
        <h4 className="mb-4 text-sm font-semibold text-foreground">Certificacao</h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Instituicao Certificadora</Label>
            <select
              {...register('certificacao.instituicao')}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {certificadoras.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Numero do Certificado</Label>
            <Input
              {...register('certificacao.numero')}
              placeholder="Ex: GIA1234"
              className="mt-1.5 h-10"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Data de Emissao</Label>
            <Input
              type="date"
              {...register('certificacao.dataEmissao')}
              className="mt-1.5 h-10"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label className="text-xs font-semibold uppercase tracking-wider">Documento</Label>
          <div className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-gold/50">
            <Upload className="h-4 w-4" />
            Arraste o PDF do certificado aqui ou clique para enviar
          </div>
        </div>
      </div>
    </div>
  );
}
