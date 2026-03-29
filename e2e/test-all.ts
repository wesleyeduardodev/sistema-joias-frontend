import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const SHOTS = 'e2e/screenshots';

async function run() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results: string[] = [];
  function log(msg: string) { console.log(msg); results.push(msg); }

  // 1. LOGIN
  log('\n=== TELA: Login ===');
  await page.goto(`${BASE}/login`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SHOTS}/01-login.png` });

  const loginVisible = await page.locator('button:has-text("Entrar"), button:has-text("ENTRAR")').isVisible();
  log(loginVisible ? '  OK — Botao Entrar visivel' : '  ERRO — Botao Entrar nao encontrado');

  // Fazer login
  log('\n=== ACAO: Fazer login ===');
  await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'admin@joias.com');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.screenshot({ path: `${SHOTS}/02-login-preenchido.png` });
  await page.click('button:has-text("Entrar"), button:has-text("ENTRAR")');

  try {
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    log('  OK — Login bem sucedido, redirecionou para: ' + page.url());
  } catch {
    log('  ERRO — Login falhou, ainda em: ' + page.url());
    await page.screenshot({ path: `${SHOTS}/02b-login-falhou.png` });
  }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SHOTS}/03-dashboard.png` });

  // Testar cada rota
  const rotas = [
    { path: '/catalogo', nome: 'Catalogo Listagem' },
    { path: '/catalogo/novo', nome: 'Catalogo Novo Produto (Stepper)' },
    { path: '/estoque', nome: 'Estoque Visao Geral' },
    { path: '/estoque/movimentacoes', nome: 'Estoque Movimentacoes' },
    { path: '/estoque/inventario', nome: 'Estoque Inventario' },
    { path: '/configuracoes/cotacoes', nome: 'Cotacoes' },
    { path: '/vendas', nome: 'Vendas (placeholder)' },
    { path: '/consignacao', nome: 'Consignacao (placeholder)' },
    { path: '/representantes', nome: 'Representantes (placeholder)' },
    { path: '/clientes', nome: 'Clientes (placeholder)' },
    { path: '/configuracoes', nome: 'Configuracoes (placeholder)' },
  ];

  for (let i = 0; i < rotas.length; i++) {
    const r = rotas[i];
    const num = String(i + 4).padStart(2, '0');
    log(`\n=== TELA: ${r.nome} (${r.path}) ===`);

    await page.goto(`${BASE}${r.path}`);
    await page.waitForTimeout(3000);

    const body = await page.textContent('body') ?? '';
    const hasError = body.includes('Cannot read properties') ||
                     body.includes('Unhandled Runtime Error') ||
                     body.includes('Application error') ||
                     body.includes('Something went wrong');

    await page.screenshot({ path: `${SHOTS}/${num}-${r.nome.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}.png` });

    if (hasError) {
      log(`  ERRO — Erro de JS visivel na tela`);
    } else {
      log(`  OK — Carregou sem erros`);
    }
  }

  // Teste especifico: cadastrar produto (stepper)
  log('\n=== TESTE: Cadastro de produto (stepper navegacao) ===');
  await page.goto(`${BASE}/catalogo/novo`);
  await page.waitForTimeout(2000);

  // Etapa 1 - tentar avancar sem preencher
  await page.click('button:has-text("Proximo")');
  await page.waitForTimeout(1000);
  const aindaEtapa1 = await page.locator('text=BASICO').first().isVisible();
  log(aindaEtapa1 ? '  OK — Validacao impediu avancar sem dados' : '  WARN — Avancou sem validar');
  await page.screenshot({ path: `${SHOTS}/15-stepper-validacao.png` });

  // RESUMO
  log('\n\n========================================');
  log('        RESULTADO FINAL');
  log('========================================');
  const oks = results.filter(r => r.includes('  OK')).length;
  const erros = results.filter(r => r.includes('  ERRO')).length;
  log(`\nOK: ${oks} | ERRO: ${erros} | Total: ${oks + erros}`);
  log(`Screenshots em: ${SHOTS}/`);

  await page.waitForTimeout(3000);
  await browser.close();
}

run().catch(console.error);
