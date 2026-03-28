import type { PedraBase } from '../types';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoneEditorProps {
  pedras: PedraBase[];
  onChange: (pedras: PedraBase[]) => void;
}

export function StoneEditor({ pedras, onChange }: StoneEditorProps) {
  function addPedra() {
    onChange([...pedras, { pedraId: 0, tipo: '', quantidade: 1, peso: 0, tipoCravacao: '' }]);
  }

  function removePedra(index: number) {
    onChange(pedras.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {pedras.map((pedra, index) => (
        <div key={index} className="flex items-center gap-2 rounded-lg border border-border p-3">
          <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
          <span className="text-sm">{pedra.tipo || 'Sem tipo'}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {pedra.quantidade}x {pedra.peso}ct
          </span>
          <span className="text-xs text-muted-foreground">{pedra.tipoCravacao}</span>
          <button
            type="button"
            onClick={() => removePedra(index)}
            className="ml-auto text-muted-foreground hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addPedra}>
        <Plus className="mr-1 h-3 w-3" />
        Adicionar
      </Button>
    </div>
  );
}
