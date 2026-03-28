import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { PriceCalculator } from '../components/PriceCalculator';
import { useProduto, useExcluirProduto } from '../hooks/useProdutos';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const statusConfig: Record<string, { label: string; className: string }> = {
  ATIVO: { label: 'Ativo', className: 'bg-success/10 text-success' },
  INATIVO: { label: 'Inativo', className: 'bg-muted text-muted-foreground' },
  BAIXO_ESTOQUE: { label: 'Baixo Estoque', className: 'bg-warning/10 text-warning' },
  FORA_DE_LINHA: { label: 'Fora de Linha', className: 'bg-danger/10 text-danger' },
};

export function CatalogoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: produto, isLoading } = useProduto(id ? Number(id) : undefined);
  const excluir = useExcluirProduto();
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground">Produto nao encontrado</p>
        <Link to="/catalogo" className="mt-2 text-sm text-gold hover:underline">
          Voltar ao catalogo
        </Link>
      </div>
    );
  }

  const status = statusConfig[produto.status] ?? statusConfig.ATIVO;

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await excluir.mutateAsync(produto!.id);
      toast.success('Produto excluido');
      navigate('/catalogo');
    } catch {
      toast.error('Erro ao excluir produto');
    }
  }

  function fmt(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/catalogo')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Catalogo / Detalhes
            </p>
            <h1 className="text-2xl font-bold text-foreground">{produto.nome}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/catalogo/${produto.id}/editar`}>
            <Button variant="outline">
              <Edit2 className="mr-1.5 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={excluir.isPending}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Galeria */}
          <div className="rounded-xl border border-border bg-white p-5">
            {produto.imagens?.length > 0 ? (
              <>
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted/30">
                  <img
                    src={produto.imagens[selectedImage]?.url}
                    alt={produto.nome}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {produto.imagens.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        'h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2',
                        i === selectedImage ? 'border-gold' : 'border-border'
                      )}
                    >
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-muted/30 text-6xl">
                &#128142;
              </div>
            )}
          </div>

          {/* Info */}
          <div className="rounded-xl border border-border bg-white p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={cn(status.className)}>{status.label}</Badge>
              {produto.destaque && (
                <Badge className="bg-gold/10 text-gold">Destaque</Badge>
              )}
              {produto.personalizavel && (
                <Badge variant="outline">Personalizavel</Badge>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="SKU" value={produto.codigoSku} />
              <InfoItem label="N. Serie" value={produto.numeroSerie} />
              <InfoItem label="Categoria" value={produto.categoria?.nome ?? '-'} />
              <InfoItem label="Tipo" value={produto.tipoProduto} />
              <InfoItem label="Genero" value={produto.genero} />
              <InfoItem label="Estoque" value={String(produto.estoque)} />
            </div>

            {produto.descricao && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descricao</p>
                <p className="mt-1 text-sm text-foreground">{produto.descricao}</p>
              </div>
            )}
          </div>

          {/* Material */}
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Material e Especificacoes
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="Metal" value={produto.metalPrincipal} />
              {produto.quilatagem && <InfoItem label="Quilatagem" value={produto.quilatagem} />}
              <InfoItem label="Cor" value={produto.corMetal} />
              <InfoItem label="Peso Total" value={`${produto.pesoTotal}g`} mono />
              <InfoItem label="Peso Metal" value={`${produto.pesoMetal}g`} mono />
              <InfoItem label="Acabamento" value={produto.acabamento} />
              <InfoItem label="Cravacao" value={produto.tipoCravacao} />
              <InfoItem label="Fecho" value={produto.tipoFecho} />
              <InfoItem label="Tamanho" value={produto.tamanho} />
            </div>
          </div>

          {/* Pedras */}
          {produto.pedras?.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Pedras e Gemas
              </h3>
              <div className="space-y-3">
                {produto.pedras.map((pedra, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
                    <span className="text-sm font-semibold">{pedra.tipo}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {pedra.quantidade}x {pedra.peso}ct
                    </span>
                    <span className="text-xs text-muted-foreground">{pedra.tipoCravacao}</span>
                    {pedra.lapidacao && <span className="text-xs">Lap: {pedra.lapidacao}</span>}
                    {pedra.cor && <span className="text-xs">Cor: {pedra.cor}</span>}
                    {pedra.pureza && <span className="text-xs">Pureza: {pedra.pureza}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar precos */}
        <div className="space-y-4">
          <PriceCalculator
            custoMetal={produto.custoMetal}
            custoPedras={produto.custoPedras}
            custoMaoObra={produto.custoMaoObra}
            custosIndiretos={produto.custosIndiretos}
            markup={produto.markup}
            precoFinal={produto.precoFinal}
          />

          {produto.precoConsignacao > 0 && (
            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preco Consignacao
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                {fmt(produto.precoConsignacao)}
              </p>
            </div>
          )}

          {produto.certificacao?.numero && (
            <div className="rounded-xl border border-border bg-white p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Certificacao
              </h4>
              <p className="mt-2 text-sm font-medium">{produto.certificacao.instituicao}</p>
              <p className="font-mono text-xs text-muted-foreground">{produto.certificacao.numero}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-0.5 text-sm text-foreground', mono && 'font-mono')}>{value || '-'}</p>
    </div>
  );
}
