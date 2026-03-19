const { execFileSync } = require('node:child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');

async function syncFrontAssetsToSpring() {
  execFileSync('pnpm', ['run', 'build:shell'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
}

if (require.main === module) {
  syncFrontAssetsToSpring().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { syncFrontAssetsToSpring };
