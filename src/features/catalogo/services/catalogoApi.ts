import api from '@/lib/api';
import type {
  Produto,
  ProdutoFiltros,
  ProdutoListResponse,
  ProdutoFormData,
  ProdutoCreatePayload,
  Categoria,
  Material,
  Pedra,
} from '../types';

// --- Enum mapping helpers ---

const acabamentoMap: Record<string, string> = {
  Polido: 'POLIDO',
  'Fosco/Acetinado': 'FOSCO',
  Escovado: 'ESCOVADO',
  Diamantado: 'DIAMANTADO',
  Texturizado: 'TEXTURIZADO',
  Martelado: 'MARTELADO',
};

const tipoCravacaoMap: Record<string, string> = {
  Garra: 'GARRA',
  'Cravacao inglesa': 'INGLESA',
  Pave: 'PAVE',
  Trilho: 'TRILHO',
  Invisivel: 'INVISIVEL',
  Nenhuma: 'NENHUMA',
};

const tipoFechoMap: Record<string, string> = {
  Trava: 'TRAVA',
  Mosquetao: 'MOSQUETAO',
  Pressao: 'PRESSAO',
  Rosca: 'ROSCA',
  Gaveta: 'GAVETA',
  Nenhum: 'NENHUM',
};

const certificadoraMap: Record<string, string> = {
  GIA: 'GIA',
  IGI: 'IGI',
  HRD: 'HRD',
  IBGM: 'IBGM',
  Outro: 'OUTRO',
};

function mapEnum(value: string, map: Record<string, string>): string {
  return map[value] || value;
}

function transformFormToApi(data: ProdutoFormData): ProdutoCreatePayload {
  return {
    codigoInterno: data.codigoSku,
    numeroSerie: data.numeroSerie,
    nome: data.nome,
    descricao: data.descricao,
    categoriaId: data.categoriaId,
    subcategoriaId: data.subcategoriaId || undefined,
    materialId: data.materialId,
    pesoTotalGramas: data.pesoTotal,
    pesoMetalGramas: data.pesoMetal,
    tamanho: data.tamanho,
    acabamento: mapEnum(data.acabamento, acabamentoMap),
    tipoCravacao: mapEnum(data.tipoCravacao, tipoCravacaoMap),
    tipoFecho: mapEnum(data.tipoFecho, tipoFechoMap),
    tipoProduto: data.tipoProduto,
    custoMaoObra: data.custoMaoObra,
    custosIndiretos: data.custosIndiretos,
    markup: data.markup,
    precoVenda: data.precoFinal,
    precoVendaSugerido: data.precoConsignacao,
    genero: data.genero,
    personalizavel: data.personalizavel,
    destaque: data.destaque,
    pedras: data.pedras.map((p) => ({
      pedraId: p.pedraId,
      quantidade: p.quantidade,
      quilatesTotal: p.peso,
      lapidacao: p.lapidacao,
      corGrau: p.cor,
      purezaGrau: p.pureza,
    })),
    certificados:
      data.certificacao?.instituicao
        ? [
            {
              entidadeCertificadora: mapEnum(
                data.certificacao.instituicao,
                certificadoraMap
              ),
              numeroCertificado: data.certificacao.numero,
              dataEmissao: data.certificacao.dataEmissao || undefined,
            },
          ]
        : [],
  };
}

export const catalogoApi = {
  listar(filtros: ProdutoFiltros): Promise<ProdutoListResponse> {
    const params: Record<string, unknown> = {};
    if (filtros.busca) params.q = filtros.busca;
    if (filtros.categoriaId) params.categoriaId = filtros.categoriaId;
    if (filtros.materialId) params.materialId = filtros.materialId;
    if (filtros.tipoProduto) params.tipoProduto = filtros.tipoProduto;
    if (filtros.genero) params.genero = filtros.genero;
    if (filtros.precoMin) params.precoMin = filtros.precoMin;
    if (filtros.precoMax) params.precoMax = filtros.precoMax;
    if (filtros.acabamento) params.acabamento = filtros.acabamento;
    if (filtros.destaque !== undefined) params.destaque = filtros.destaque;
    // Spring Pageable: page (0-based), size
    params.page = (filtros.pagina ?? 1) - 1;
    params.size = filtros.porPagina ?? 12;
    if (filtros.ordenarPor) params.sort = `${filtros.ordenarPor},${filtros.ordem ?? 'asc'}`;
    return api
      .get('/produtos', { params })
      .then((r) => r.data);
  },

  buscarPorId(id: number): Promise<Produto> {
    return api.get(`/produtos/${id}`).then((r) => r.data);
  },

  criar(data: ProdutoFormData): Promise<Produto> {
    const payload = transformFormToApi(data);
    return api.post('/produtos', payload).then((r) => r.data);
  },

  atualizar(id: number, data: Partial<ProdutoFormData>): Promise<Produto> {
    return api.put(`/produtos/${id}`, data).then((r) => r.data);
  },

  excluir(id: number): Promise<void> {
    return api.delete(`/produtos/${id}`).then(() => undefined);
  },

  uploadImagens(produtoId: number, files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((file) => formData.append('imagens', file));
    return api
      .post(`/produtos/${produtoId}/imagens`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  listarCategorias(): Promise<Categoria[]> {
    return api.get('/categorias').then((r) => r.data);
  },

  listarMateriais(): Promise<Material[]> {
    return api.get('/materiais').then((r) => r.data);
  },

  listarPedras(): Promise<Pedra[]> {
    return api.get('/pedras').then((r) => r.data);
  },
};
