import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategorias } from '../hooks/useCategorias';
import type { ProdutoFiltros } from '../types';

interface FilterPanelProps {
  filtros: ProdutoFiltros;
  onChange: (filtros: ProdutoFiltros) => void;
}

const metais = ['Ouro Amarelo', 'Ouro Branco', 'Ouro Rose', 'Prata 925', 'Platina'];
const pedras = ['Diamante', 'Rubi', 'Esmeralda', 'Safira', 'Ametista', 'Topazio', 'Perola'];
const faixasPreco = [
  { label: 'Ate R$ 1.000', min: 0, max: 1000 },
  { label: 'R$ 1.000 - R$ 5.000', min: 1000, max: 5000 },
  { label: 'R$ 5.000 - R$ 15.000', min: 5000, max: 15000 },
  { label: 'R$ 15.000 - R$ 50.000', min: 15000, max: 50000 },
  { label: 'Acima de R$ 50.000', min: 50000, max: undefined },
];
const disponibilidades = [
  { value: 'ATIVO', label: 'Disponivel' },
  { value: 'BAIXO_ESTOQUE', label: 'Baixo Estoque' },
  { value: 'FORA_DE_LINHA', label: 'Fora de Linha' },
  { value: 'INATIVO', label: 'Indisponivel' },
];

export function FilterPanel({ filtros, onChange }: FilterPanelProps) {
  const { data: categorias } = useCategorias();

  const hasFilters =
    filtros.categoriaId ||
    filtros.metal ||
    filtros.pedra ||
    filtros.faixaPrecoMin !== undefined ||
    filtros.disponibilidade;

  function handleClear() {
    onChange({
      busca: filtros.busca,
      pagina: 1,
      porPagina: filtros.porPagina,
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filtros.categoriaId ?? ''}
        onChange={(e) =>
          onChange({
            ...filtros,
            categoriaId: e.target.value ? Number(e.target.value) : undefined,
            pagina: 1,
          })
        }
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-gold"
      >
        <option value="">Todas as Categorias</option>
        {categorias?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nome}
          </option>
        ))}
      </select>

      <select
        value={filtros.metal ?? ''}
        onChange={(e) =>
          onChange({ ...filtros, metal: e.target.value || undefined, pagina: 1 })
        }
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-gold"
      >
        <option value="">Metal</option>
        {metais.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={filtros.pedra ?? ''}
        onChange={(e) =>
          onChange({ ...filtros, pedra: e.target.value || undefined, pagina: 1 })
        }
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-gold"
      >
        <option value="">Pedra</option>
        {pedras.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={
          filtros.faixaPrecoMin !== undefined
            ? `${filtros.faixaPrecoMin}-${filtros.faixaPrecoMax ?? ''}`
            : ''
        }
        onChange={(e) => {
          if (!e.target.value) {
            onChange({
              ...filtros,
              faixaPrecoMin: undefined,
              faixaPrecoMax: undefined,
              pagina: 1,
            });
          } else {
            const faixa = faixasPreco.find(
              (f) => `${f.min}-${f.max ?? ''}` === e.target.value
            );
            if (faixa) {
              onChange({
                ...filtros,
                faixaPrecoMin: faixa.min,
                faixaPrecoMax: faixa.max,
                pagina: 1,
              });
            }
          }
        }}
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-gold"
      >
        <option value="">Faixa de Preco</option>
        {faixasPreco.map((f) => (
          <option key={`${f.min}-${f.max}`} value={`${f.min}-${f.max ?? ''}`}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        value={filtros.disponibilidade ?? ''}
        onChange={(e) =>
          onChange({
            ...filtros,
            disponibilidade: e.target.value || undefined,
            pagina: 1,
          })
        }
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-gold"
      >
        <option value="">Disponibilidade</option>
        {disponibilidades.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="mr-1 h-3 w-3" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
