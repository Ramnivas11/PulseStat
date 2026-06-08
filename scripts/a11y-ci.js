#!/usr/bin/env node
const { chromium } = require('playwright');
const axeSource = require('axe-core').source;

async function run() {
  const url = process.argv.find(a => a.startsWith('--url='))?.split('=')[1] || process.env.A11Y_URL || 'http://localhost:3000';
  console.log(`Running accessibility checks against ${url}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  // Inject axe-core
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    return await axe.run();
  });

  await browser.close();

  if (results.violations && results.violations.length > 0) {
    console.error(`Accessibility violations found: ${results.violations.length}`);
    results.violations.forEach(v => {
      console.error(`\nRule: ${v.id} - ${v.description}\nImpact: ${v.impact}\nHelp: ${v.help}\nNodes:\n`);
      v.nodes.forEach(n => console.error(` - ${n.html}\n   ${n.failureSummary}\n`));
    });
    process.exit(2);
  }

  console.log('No accessibility violations found.');
}

run().catch(err => {
  console.error('a11y-ci failed:', err);
  process.exit(1);
});
