export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'GERENTE' | 'VENDEDOR' | 'REPRESENTANTE';
  telefone?: string;
  cpf?: string;
  ativo: boolean;
  percentualComissaoPadrao?: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}
