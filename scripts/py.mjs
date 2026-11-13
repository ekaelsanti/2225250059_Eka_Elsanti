// Menjalankan Python dari virtual environment mesin matematika, di Windows maupun macOS/Linux.
// Pemakaian: node scripts/py.mjs -m mathengine build-content
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const engineDir = join(root, 'services', 'math-engine');
const venvPython =
  process.platform === 'win32'
    ? join(engineDir, '.venv', 'Scripts', 'python.exe')
    : join(engineDir, '.venv', 'bin', 'python');

if (!existsSync(venvPython)) {
  console.error(
    'Virtual environment Python belum ada. Jalankan dulu:\n' +
      '  cd services/math-engine && python -m venv .venv && pip install -e ".[dev]"',
  );
  process.exit(1);
}

const result = spawnSync(venvPython, process.argv.slice(2), { cwd: engineDir, stdio: 'inherit' });
process.exit(result.status ?? 1);
