export interface User {
  id: number;
  nome: string;
  email: string;
  role: 'ADMIN' | 'VENDEDOR' | 'REPRESENTANTE';
  ativo: boolean;
  criadoEm: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}
