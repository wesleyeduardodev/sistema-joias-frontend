import api from '@/lib/api';
import type { Cotacao, CotacaoFormData, TipoMetal } from '../types';

export const cotacaoApi = {
  listarAtuais(): Promise<Cotacao[]> {
    return api.get('/cotacoes/atual').then((r) => r.data);
  },

  listarHistorico(tipoMetal?: TipoMetal, de?: string, ate?: string): Promise<Cotacao[]> {
    return api
      .get('/cotacoes/historico', {
        params: { tipoMetal, de, ate },
      })
      .then((r) => r.data);
  },

  registrar(data: CotacaoFormData): Promise<Cotacao> {
    return api.post('/cotacoes', data).then((r) => r.data);
  },
};
