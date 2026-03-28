export type TipoMetal = 'OURO' | 'PRATA' | 'PLATINA' | 'ACO' | 'TITANIO' | 'OUTRO';

export interface Cotacao {
  id: number;
  tipoMetal: TipoMetal;
  quilatagem: string;
  precoGrama: number;
  dataCotacao: string;
  fonte: string;
  criadoEm: string;
}

export interface CotacaoFormData {
  tipoMetal: TipoMetal;
  quilatagem: string;
  precoGrama: number;
  dataCotacao: string;
  fonte: string;
}
