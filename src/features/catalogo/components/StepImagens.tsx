import { useFormContext } from 'react-hook-form';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { Info } from 'lucide-react';
import type { ProdutoFormData } from '../types';

export function StepImagens() {
  const { watch, setValue } = useFormContext<ProdutoFormData>();
  const imagens = watch('imagens') || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground">
          Imagens do Produto
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Adicione fotos de alta qualidade. A primeira imagem sera a principal.
        </p>
      </div>

      <ImageUpload
        images={imagens.map((img) => ({
          id: img.id,
          url: img.url,
          preview: img.preview,
          tipo: img.tipo,
          file: img.file,
        }))}
        onChange={(updated) =>
          setValue(
            'imagens',
            updated.map((img, index) => ({
              ...img,
              ordem: index,
              tipo: (img.tipo || 'DETALHE') as 'PRINCIPAL' | 'DETALHE' | 'MODELO' | 'CERTIFICADO',
              url: img.url || '',
            }))
          )
        }
        maxImages={10}
      />

      <div className="flex items-start gap-2 rounded-lg bg-gold/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p className="text-xs text-muted-foreground">
          Dica: Use fundo branco para a foto principal. Inclua fotos em uso (modelo), detalhes da pedra, e o certificado.
        </p>
      </div>
    </div>
  );
}
