// Copies MapLibre's web worker to /public so the browser can load it from a
// stable URL (bundlers move files, which breaks MapLibre's default lookup).
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve('maplibre-gl/package.json'));
const { version } = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'vendor');
mkdirSync(outDir, { recursive: true });
copyFileSync(
  join(pkgDir, 'dist', 'maplibre-gl-worker.mjs'),
  join(outDir, `maplibre-gl-worker-${version}.mjs`),
);
console.log(`MapLibre worker ${version} copied to public/vendor`);
