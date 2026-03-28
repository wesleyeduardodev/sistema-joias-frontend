export interface RegistroData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
