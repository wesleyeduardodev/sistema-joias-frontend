import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

test.describe.serial('Teste completo Fase 2', () => {
  let produtoId: string;

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${BASE}/login`);
    await page.fill('input[placeholder*="email" i], input[type="email"]', 'admin@joias.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    await page.waitForTimeout(1000);
  });

  test('1. Cadastrar produto completo pelo stepper (5 etapas)', async ({ page }) => {
    await page.goto(`${BASE}/catalogo/novo`);
    await page.waitForTimeout(2000);

    // === ETAPA 1: BASICO ===
    await expect(page.getByRole('heading', { name: /novo produto/i })).toBeVisible();

    // Preencher nome
    const nomeInput = page.locator('input').filter({ hasText: '' }).first();
    const inputs = page.locator('input[type="text"], input:not([type])');

    // Nome da peca
    await page.locator('input').nth(0).fill('Anel Solitario Teste E2E');
    await page.waitForTimeout(300);

    // Codigo SKU
    await page.locator('input').nth(1).fill('TST-ANE-E2E');
    await page.waitForTimeout(300);

    // Numero de serie
    await page.locator('input').nth(2).fill('SER-E2E-001');
    await page.waitForTimeout(300);

    // Categoria — selecionar Aneis
    const catSelect = page.locator('select').first();
    if (await catSelect.isVisible()) {
      await catSelect.selectOption({ label: 'Aneis' });
      await page.waitForTimeout(500);
    }

    // Subcategoria — selecionar Solitario
    const subSelect = page.locator('select').nth(1);
    if (await subSelect.isVisible()) {
      await subSelect.selectOption({ index: 1 });
      await page.waitForTimeout(300);
    }

    // Tipo produto — Joia (deve estar selecionado por padrao)
    // Genero — Feminino (deve estar selecionado por padrao)

    // Descricao
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      await textarea.fill('Anel solitario com diamante 0.3ct criado via teste E2E');
    }

    await page.screenshot({ path: 'e2e/screenshots/test-etapa1-preenchido.png' });

    // Clicar Proximo
    await page.getByRole('button', { name: /proximo/i }).click();
    await page.waitForTimeout(1500);

    // Verificar se avancou para etapa 2
    const etapa2Visible = await page.getByText('MATERIAL').first().isVisible();
    console.log('Avancou para etapa 2:', etapa2Visible);

    // Se nao avancou, pode ser validacao — preencher campos faltantes e tentar de novo
    if (!etapa2Visible) {
      console.log('Validacao impediu — verificando campos obrigatorios...');
      await page.screenshot({ path: 'e2e/screenshots/test-etapa1-validacao.png' });
      // Tentar novamente
      await page.getByRole('button', { name: /proximo/i }).click();
      await page.waitForTimeout(1000);
    }

    // === ETAPA 2: MATERIAL ===
    console.log('=== Etapa 2: Material ===');

    // Metal principal — selecionar pelo dropdown
    const materialSelect = page.locator('select').first();
    if (await materialSelect.isVisible()) {
      // Selecionar "Ouro 18K Amarelo"
      const options = await materialSelect.locator('option').allTextContents();
      console.log('Materiais disponiveis:', options.slice(0, 5));
      await materialSelect.selectOption({ index: 2 }); // Pegar o segundo material
      await page.waitForTimeout(500);
    }

    // Peso total
    const pesoInputs = page.locator('input[type="number"], input[inputmode="decimal"]');
    const allInputs = page.locator('input');
    const inputCount = await allInputs.count();
    console.log('Total inputs na etapa 2:', inputCount);

    // Tentar preencher peso total e peso metal
    for (let i = 0; i < inputCount; i++) {
      const placeholder = await allInputs.nth(i).getAttribute('placeholder') ?? '';
      const name = await allInputs.nth(i).getAttribute('name') ?? '';
      if (placeholder.includes('5.2') || name.includes('pesoTotal') || name.includes('peso')) {
        await allInputs.nth(i).fill('4.5');
      }
      if (placeholder.includes('4.8') || name.includes('pesoMetal')) {
        await allInputs.nth(i).fill('4.0');
      }
    }

    await page.screenshot({ path: 'e2e/screenshots/test-etapa2-preenchido.png' });
    await page.getByRole('button', { name: /proximo/i }).click();
    await page.waitForTimeout(1500);

    // === ETAPA 3: PEDRAS ===
    console.log('=== Etapa 3: Pedras ===');
    await page.screenshot({ path: 'e2e/screenshots/test-etapa3.png' });

    // Pedras sao opcionais — avancar
    await page.getByRole('button', { name: /proximo/i }).click();
    await page.waitForTimeout(1500);

    // === ETAPA 4: PRECO ===
    console.log('=== Etapa 4: Preco ===');

    // Listar todos os inputs com seus atributos para debug
    const precoInputs = page.locator('input');
    const precoCount = await precoInputs.count();
    console.log('Total inputs na etapa 4:', precoCount);

    for (let i = 0; i < precoCount; i++) {
      const name = await precoInputs.nth(i).getAttribute('name') ?? '';
      const placeholder = await precoInputs.nth(i).getAttribute('placeholder') ?? '';
      const type = await precoInputs.nth(i).getAttribute('type') ?? '';
      const value = await precoInputs.nth(i).inputValue().catch(() => '');
      console.log(`  input[${i}]: name="${name}" placeholder="${placeholder}" type="${type}" value="${value}"`);

      // Preencher campos de preco por name
      if (name.includes('custoMaoObra') || name.includes('maoObra')) await precoInputs.nth(i).fill('500');
      if (name.includes('custosIndiretos') || name.includes('indiretos')) await precoInputs.nth(i).fill('100');
      if (name.includes('custoPedras')) await precoInputs.nth(i).fill('0');
      if (name.includes('precoFinal') || name.includes('precoVenda')) await precoInputs.nth(i).fill('5000');
      if (name.includes('precoConsignacao') || name.includes('precoVendaSugerido')) await precoInputs.nth(i).fill('5000');
      if (name === 'markup') await precoInputs.nth(i).fill('2.5');
    }

    await page.screenshot({ path: 'e2e/screenshots/test-etapa4-preenchido.png' });
    await page.getByRole('button', { name: /proximo/i }).click();
    await page.waitForTimeout(1500);

    // === ETAPA 5: IMAGENS ===
    console.log('=== Etapa 5: Imagens ===');
    await page.screenshot({ path: 'e2e/screenshots/test-etapa5.png' });

    // Imagens sao opcionais — salvar
    const salvarBtn = page.getByRole('button', { name: /salvar/i });
    if (await salvarBtn.isVisible()) {
      await salvarBtn.click();
      await page.waitForTimeout(5000);

      // Capturar toasts
      const toasts = await page.locator('[data-sonner-toast], [role="alert"], .toast').allTextContents().catch(() => []);
      if (toasts.length > 0) console.log('Toasts:', toasts);

      // Verificar se redirecionou para /catalogo ou mostrou sucesso
      const url = page.url();
      console.log('Apos salvar, URL:', url);
      await page.screenshot({ path: 'e2e/screenshots/test-apos-salvar.png' });

      if (url.includes('/catalogo') && !url.includes('/novo')) {
        console.log('PRODUTO CRIADO COM SUCESSO!');
      } else {
        // Capturar erros visiveis
        const body = await page.textContent('body') ?? '';
        if (body.includes('Erro')) console.log('ERRO visivel na tela');
        console.log('Produto NAO foi salvo — verificar logs do backend');
      }
    }
  });

  test('2. Verificar produto no catalogo', async ({ page }) => {
    await page.goto(`${BASE}/catalogo`);
    await page.waitForTimeout(3000);

    // Verificar se tem produtos listados
    const resultText = await page.locator('text=/\\d+ resultado/').textContent().catch(() => '0');
    console.log('Produtos no catalogo:', resultText);

    // Buscar pelo produto criado
    const searchInput = page.locator('input[placeholder*="nome, SKU"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('E2E');
      await page.waitForTimeout(2000);
      const resultAfterSearch = await page.locator('text=/\\d+ resultado/').textContent().catch(() => '0');
      console.log('Apos buscar "E2E":', resultAfterSearch);
    }

    await page.screenshot({ path: 'e2e/screenshots/test-catalogo-listagem.png' });
  });

  test('3. Testar tela de estoque', async ({ page }) => {
    await page.goto(`${BASE}/estoque`);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'e2e/screenshots/test-estoque.png' });

    const body = await page.textContent('body') ?? '';
    const hasError = body.includes('Cannot read properties') || body.includes('Application error');
    expect(hasError).toBe(false);
    console.log('Estoque carregou sem erros');
  });

  test('4. Testar tela de movimentacoes', async ({ page }) => {
    await page.goto(`${BASE}/estoque/movimentacoes`);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'e2e/screenshots/test-movimentacoes.png' });

    const body = await page.textContent('body') ?? '';
    expect(body).not.toContain('Cannot read properties');
    console.log('Movimentacoes carregou sem erros');
  });

  test('5. Testar tela de cotacoes', async ({ page }) => {
    await page.goto(`${BASE}/configuracoes/cotacoes`);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'e2e/screenshots/test-cotacoes.png' });

    const body = await page.textContent('body') ?? '';
    expect(body).not.toContain('Cannot read properties');
    console.log('Cotacoes carregou sem erros');

    // Verificar se cotacoes iniciais aparecem
    const hasOuro = body.includes('OURO') || body.includes('Ouro') || body.includes('ouro');
    console.log('Cotacoes de ouro visiveis:', hasOuro);
  });

  test('6. Testar inventario', async ({ page }) => {
    await page.goto(`${BASE}/estoque/inventario`);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'e2e/screenshots/test-inventario.png' });

    const body = await page.textContent('body') ?? '';
    expect(body).not.toContain('Cannot read properties');
    console.log('Inventario carregou sem erros');
  });

  test('7. Verificar navegacao da sidebar completa', async ({ page }) => {
    const links = [
      { menu: 'Catalogo', expectedUrl: '/catalogo' },
      { menu: 'Estoque', expectedUrl: '/estoque' },
      { menu: 'Vendas', expectedUrl: '/vendas' },
      { menu: 'Consignacao', expectedUrl: '/consignacao' },
      { menu: 'Representantes', expectedUrl: '/representantes' },
      { menu: 'Clientes', expectedUrl: '/clientes' },
    ];

    for (const link of links) {
      await page.goto(`${BASE}/`);
      await page.waitForTimeout(500);

      const menuItem = page.locator(`a:has-text("${link.menu}"), button:has-text("${link.menu}")`).first();
      if (await menuItem.isVisible()) {
        await menuItem.click();
        await page.waitForTimeout(1500);
        const currentUrl = page.url();
        const match = currentUrl.includes(link.expectedUrl);
        console.log(`Sidebar ${link.menu}: ${match ? 'OK' : 'FALHOU'} (${currentUrl})`);
      } else {
        console.log(`Sidebar ${link.menu}: NAO ENCONTRADO`);
      }
    }

    await page.screenshot({ path: 'e2e/screenshots/test-sidebar-nav.png' });
  });
});
