import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '../services/catalogoApi';

export function useMateriais() {
  return useQuery({
    queryKey: ['materiais'],
    queryFn: () => catalogoApi.listarMateriais(),
    staleTime: 10 * 60 * 1000,
  });
}
