const { execFileSync } = require('node:child_process');
const path = require('path');
const { mirrorFrontToThymeleaf } = require('./mirror-front-to-thymeleaf.cjs');

const rootDir = path.resolve(__dirname, '../../');

async function syncFrontAssetsToSpring() {
  execFileSync('pnpm', ['run', 'build:front'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  await mirrorFrontToThymeleaf(['--skip-build-shell']);
}

if (require.main === module) {
  syncFrontAssetsToSpring().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { syncFrontAssetsToSpring };
