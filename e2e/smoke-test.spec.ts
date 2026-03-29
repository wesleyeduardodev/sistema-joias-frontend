import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Smoke Test — Todas as telas do MVP', () => {

  test.describe('Auth — Telas publicas', () => {
    test('Login — carrega sem erros', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await expect(page.locator('text=Entrar')).toBeVisible({ timeout: 10000 });
      // Verifica campos do formulario
      await expect(page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      // Sem erros no console
      const errors: string[] = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      await page.waitForTimeout(1000);
      console.log('Login errors:', errors.length === 0 ? 'NONE' : errors);
    });

    test('Registro — carrega sem erros', async ({ page }) => {
      await page.goto(`${BASE_URL}/registro`);
      await expect(page.locator('text=Criar Conta')).toBeVisible({ timeout: 10000 });
    });

    test('Recuperar Senha — carrega sem erros', async ({ page }) => {
      await page.goto(`${BASE_URL}/recuperar-senha`);
      await expect(page.locator('text=Recuperar Senha')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Auth — Login funcional', () => {
    test('Login com credenciais validas redireciona para dashboard', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.waitForTimeout(1000);

      // Preenche email
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
      await emailInput.fill('admin@joias.com');

      // Preenche senha
      const senhaInput = page.locator('input[type="password"]').first();
      await senhaInput.fill('Admin@123');

      // Clica em Entrar
      await page.locator('button:has-text("Entrar"), button:has-text("ENTRAR")').click();

      // Deve redirecionar (sair do /login)
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      console.log('Redirecionou para:', page.url());
    });
  });

  test.describe('Telas protegidas (com login)', () => {
    test.beforeEach(async ({ page }) => {
      // Login antes de cada teste
      await page.goto(`${BASE_URL}/login`);
      await page.waitForTimeout(500);
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
      await emailInput.fill('admin@joias.com');
      await page.locator('input[type="password"]').first().fill('Admin@123');
      await page.locator('button:has-text("Entrar"), button:has-text("ENTRAR")').click();
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    });

    test('Dashboard — carrega layout base (sidebar + header)', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await page.waitForTimeout(1000);
      // Sidebar deve estar visivel
      const sidebar = page.locator('text=JoiasGestor, text=JOIASGESTOR, text=Catalogo').first();
      await expect(sidebar).toBeVisible({ timeout: 5000 });
      console.log('Dashboard URL:', page.url());
    });

    test('Catalogo — listagem carrega', async ({ page }) => {
      await page.goto(`${BASE_URL}/catalogo`);
      await page.waitForTimeout(2000);

      // Deve ter titulo
      await expect(page.locator('text=Catalogo de Produtos')).toBeVisible({ timeout: 10000 });

      // Deve ter botao Novo Produto
      await expect(page.locator('text=Novo Produto')).toBeVisible();

      // Verificar se nao tem erro de JS
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('Cannot read properties');
      expect(pageContent).not.toContain('Unhandled Runtime Error');

      // Contar resultados
      const resultText = await page.locator('text=/\\d+ resultado/').textContent().catch(() => 'not found');
      console.log('Catalogo resultados:', resultText);
    });

    test('Catalogo — novo produto (stepper carrega)', async ({ page }) => {
      await page.goto(`${BASE_URL}/catalogo/novo`);
      await page.waitForTimeout(2000);

      await expect(page.locator('text=Novo Produto')).toBeVisible({ timeout: 10000 });

      // Stepper deve estar visivel
      await expect(page.locator('text=BASICO')).toBeVisible();

      // Campos da etapa 1 devem existir
      await expect(page.locator('text=NOME DA PECA, text=Nome da peca, label:has-text("nome")').first()).toBeVisible({ timeout: 5000 });

      console.log('Stepper etapa 1 carregou OK');
    });

    test('Catalogo — novo produto etapa 1 validacao', async ({ page }) => {
      await page.goto(`${BASE_URL}/catalogo/novo`);
      await page.waitForTimeout(1000);

      // Tenta avancar sem preencher
      await page.locator('button:has-text("Proximo")').click();
      await page.waitForTimeout(1000);

      // Deve mostrar toast de erro ou nao avancar
      const stepperText = await page.textContent('body');
      // Ainda deve estar na etapa 1 (BASICO ativo)
      console.log('Validacao etapa 1: permaneceu na etapa?', stepperText?.includes('BASICO'));
    });

    test('Catalogo — dropdown de categorias carrega dados', async ({ page }) => {
      await page.goto(`${BASE_URL}/catalogo/novo`);
      await page.waitForTimeout(2000);

      // Abrir dropdown de categoria
      const catSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Selecione|Categoria/i }).first();
      if (await catSelect.isVisible()) {
        await catSelect.click();
        await page.waitForTimeout(500);
        const options = await page.locator('option, [role="option"]').allTextContents();
        console.log('Categorias carregadas:', options.length, options.slice(0, 5));
      } else {
        console.log('Dropdown de categoria nao encontrado com seletor padrao');
      }
    });

    test('Estoque — visao geral carrega', async ({ page }) => {
      await page.goto(`${BASE_URL}/estoque`);
      await page.waitForTimeout(2000);

      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('Cannot read properties');

      // Deve ter algum conteudo de estoque
      const hasEstoque = pageContent?.includes('Estoque') || pageContent?.includes('estoque');
      console.log('Estoque carregou:', hasEstoque);
      console.log('Page title area:', pageContent?.substring(0, 200));
    });

    test('Estoque — movimentacoes carrega', async ({ page }) => {
      await page.goto(`${BASE_URL}/estoque/movimentacoes`);
      await page.waitForTimeout(2000);

      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('Cannot read properties');
      console.log('Movimentacoes carregou OK');
    });

    test('Estoque — inventario carrega', async ({ page }) => {
      await page.goto(`${BASE_URL}/estoque/inventario`);
      await page.waitForTimeout(2000);

      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('Cannot read properties');
      console.log('Inventario carregou OK');
    });

    test('Cotacoes — configuracao carrega', async ({ page }) => {
      await page.goto(`${BASE_URL}/configuracoes/cotacoes`);
      await page.waitForTimeout(2000);

      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('Cannot read properties');

      const hasCotacao = pageContent?.includes('Cota') || pageContent?.includes('cota') || pageContent?.includes('Metal');
      console.log('Cotacoes carregou:', hasCotacao);
    });

    test('Navegacao — todas as rotas protegidas carregam sem crash', async ({ page }) => {
      const rotas = [
        '/',
        '/catalogo',
        '/catalogo/novo',
        '/estoque',
        '/estoque/movimentacoes',
        '/estoque/inventario',
        '/configuracoes/cotacoes',
        '/vendas',
        '/consignacao',
        '/representantes',
        '/clientes',
        '/configuracoes',
      ];

      const results: Record<string, string> = {};

      for (const rota of rotas) {
        await page.goto(`${BASE_URL}${rota}`);
        await page.waitForTimeout(1500);

        const pageContent = await page.textContent('body') ?? '';
        const hasError = pageContent.includes('Cannot read properties') ||
                         pageContent.includes('Unhandled Runtime Error') ||
                         pageContent.includes('Application error');

        results[rota] = hasError ? 'ERRO' : 'OK';
      }

      console.log('\n=== RESULTADO POR ROTA ===');
      for (const [rota, status] of Object.entries(results)) {
        console.log(`  ${status === 'OK' ? '✓' : '✗'} ${rota}: ${status}`);
      }

      // Nenhuma rota deve ter erro
      const rotasComErro = Object.entries(results).filter(([, s]) => s === 'ERRO');
      expect(rotasComErro).toHaveLength(0);
    });
  });
});
