import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

export function prepareStoreRoutes(root) {
  const app = path.join(root, 'app');
  const group = path.join(app, '(store)');
  if (!fs.existsSync(path.join(group, 'layout.tsx')) || !fs.existsSync(path.join(group, 'page.tsx'))) {
    throw new Error('Store route group is incomplete. Upload the complete update before building. No files were changed.');
  }
  const duplicates = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Unexpected symbolic link in store routes. No files were changed.');
      if (entry.isDirectory()) visit(file);
      else if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        const relative = path.relative(group, file);
        const legacyDirectory = path.join(app, path.dirname(relative));
        for (const ext of ['tsx', 'ts', 'jsx', 'js']) {
          const legacy = path.join(legacyDirectory, `page.${ext}`);
          if (fs.existsSync(legacy) && legacy !== file) duplicates.push(legacy);
        }
      }
    }
  }
  visit(group);
  const files = [...new Set(duplicates)];
  if (!files.length) { console.log('Store routes ready: no legacy duplicate pages.'); return []; }
  const backup = path.join(root, '.bridgecare-route-backup', `${Date.now()}-${randomUUID()}`);
  for (const file of files) {
    const target = path.join(backup, path.relative(root, file) + '.bak');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(file, target);
  }
  console.log(`Store routes ready: moved ${files.length} legacy duplicate pages to .bridgecare-route-backup. Store group pages are used; API and verification routes are untouched.`);
  return files.map(file => path.relative(root, file));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prepareStoreRoutes(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
}
