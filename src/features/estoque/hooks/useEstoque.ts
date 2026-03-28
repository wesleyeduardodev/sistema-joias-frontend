import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { estoqueApi } from '../services/estoqueApi';
import type { MovimentacaoFormData, Localizacao } from '../types';

export function useEstoqueResumo() {
  return useQuery({
    queryKey: ['estoque-resumo'],
    queryFn: () => estoqueApi.resumo(),
  });
}

export function useEstoqueAlertas() {
  return useQuery({
    queryKey: ['estoque-alertas'],
    queryFn: () => estoqueApi.alertas(),
  });
}

export function usePosicaoEstoque(localizacao?: Localizacao, categoriaId?: number) {
  return useQuery({
    queryKey: ['estoque-posicao', localizacao, categoriaId],
    queryFn: () => estoqueApi.posicaoAtual(localizacao, categoriaId),
  });
}

export function useCriarMovimentacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MovimentacaoFormData) => estoqueApi.criarMovimentacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque-resumo'] });
      queryClient.invalidateQueries({ queryKey: ['estoque-alertas'] });
      queryClient.invalidateQueries({ queryKey: ['estoque-posicao'] });
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
    },
  });
}

export function useInventario(localizacao?: Localizacao) {
  return useQuery({
    queryKey: ['inventario', localizacao],
    queryFn: () => estoqueApi.inventario(localizacao),
  });
}

export function useRegistrarAjuste() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      produtoId: string;
      quantidade: number;
      localizacao: Localizacao;
      observacoes: string;
    }) => estoqueApi.ajuste(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      queryClient.invalidateQueries({ queryKey: ['estoque-resumo'] });
      queryClient.invalidateQueries({ queryKey: ['estoque-posicao'] });
    },
  });
}
