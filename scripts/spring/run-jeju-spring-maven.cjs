const { spawnSync } = require('node:child_process');
const path = require('node:path');

const goals = process.argv.slice(2);

if (goals.length === 0) {
  console.error('Usage: node scripts/spring/run-jeju-spring-maven.cjs <goal...>');
  process.exit(1);
}

const cwd = path.resolve(__dirname, '../../jeju-spring');
const command = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';

const result = spawnSync(command, goals, {
  cwd,
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
