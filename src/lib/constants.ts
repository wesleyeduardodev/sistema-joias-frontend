export const API_BASE_URL = 'http://localhost:8080/api/v1';

export const ROLES = {
  ADMIN: 'ADMIN',
  VENDEDOR: 'VENDEDOR',
  REPRESENTANTE: 'REPRESENTANTE',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  REPRESENTANTE: 'Representante',
};
