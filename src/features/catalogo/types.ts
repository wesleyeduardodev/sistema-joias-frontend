export interface Categoria {
  id: number;
  nome: string;
  subcategorias: Subcategoria[];
}

export interface Subcategoria {
  id: number;
  nome: string;
  categoriaId: number;
}

export interface Material {
  id: number;
  nome: string;
  tipoMetal: string;
  quilatagem?: string;
  cor?: string;
  purezaPercentual?: number;
  ativo?: boolean;
}

export interface Pedra {
  id: number;
  nome: string;
  tipo: string;
  ativo?: boolean;
}

export interface PedraBase {
  id?: number;
  pedraId: number;
  tipo: string;
  quantidade: number;
  peso: number;
  tipoCravacao: string;
  lapidacao?: string;
  cor?: string;
  pureza?: string;
}

export interface Certificacao {
  instituicao: string;
  numero: string;
  dataEmissao: string;
  arquivoUrl?: string;
}

export interface ImagemProduto {
  id?: number;
  url: string;
  tipo: 'PRINCIPAL' | 'DETALHE' | 'MODELO' | 'CERTIFICADO';
  ordem: number;
  file?: File;
  preview?: string;
}

export interface Produto {
  id: number;
  nome: string;
  codigoSku: string;
  numeroSerie: string;
  categoriaId: number;
  categoria?: Categoria;
  subcategoriaId: number;
  subcategoria?: Subcategoria;
  tipoProduto: 'JOIA' | 'SEMIJOIA' | 'BIJUTERIA';
  genero: 'MASCULINO' | 'FEMININO' | 'UNISSEX';
  descricao: string;
  personalizavel: boolean;
  destaque: boolean;

  metalPrincipal: string;
  quilatagem?: string;
  corMetal: string;
  pesoTotal: number;
  pesoMetal: number;
  acabamento: string;
  tipoCravacao: string;
  tipoFecho: string;
  tamanho: string;

  pedras: PedraBase[];
  certificacao?: Certificacao;

  custoMetal: number;
  custoPedras: number;
  custoMaoObra: number;
  custosIndiretos: number;
  custoTotal: number;
  markup: number;
  precoCalculado: number;
  precoFinal: number;
  precoConsignacao: number;

  imagens: ImagemProduto[];

  status: 'ATIVO' | 'INATIVO' | 'BAIXO_ESTOQUE' | 'FORA_DE_LINHA';
  estoque: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProdutoFormData {
  nome: string;
  codigoSku: string;
  numeroSerie: string;
  categoriaId: number;
  subcategoriaId: number;
  tipoProduto: 'JOIA' | 'SEMIJOIA' | 'BIJUTERIA';
  genero: 'MASCULINO' | 'FEMININO' | 'UNISSEX';
  descricao: string;
  personalizavel: boolean;
  destaque: boolean;

  materialId: number;
  metalPrincipal: string;
  quilatagem: string;
  corMetal: string;
  pesoTotal: number;
  pesoMetal: number;
  acabamento: string;
  tipoCravacao: string;
  tipoFecho: string;
  tamanho: string;

  pedras: PedraBase[];
  certificacao: Certificacao;

  custoMetal: number;
  custoPedras: number;
  custoMaoObra: number;
  custosIndiretos: number;
  custoTotal: number;
  markup: number;
  precoCalculado: number;
  precoFinal: number;
  precoConsignacao: number;

  imagens: ImagemProduto[];
}

export interface ProdutoFiltros {
  busca?: string;
  categoriaId?: number;
  metal?: string;
  pedra?: string;
  faixaPrecoMin?: number;
  faixaPrecoMax?: number;
  tamanho?: string;
  disponibilidade?: string;
  pagina?: number;
  porPagina?: number;
  ordenarPor?: string;
  ordem?: 'asc' | 'desc';
}

export interface ProdutoListResponse {
  content: Produto[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ProdutoPedraCreatePayload {
  pedraId: number;
  quantidade: number;
  quilatesTotal: number;
  lapidacao?: string;
  corGrau?: string;
  purezaGrau?: string;
}

export interface CertificadoCreatePayload {
  entidadeCertificadora: string;
  numeroCertificado: string;
  dataEmissao?: string;
}

export interface ProdutoCreatePayload {
  codigoInterno: string;
  numeroSerie: string;
  nome: string;
  descricao: string;
  categoriaId: number;
  subcategoriaId?: number;
  materialId: number;
  pesoTotalGramas: number;
  pesoMetalGramas: number;
  tamanho: string;
  acabamento: string;
  tipoCravacao: string;
  tipoFecho: string;
  tipoProduto: string;
  custoMaoObra: number;
  custosIndiretos: number;
  markup: number;
  precoVenda: number;
  precoVendaSugerido: number;
  genero: string;
  personalizavel: boolean;
  destaque: boolean;
  pedras: ProdutoPedraCreatePayload[];
  certificados: CertificadoCreatePayload[];
}
