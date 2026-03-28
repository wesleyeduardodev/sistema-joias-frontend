import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogoApi } from '../services/catalogoApi';
import type { ProdutoFiltros, ProdutoFormData } from '../types';

export function useProdutos(filtros: ProdutoFiltros) {
  return useQuery({
    queryKey: ['produtos', filtros],
    queryFn: () => catalogoApi.listar(filtros),
  });
}

export function useProduto(id: number | undefined) {
  return useQuery({
    queryKey: ['produto', id],
    queryFn: () => catalogoApi.buscarPorId(id!),
    enabled: !!id,
  });
}

export function useCriarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProdutoFormData) => catalogoApi.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useAtualizarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProdutoFormData> }) =>
      catalogoApi.atualizar(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      queryClient.invalidateQueries({ queryKey: ['produto', variables.id] });
    },
  });
}

export function useExcluirProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => catalogoApi.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}
