import { useCallback, useRef } from 'react';
import { Upload, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageItem {
  id?: number;
  url?: string;
  preview?: string;
  tipo: string;
  file?: File;
}

interface ImageUploadProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
  className?: string;
}

const tipoLabels: Record<string, string> = {
  PRINCIPAL: 'Principal',
  DETALHE: 'Detalhe',
  MODELO: 'Modelo',
  CERTIFICADO: 'Certificado',
};

export function ImageUpload({ images, onChange, maxImages = 10, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newImages: ImageItem[] = [];
      const remaining = maxImages - images.length;
      const count = Math.min(files.length, remaining);

      for (let i = 0; i < count; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        newImages.push({
          preview: URL.createObjectURL(file),
          tipo: images.length + newImages.length === 0 ? 'PRINCIPAL' : 'DETALHE',
          file,
        });
      }

      onChange([...images, ...newImages]);
    },
    [images, maxImages, onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  function cycleTipo(index: number) {
    const tipos = ['PRINCIPAL', 'DETALHE', 'MODELO', 'CERTIFICADO'];
    const current = images[index].tipo;
    const nextIndex = (tipos.indexOf(current) + 1) % tipos.length;
    const updated = [...images];
    updated[index] = { ...updated[index], tipo: tipos[nextIndex] };
    onChange(updated);
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-10 transition-colors hover:border-gold/50 hover:bg-gold/5"
      >
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <Upload className="h-6 w-6 text-gold" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Arraste imagens aqui ou clique para selecionar
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG ate 5MB cada. Maximo {maxImages} imagens.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-border bg-white"
            >
              <img
                src={img.preview || img.url}
                alt={`Imagem ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => cycleTipo(index)}
                className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-center text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-gold/80"
              >
                {tipoLabels[img.tipo] || img.tipo}
              </button>
              <div className="absolute left-1 top-1 flex h-6 w-6 cursor-grab items-center justify-center rounded bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
