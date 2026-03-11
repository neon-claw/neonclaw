import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:5199/poster/';
const out = process.argv[3] || 'public/neonclaw-meetup-poster.png';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 800 }, deviceScaleFactor: 3 });
await page.goto(url, { waitUntil: 'networkidle' });

// Hide nav and outer wrapper, screenshot only the poster div
await page.evaluate(() => {
  document.querySelector('nav')?.remove();
  const wrapper = document.querySelector('[data-canvas-size]')?.parentElement;
  if (wrapper) {
    wrapper.style.padding = '0';
    wrapper.style.display = 'block';
  }
});

const poster = page.locator('[data-canvas-size]');
await poster.screenshot({ path: out, type: 'png' });

await browser.close();
console.log(`Screenshot saved to ${out}`);
