import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '../services/catalogoApi';

export function usePedras() {
  return useQuery({
    queryKey: ['pedras'],
    queryFn: () => catalogoApi.listarPedras(),
    staleTime: 10 * 60 * 1000,
  });
}
