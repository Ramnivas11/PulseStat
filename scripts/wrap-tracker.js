const fs = require('fs');
const path = require('path');

const trackerPath = path.join(process.cwd(), 'dist', 'tracker.js');
const generatedPath = path.join(process.cwd(), 'src', 'tracker', 'generated.ts');

try {
  const code = fs.readFileSync(trackerPath, 'utf8');
  const tsCode = `export const trackerCode = ${JSON.stringify(code)};`;
  fs.writeFileSync(generatedPath, tsCode);
  console.log('✅ Successfully wrapped tracker.js into src/tracker/generated.ts');
} catch (error) {
  console.error('❌ Failed to wrap tracker.js:', error);
  process.exit(1);
}
