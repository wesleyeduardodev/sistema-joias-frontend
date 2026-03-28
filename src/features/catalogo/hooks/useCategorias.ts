import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '../services/catalogoApi';

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => catalogoApi.listarCategorias(),
    staleTime: 10 * 60 * 1000,
  });
}
