const { execFileSync } = require('node:child_process');
const fs = require('fs-extra');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const springDir = path.join(rootDir, 'jeju-spring');
const springBuildDir = path.join(springDir, 'build');
const springLibDir = path.join(springBuildDir, 'libs');
const springWarAliasPath = path.join(springBuildDir, 'jeju-spring.war');

const isWarFile = (fileName) => fileName.toLowerCase().endsWith('.war') && !fileName.toLowerCase().endsWith('-plain.war');

const resolveSpringWarSource = async () => {
  if (!(await fs.pathExists(springLibDir))) {
    return (await fs.pathExists(springWarAliasPath)) ? springWarAliasPath : null;
  }

  const entries = await fs.readdir(springLibDir, { withFileTypes: true });
  const warFiles = entries
    .filter((entry) => entry.isFile() && isWarFile(entry.name))
    .map((entry) => path.join(springLibDir, entry.name))
    .sort((left, right) => {
      const leftName = path.basename(left);
      const rightName = path.basename(right);
      const leftPriority = leftName.startsWith('jeju-spring-') ? 0 : 1;
      const rightPriority = rightName.startsWith('jeju-spring-') ? 0 : 1;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return leftName.localeCompare(rightName);
    });

  return warFiles[0] || ((await fs.pathExists(springWarAliasPath)) ? springWarAliasPath : null);
};

const createSpringWarAlias = async (sourceWarPath) => {
  if (sourceWarPath === springWarAliasPath) {
    return springWarAliasPath;
  }

  await fs.ensureDir(springBuildDir);
  await fs.copyFile(sourceWarPath, springWarAliasPath);
  return springWarAliasPath;
};

async function buildWar() {
  console.log('[BUILD] jeju-spring WAR 빌드 시작');

  try {
    execFileSync('pnpm', ['run', 'spring:war-package'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    const sourceWarPath = await resolveSpringWarSource();
    if (!sourceWarPath) {
      throw new Error('jeju-spring WAR 산출물을 찾지 못했습니다');
    }

    const aliasWarPath = await createSpringWarAlias(sourceWarPath);

    console.log('[BUILD] jeju-spring WAR 생성 완료');
    console.log(`[BUILD] 원본 산출물: ${sourceWarPath}`);
    console.log(`[BUILD] 고정 경로: ${aliasWarPath}`);
  } catch (error) {
    console.error('[ERROR] jeju-spring WAR 빌드 실패:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  buildWar();
}

module.exports = buildWar;
