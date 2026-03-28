import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useMateriais } from '../hooks/useMateriais';
import type { ProdutoFormData } from '../types';

const coresMetalOptions = [
  { value: 'Amarelo', color: '#C9A84C' },
  { value: 'Branco', color: '#E8E8E8' },
  { value: 'Rose', color: '#B76E79' },
];

const acabamentos = [
  { value: 'POLIDO', label: 'Polido' },
  { value: 'FOSCO', label: 'Fosco/Acetinado' },
  { value: 'ESCOVADO', label: 'Escovado' },
  { value: 'DIAMANTADO', label: 'Diamantado' },
  { value: 'TEXTURIZADO', label: 'Texturizado' },
  { value: 'MARTELADO', label: 'Martelado' },
];

const tiposCravacao = [
  { value: 'GARRA', label: 'Garra' },
  { value: 'INGLESA', label: 'Cravacao inglesa' },
  { value: 'PAVE', label: 'Pave' },
  { value: 'TRILHO', label: 'Trilho' },
  { value: 'INVISIVEL', label: 'Invisivel' },
  { value: 'NENHUMA', label: 'Nenhuma' },
];

const tiposFecho = [
  { value: 'TRAVA', label: 'Trava' },
  { value: 'MOSQUETAO', label: 'Mosquetao' },
  { value: 'PRESSAO', label: 'Pressao' },
  { value: 'ROSCA', label: 'Rosca' },
  { value: 'GAVETA', label: 'Gaveta' },
  { value: 'NENHUM', label: 'Nenhum' },
];

export function StepMaterial() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProdutoFormData>();

  const { data: materiais } = useMateriais();

  const materialId = watch('materialId');
  const selectedMaterial = materiais?.find((m) => m.id === Number(materialId));
  const corMetal = watch('corMetal');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Etapa 2 &mdash; Materiais e Especificacoes
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Detalhes do material e acabamento da joia
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Metal Principal *</Label>
            <select
              {...register('materialId', { valueAsNumber: true })}
              onChange={(e) => {
                const id = Number(e.target.value);
                setValue('materialId', id);
                const mat = materiais?.find((m) => m.id === id);
                setValue('metalPrincipal', mat?.nome || '');
              }}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {materiais?.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
            {errors.materialId && (
              <p className="mt-1 text-xs text-danger">{errors.materialId.message}</p>
            )}
          </div>
          {selectedMaterial?.quilatagem && (
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider">Quilatagem</Label>
              <Input
                value={selectedMaterial.quilatagem}
                readOnly
                className="mt-1.5 h-10 bg-muted/50"
              />
            </div>
          )}
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider">Cor Visual do Metal</Label>
          <div className="mt-2 flex gap-4">
            {coresMetalOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('corMetal', opt.value)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm transition-all',
                  corMetal === opt.value
                    ? 'border-gold bg-gold/5'
                    : 'border-border hover:border-gold/50'
                )}
              >
                <span
                  className="h-5 w-5 rounded-full border border-border"
                  style={{ backgroundColor: opt.color }}
                />
                {opt.value}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Peso Total (gramas)</Label>
            <Input
              type="number"
              step="0.01"
              {...register('pesoTotal', { valueAsNumber: true })}
              placeholder="5.200"
              className="mt-1.5 h-10 font-mono"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Peso Estimado do Metal</Label>
            <Input
              type="number"
              step="0.01"
              {...register('pesoMetal', { valueAsNumber: true })}
              placeholder="4.800"
              className="mt-1.5 h-10 font-mono"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Acabamento</Label>
            <select
              {...register('acabamento')}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {acabamentos.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Tipo de Cravacao</Label>
            <select
              {...register('tipoCravacao')}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {tiposCravacao.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Tipo de Fecho</Label>
            <select
              {...register('tipoFecho')}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {tiposFecho.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Tamanho / Aro</Label>
            <Input
              {...register('tamanho')}
              placeholder="Ex: 16 ou aros..."
              className="mt-1.5 h-10"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Para aneis, use a numeracao brasileira (ex: 16, 18, 20)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
