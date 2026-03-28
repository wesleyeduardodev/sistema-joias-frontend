import api from '@/lib/api';
import type {
  EstoqueResumo,
  Movimentacao,
  MovimentacaoFormData,
  EstoquePosicao,
  AlertaEstoque,
  Localizacao,
} from '../types';

function buildMovimentacaoPayload(data: MovimentacaoFormData) {
  switch (data.tipo) {
    case 'ENTRADA':
      return {
        endpoint: '/estoque/entrada',
        payload: {
          produtoId: data.produtoId,
          quantidade: data.quantidade,
          localizacaoDestino: data.localizacaoDestino,
          observacoes: data.observacoes,
        },
      };
    case 'SAIDA':
      return {
        endpoint: '/estoque/saida',
        payload: {
          produtoId: data.produtoId,
          quantidade: data.quantidade,
          localizacaoOrigem: data.localizacaoOrigem,
          observacoes: data.observacoes,
        },
      };
    case 'TRANSFERENCIA':
      return {
        endpoint: '/estoque/transferencia',
        payload: {
          produtoId: data.produtoId,
          quantidade: data.quantidade,
          localizacaoOrigem: data.localizacaoOrigem,
          localizacaoDestino: data.localizacaoDestino,
          observacoes: data.observacoes,
        },
      };
    case 'AJUSTE':
      return {
        endpoint: '/estoque/ajuste',
        payload: {
          produtoId: data.produtoId,
          quantidade: data.quantidade,
          localizacao: data.localizacaoOrigem || data.localizacaoDestino,
          observacoes: data.observacoes || 'Ajuste manual',
        },
      };
  }
}

export const estoqueApi = {
  resumo(): Promise<EstoqueResumo> {
    return api.get('/estoque/resumo').then((r) => r.data);
  },

  alertas(): Promise<AlertaEstoque[]> {
    return api.get('/estoque/alertas').then((r) => r.data);
  },

  posicaoAtual(localizacao?: Localizacao, categoriaId?: number): Promise<EstoquePosicao[]> {
    return api
      .get('/estoque', { params: { localizacao, categoriaId } })
      .then((r) => r.data);
  },

  historicoProduto(
    produtoId: string,
    pageable?: { page?: number; size?: number }
  ): Promise<SpringPage<Movimentacao>> {
    return api
      .get(`/estoque/produto/${produtoId}`, { params: pageable })
      .then((r) => r.data);
  },

  criarMovimentacao(data: MovimentacaoFormData): Promise<Movimentacao> {
    const { endpoint, payload } = buildMovimentacaoPayload(data);
    return api.post(endpoint, payload).then((r) => r.data);
  },

  inventario(localizacao?: Localizacao): Promise<EstoquePosicao[]> {
    return api
      .get('/estoque/inventario', { params: localizacao ? { localizacao } : undefined })
      .then((r) => r.data);
  },

  ajuste(data: {
    produtoId: string;
    quantidade: number;
    localizacao: Localizacao;
    observacoes: string;
  }): Promise<Movimentacao> {
    return api.post('/estoque/ajuste', data).then((r) => r.data);
  },
};

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
  totalPages: number;
}
