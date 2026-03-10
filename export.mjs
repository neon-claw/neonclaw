import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:5199/poster/';
const output = process.argv[3] || 'neonclaw-meetup-poster.png';
const scale = Number(process.argv[4]) || 3;

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: scale });
await page.goto(url, { waitUntil: 'networkidle' });

await page.locator('[data-toolbar]').evaluate(el => el.style.display = 'none');
const poster = await page.locator('.seede-root');
await poster.screenshot({ path: output, type: 'png', timeout: 120000 });

console.log(`Exported: ${output} @ ${scale}x`);
await browser.close();
