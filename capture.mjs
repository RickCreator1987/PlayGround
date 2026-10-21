import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const runtime = join(process.env.HOME, '.local/share/omgithub-playwright');
const require = createRequire(join(runtime, 'package.json'));
const { chromium } = require('playwright');
const configPath = join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
if (process.platform === 'linux') {
  process.env.DISPLAY ||= ':' + readFileSync(join(runtime, 'display'), 'utf8').trim();
}

const url = process.env.CAPTURE_URL;
const output = process.env.CAPTURE_DIR;
if (!url || !output) {
  console.error('Set CAPTURE_URL and CAPTURE_DIR.');
  process.exit(1);
}
mkdirSync(output, { recursive: true });

const transient = (error) => {
  error.exitCode = 75;
  return error;
};

let browser;
try {
  browser = await chromium.launch({ ...config.browser.launchOptions, timeout: 30000 }).catch(transient);
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 }).catch(transient);
    page.setDefaultTimeout(30000);
    page.on('pageerror', (error) => console.error(`pageerror (${name}):`, error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') console.error(`console (${name}):`, message.text());
    });

    const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(transient);
    if (!response?.ok()) {
      const status = response?.status();
      throw Object.assign(new Error(`HTTP ${status || 'unknown'} loading ${url}`), {
        exitCode: !status || [408, 429, 500, 502, 503, 504].includes(status) ? 75 : 1,
      });
    }

    try {
      await page.waitForSelector('[data-app-ready="true"]', { state: 'attached', timeout: 30000 });
      await page.waitForSelector('main', { state: 'visible', timeout: 30000 });
    } catch (error) {
      throw Object.assign(new Error(`App did not render: ${error.message}`), { exitCode: 1 });
    }

    await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 30000 })
      .catch((error) => { throw Object.assign(new Error(`Fonts failed to load: ${error.message}`), { exitCode: 1 }); });
    await page.waitForTimeout(900);

    const rendered = await page.evaluate(() => ({
      ready: document.body.dataset.appReady,
      title: document.title,
      text: (document.body.innerText || '').trim().length,
      height: document.documentElement.scrollHeight,
    }));
    if (rendered.ready !== 'true' || rendered.text < 200) {
      throw Object.assign(new Error(`Blank or incomplete render: ${JSON.stringify(rendered)}`), { exitCode: 1 });
    }

    await page.screenshot({ path: join(output, `final-${name}.png`), timeout: 30000 }).catch((error) => {
      if (error.name === 'TimeoutError' || !browser?.isConnected()) throw transient(error);
      throw error;
    });
    console.log(`${name}: ${width}x${height} · ${rendered.title} · ${rendered.text} chars · height ${rendered.height}px`);
    await page.close();
  }
} catch (error) {
  console.error(error);
  process.exitCode = error.exitCode || 1;
} finally {
  await browser?.close().catch((error) => {
    console.error(error);
    process.exitCode ||= 75;
  });
}
