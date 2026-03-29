import { chromium } from '@playwright/test';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.resolve('e2e/screenshots');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results: { rota: string; status: string; erro?: string }[] = [];

  // Captura erros de console
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  // 1. LOGIN
  console.log('\n🔑 Testando Login...');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-login.png`, fullPage: true });
  results.push({ rota: '/login', status: 'OK' });

  // 2. FAZER LOGIN
  console.log('🔐 Fazendo login...');
  try {
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'admin@joias.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Entrar"), button:has-text("ENTRAR")');
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    console.log('   ✅ Login OK — redirecionou para:', page.url());
    results.push({ rota: 'Login funcional', status: 'OK' });
  } catch (e: any) {
    console.log('   ❌ Login FALHOU:', e.message);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/01b-login-erro.png`, fullPage: true });
    results.push({ rota: 'Login funcional', status: 'ERRO', erro: e.message });
  }

  // ROTAS PROTEGIDAS
  const rotas = [
    { path: '/', nome: 'Dashboard' },
    { path: '/catalogo', nome: 'Catalogo Listagem' },
    { path: '/catalogo/novo', nome: 'Catalogo Novo Produto' },
    { path: '/estoque', nome: 'Estoque Visao Geral' },
    { path: '/estoque/movimentacoes', nome: 'Estoque Movimentacoes' },
    { path: '/estoque/inventario', nome: 'Estoque Inventario' },
    { path: '/configuracoes/cotacoes', nome: 'Cotacoes Config' },
    { path: '/vendas', nome: 'Vendas' },
    { path: '/consignacao', nome: 'Consignacao' },
    { path: '/representantes', nome: 'Representantes' },
    { path: '/clientes', nome: 'Clientes' },
    { path: '/configuracoes', nome: 'Configuracoes' },
  ];

  for (let i = 0; i < rotas.length; i++) {
    const rota = rotas[i];
    const num = String(i + 2).padStart(2, '0');
    console.log(`📄 Testando ${rota.nome} (${rota.path})...`);

    pageErrors.length = 0;

    try {
      await page.goto(`${BASE_URL}${rota.path}`);
      await page.waitForTimeout(2500);

      const bodyText = await page.textContent('body') ?? '';
      const hasJsError = bodyText.includes('Cannot read properties') ||
                         bodyText.includes('Unhandled Runtime Error') ||
                         bodyText.includes('Application error');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${num}-${rota.nome.toLowerCase().replace(/\s+/g, '-')}.png`, fullPage: true });

      if (hasJsError) {
        console.log(`   ❌ ${rota.nome}: ERRO na tela`);
        results.push({ rota: rota.path, status: 'ERRO', erro: 'Erro visivel na tela' });
      } else if (pageErrors.length > 0) {
        console.log(`   ⚠️  ${rota.nome}: OK mas com erros no console: ${pageErrors[0]}`);
        results.push({ rota: rota.path, status: 'WARN', erro: pageErrors[0] });
      } else {
        console.log(`   ✅ ${rota.nome}: OK`);
        results.push({ rota: rota.path, status: 'OK' });
      }
    } catch (e: any) {
      console.log(`   ❌ ${rota.nome}: CRASH — ${e.message}`);
      results.push({ rota: rota.path, status: 'ERRO', erro: e.message });
    }
  }

  await browser.close();

  // RESUMO
  console.log('\n\n========================================');
  console.log('        RESULTADO DOS TESTES');
  console.log('========================================\n');

  const ok = results.filter(r => r.status === 'OK').length;
  const warn = results.filter(r => r.status === 'WARN').length;
  const erro = results.filter(r => r.status === 'ERRO').length;

  for (const r of results) {
    const icon = r.status === 'OK' ? '✅' : r.status === 'WARN' ? '⚠️ ' : '❌';
    console.log(`${icon} ${r.rota} — ${r.status}${r.erro ? ` (${r.erro})` : ''}`);
  }

  console.log(`\n✅ OK: ${ok} | ⚠️  WARN: ${warn} | ❌ ERRO: ${erro} | Total: ${results.length}`);
  console.log(`\nScreenshots salvas em: ${SCREENSHOTS_DIR}/`);
}

main().catch(console.error);
