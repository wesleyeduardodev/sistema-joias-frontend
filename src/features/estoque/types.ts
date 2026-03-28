export interface EstoqueResumo {
  totalProdutos: number;
  totalPecas: number;
  porCategoria: ResumoCategoria[];
  porLocalizacao: ResumoLocalizacao[];
}

export interface ResumoCategoria {
  categoria: string;
  quantidade: number;
}

export interface ResumoLocalizacao {
  localizacao: string;
  quantidade: number;
}

export interface AlertaEstoque {
  produtoId: string;
  produtoNome: string;
  produtoCodigoInterno: string;
  tipo: string;
  mensagem: string;
}

export type TipoMovimentacao =
  | 'ENTRADA'
  | 'SAIDA'
  | 'TRANSFERENCIA'
  | 'AJUSTE'
  | 'RESERVA'
  | 'LIBERACAO_RESERVA';

export type Localizacao =
  | 'COFRE'
  | 'VITRINE'
  | 'REPRESENTANTE'
  | 'TRANSITO'
  | 'VENDIDO'
  | 'CONSIGNADO';

export interface Movimentacao {
  id: string;
  produtoId: string;
  produtoNome: string;
  produtoCodigoInterno: string;
  tipoMovimentacao: TipoMovimentacao;
  quantidade: number;
  localizacaoOrigem: Localizacao | null;
  localizacaoDestino: Localizacao | null;
  referenciaId: string | null;
  referenciaTipo: string | null;
  usuarioId: string | null;
  usuarioNome: string | null;
  observacoes: string | null;
  criadoEm: string;
}

export interface EntradaEstoquePayload {
  produtoId: string;
  quantidade: number;
  localizacaoDestino: Localizacao;
  observacoes?: string;
}

export interface SaidaEstoquePayload {
  produtoId: string;
  quantidade: number;
  localizacaoOrigem: Localizacao;
  observacoes?: string;
}

export interface TransferenciaPayload {
  produtoId: string;
  quantidade: number;
  localizacaoOrigem: Localizacao;
  localizacaoDestino: Localizacao;
  observacoes?: string;
}

export interface AjusteEstoquePayload {
  produtoId: string;
  quantidade: number;
  localizacao: Localizacao;
  observacoes: string;
}

export interface MovimentacaoFormData {
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'AJUSTE';
  produtoId: string;
  localizacaoOrigem: Localizacao | '';
  localizacaoDestino: Localizacao | '';
  quantidade: number;
  observacoes?: string;
}

export interface MovimentacaoFiltros {
  tipo?: string;
  produtoId?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina?: number;
  porPagina?: number;
}

export interface MovimentacaoListResponse {
  data: Movimentacao[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface EstoquePosicao {
  produtoId: string;
  produtoNome: string;
  produtoCodigoInterno: string;
  categoriaNome: string;
  materialNome: string;
  localizacao: Localizacao;
  saldo: number;
}
