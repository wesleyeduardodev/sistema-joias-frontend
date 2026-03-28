import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { toast } from 'sonner';
import { StepperForm } from '../components/StepperForm';
import { StepBasico } from '../components/StepBasico';
import { StepMaterial } from '../components/StepMaterial';
import { StepPedras } from '../components/StepPedras';
import { StepPreco } from '../components/StepPreco';
import { StepImagens } from '../components/StepImagens';
import { useProduto, useAtualizarProduto } from '../hooks/useProdutos';
import type { ProdutoFormData } from '../types';

const steps = [
  { label: 'Basico' },
  { label: 'Material' },
  { label: 'Pedras' },
  { label: 'Preco' },
  { label: 'Imagens' },
];

export function CatalogoEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: produto, isLoading } = useProduto(id ? Number(id) : undefined);
  const atualizarProduto = useAtualizarProduto();
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<ProdutoFormData>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (produto) {
      methods.reset({
        nome: produto.nome,
        codigoSku: produto.codigoSku,
        numeroSerie: produto.numeroSerie,
        categoriaId: produto.categoriaId,
        subcategoriaId: produto.subcategoriaId,
        tipoProduto: produto.tipoProduto,
        genero: produto.genero,
        descricao: produto.descricao,
        personalizavel: produto.personalizavel,
        destaque: produto.destaque,
        metalPrincipal: produto.metalPrincipal,
        quilatagem: produto.quilatagem || '',
        corMetal: produto.corMetal,
        pesoTotal: produto.pesoTotal,
        pesoMetal: produto.pesoMetal,
        acabamento: produto.acabamento,
        tipoCravacao: produto.tipoCravacao,
        tipoFecho: produto.tipoFecho,
        tamanho: produto.tamanho,
        pedras: produto.pedras,
        certificacao: produto.certificacao || { instituicao: '', numero: '', dataEmissao: '' },
        custoMetal: produto.custoMetal,
        custoPedras: produto.custoPedras,
        custoMaoObra: produto.custoMaoObra,
        custosIndiretos: produto.custosIndiretos,
        custoTotal: produto.custoTotal,
        markup: produto.markup,
        precoCalculado: produto.precoCalculado,
        precoFinal: produto.precoFinal,
        precoConsignacao: produto.precoConsignacao,
        imagens: produto.imagens,
      });
    }
  }, [produto, methods]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!produto) {
    return <div className="py-20 text-center text-muted-foreground">Produto nao encontrado</div>;
  }

  const isLastStep = currentStep === steps.length - 1;

  async function onSubmit(data: ProdutoFormData) {
    try {
      await atualizarProduto.mutateAsync({ id: produto!.id, data });
      toast.success('Produto atualizado com sucesso!');
      navigate(`/catalogo/${produto!.id}`);
    } catch {
      toast.error('Erro ao atualizar produto');
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Catalogo / Editar
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">
          Editar: {produto.nome}
        </h1>
      </div>

      <StepperForm
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="rounded-xl border border-border bg-white p-6">
            {currentStep === 0 && <StepBasico />}
            {currentStep === 1 && <StepMaterial />}
            {currentStep === 2 && <StepPedras />}
            {currentStep === 3 && <StepPreco />}
            {currentStep === 4 && <StepImagens />}
          </div>

          <div className="mt-6 flex items-center justify-between">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Anterior
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => navigate(`/catalogo/${produto.id}`)}>
                Cancelar
              </Button>
            )}

            {isLastStep ? (
              <Button
                type="submit"
                disabled={atualizarProduto.isPending}
                className="bg-gradient-to-r from-gold to-gold-light text-white shadow-md"
              >
                <Save className="mr-1.5 h-4 w-4" />
                {atualizarProduto.isPending ? 'Salvando...' : 'Salvar Alteracoes'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="bg-gradient-to-r from-gold to-gold-light text-white shadow-md"
              >
                Proximo
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
