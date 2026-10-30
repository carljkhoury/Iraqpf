// Fails if any message key exists in one locale but not the other, or is empty.
// Runs in CI so a missing translation can never ship (architecture §5).
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'messages');
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

function flatten(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' ? flatten(value, path) : [[path, value]];
  });
}

const catalogs = Object.fromEntries(
  files.map((f) => [
    f.replace('.json', ''),
    new Map(flatten(JSON.parse(readFileSync(join(dir, f), 'utf8')))),
  ]),
);
const allKeys = new Set(Object.values(catalogs).flatMap((m) => [...m.keys()]));

const problems = [];
for (const [locale, messages] of Object.entries(catalogs)) {
  for (const key of allKeys) {
    if (!messages.has(key)) problems.push(`[${locale}] missing: ${key}`);
    else if (String(messages.get(key)).trim() === '') problems.push(`[${locale}] empty: ${key}`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} translation problem(s).`);
  process.exit(1);
}
console.log(`i18n OK: ${allKeys.size} keys in ${Object.keys(catalogs).join(', ')}.`);
