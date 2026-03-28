import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cotacaoApi } from '../services/cotacaoApi';
import type { CotacaoFormData, TipoMetal } from '../types';

export function useCotacoesAtuais() {
  return useQuery({
    queryKey: ['cotacoes-atuais'],
    queryFn: () => cotacaoApi.listarAtuais(),
  });
}

export function useCotacoesHistorico(tipoMetal?: TipoMetal) {
  return useQuery({
    queryKey: ['cotacoes-historico', tipoMetal],
    queryFn: () => cotacaoApi.listarHistorico(tipoMetal),
  });
}

export function useRegistrarCotacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CotacaoFormData) => cotacaoApi.registrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes-atuais'] });
      queryClient.invalidateQueries({ queryKey: ['cotacoes-historico'] });
    },
  });
}
