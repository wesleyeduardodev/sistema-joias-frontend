import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategorias } from '../hooks/useCategorias';
import type { ProdutoFormData } from '../types';

export function StepBasico() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProdutoFormData>();
  const { data: categorias } = useCategorias();
  const categoriaId = watch('categoriaId');
  const selectedCategoria = categorias?.find((c) => c.id === Number(categoriaId));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Etapa 1 &mdash; Informacoes Basicas
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados basicos da peca
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider">Nome da Peca *</Label>
          <Input
            {...register('nome')}
            placeholder="Ex: Anel Solitario Diamante 0.5ct"
            className="mt-1.5 h-10"
          />
          {errors.nome && <p className="mt-1 text-xs text-danger">{errors.nome.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Codigo Interno / SKU</Label>
            <Input
              {...register('codigoSku')}
              placeholder="J01-ANE-001"
              className="mt-1.5 h-10"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Numero de Serie</Label>
            <Input
              {...register('numeroSerie')}
              placeholder="SER-2024-00001"
              className="mt-1.5 h-10"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Categoria *</Label>
            <select
              {...register('categoriaId', { valueAsNumber: true })}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {categorias?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <p className="mt-1 text-xs text-danger">{errors.categoriaId.message}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Subcategoria</Label>
            <select
              {...register('subcategoriaId', { valueAsNumber: true })}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {selectedCategoria?.subcategorias?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Tipo de Produto *</Label>
            <div className="mt-2 flex gap-4">
              {(['JOIA', 'SEMIJOIA', 'BIJUTERIA'] as const).map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={tipo}
                    {...register('tipoProduto')}
                    className="h-4 w-4 accent-gold"
                  />
                  {tipo === 'JOIA' ? 'Joia' : tipo === 'SEMIJOIA' ? 'Semijoia' : 'Bijuteria'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Genero</Label>
            <div className="mt-2 flex gap-4">
              {(['MASCULINO', 'FEMININO', 'UNISSEX'] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={g}
                    {...register('genero')}
                    className="h-4 w-4 accent-gold"
                  />
                  {g === 'MASCULINO' ? 'Masculino' : g === 'FEMININO' ? 'Feminino' : 'Unissex'}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider">Descricao</Label>
          <textarea
            {...register('descricao')}
            rows={4}
            placeholder="Descreva as caracteristicas artisticas e conceituais da peca..."
            className="mt-1.5 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={watch('personalizavel')}
              onCheckedChange={(checked) => setValue('personalizavel', !!checked)}
            />
            Personalizavel
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={watch('destaque')}
              onCheckedChange={(checked) => setValue('destaque', !!checked)}
            />
            Destaque
          </label>
        </div>
      </div>
    </div>
  );
}
