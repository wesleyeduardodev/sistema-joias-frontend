import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { StepperForm } from '../components/StepperForm';
import { StepBasico } from '../components/StepBasico';
import { StepMaterial } from '../components/StepMaterial';
import { StepPedras } from '../components/StepPedras';
import { StepPreco } from '../components/StepPreco';
import { StepImagens } from '../components/StepImagens';
import { useCriarProduto } from '../hooks/useProdutos';
import type { ProdutoFormData } from '../types';

const steps = [
  { label: 'Basico' },
  { label: 'Material' },
  { label: 'Pedras' },
  { label: 'Preco' },
  { label: 'Imagens' },
];

const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio'),
  codigoSku: z.string().min(1, 'Codigo interno e obrigatorio'),
  numeroSerie: z.string().optional().default(''),
  categoriaId: z.coerce.number().min(1, 'Categoria e obrigatoria'),
  subcategoriaId: z.coerce.number().optional().default(0),
  tipoProduto: z.enum(['JOIA', 'SEMIJOIA', 'BIJUTERIA']),
  genero: z.enum(['MASCULINO', 'FEMININO', 'UNISSEX']),
  descricao: z.string().optional().default(''),
  personalizavel: z.boolean().default(false),
  destaque: z.boolean().default(false),
  materialId: z.coerce.number().min(1, 'Metal e obrigatorio'),
  metalPrincipal: z.string().optional().default(''),
  quilatagem: z.string().optional().default(''),
  corMetal: z.string().optional().default(''),
  pesoTotal: z.coerce.number().optional().default(0),
  pesoMetal: z.coerce.number().optional().default(0),
  acabamento: z.string().optional().default(''),
  tipoCravacao: z.string().optional().default(''),
  tipoFecho: z.string().optional().default(''),
  tamanho: z.string().optional().default(''),
  pedras: z.array(z.object({
    pedraId: z.coerce.number(),
    tipo: z.string().optional().default(''),
    quantidade: z.number(),
    peso: z.number(),
    tipoCravacao: z.string().optional().default(''),
    lapidacao: z.string().optional(),
    cor: z.string().optional(),
    pureza: z.string().optional(),
  })).default([]),
  certificacao: z.object({
    instituicao: z.string().optional().default(''),
    numero: z.string().optional().default(''),
    dataEmissao: z.string().optional().default(''),
    arquivoUrl: z.string().optional(),
  }).default(() => ({ instituicao: '', numero: '', dataEmissao: '' })),
  custoMetal: z.coerce.number().default(0),
  custoPedras: z.coerce.number().default(0),
  custoMaoObra: z.coerce.number().default(0),
  custosIndiretos: z.coerce.number().default(0),
  custoTotal: z.coerce.number().default(0),
  markup: z.coerce.number().default(2),
  precoCalculado: z.coerce.number().default(0),
  precoFinal: z.coerce.number().min(0),
  precoConsignacao: z.coerce.number().default(0),
  imagens: z.array(z.any()).default([]),
});

export function CatalogoNovo() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const criarProduto = useCriarProduto();

  const methods = useForm<ProdutoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(produtoSchema) as any,
    defaultValues: {
      tipoProduto: 'JOIA',
      genero: 'FEMININO',
      personalizavel: false,
      destaque: false,
      pedras: [],
      certificacao: { instituicao: '', numero: '', dataEmissao: '' },
      markup: 2,
      custoMetal: 0,
      custoPedras: 0,
      custoMaoObra: 0,
      custosIndiretos: 0,
      custoTotal: 0,
      precoCalculado: 0,
      precoFinal: 0,
      precoConsignacao: 0,
      imagens: [],
    },
    mode: 'onChange',
  });

  const isLastStep = currentStep === steps.length - 1;

  // Campos obrigatorios por etapa
  const stepValidationFields: Record<number, (keyof ProdutoFormData)[]> = {
    0: ['nome', 'codigoSku', 'categoriaId', 'tipoProduto', 'genero'],
    1: ['materialId'],
    2: [], // Pedras sao opcionais
    3: ['precoFinal'],
    4: [], // Imagens sao opcionais
  };

  async function handleNext() {
    if (isLastStep) return;

    const fieldsToValidate = stepValidationFields[currentStep] || [];
    if (fieldsToValidate.length > 0) {
      const isValid = await methods.trigger(fieldsToValidate);
      if (!isValid) {
        const errors = methods.formState.errors;
        const firstErrorField = fieldsToValidate.find(f => errors[f]);
        if (firstErrorField && errors[firstErrorField]) {
          toast.error(String(errors[firstErrorField]?.message) || 'Preencha os campos obrigatorios');
        }
        return;
      }
    }

    setCurrentStep((s) => s + 1);
  }

  function handlePrev() {
    if (currentStep === 0) return;
    setCurrentStep((s) => s - 1);
  }

  async function onSubmit(data: ProdutoFormData) {
    try {
      await criarProduto.mutateAsync(data);
      toast.success('Produto criado com sucesso!');
      navigate('/catalogo');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar produto. Tente novamente.';
      toast.error(message);
    }
  }

  function handleSave() {
    methods.handleSubmit(onSubmit, (errors) => {
      const fieldNames = Object.keys(errors);
      if (fieldNames.length > 0) {
        const firstError = Object.values(errors)[0];
        const message = firstError?.message || 'Preencha os campos obrigatorios';
        toast.error(`Erro de validacao: ${message}`);

        // Navegar para a etapa que contém o primeiro erro
        const stepFields: Record<number, string[]> = {
          0: ['nome', 'categoriaId', 'tipoProduto', 'genero'],
          1: ['materialId'],
          3: ['precoFinal'],
        };
        for (const [step, fields] of Object.entries(stepFields)) {
          if (fieldNames.some(f => fields.includes(f))) {
            setCurrentStep(Number(step));
            break;
          }
        }
      }
    })();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Catalogo / Novo Produto
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Novo Produto</h1>
      </div>

      <StepperForm
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => step <= currentStep && setCurrentStep(step)}
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
              <Button type="button" variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Anterior
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/catalogo')}
              >
                Cancelar
              </Button>
            )}

            {isLastStep ? (
              <Button
                type="button"
                onClick={handleSave}
                disabled={criarProduto.isPending}
                className="bg-gradient-to-r from-gold to-gold-light text-white shadow-md hover:shadow-lg"
              >
                <Save className="mr-1.5 h-4 w-4" />
                {criarProduto.isPending ? 'Salvando...' : 'Salvar Produto'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-gold to-gold-light text-white shadow-md hover:shadow-lg"
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
