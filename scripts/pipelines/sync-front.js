const fs = require('fs-extra');
const path = require('path');
const { generateJspMirrors } = require('./lib/jsp-mirror');

const rootDir = path.resolve(__dirname, '../../');
const frontDir = path.join(rootDir, 'front');
const generatedWebappOverlayDir = path.join(frontDir, '.generated', 'webapp-overlay');
const webappDir = path.join(rootDir, 'jeju-web', 'src', 'main', 'webapp');

const EXCLUDE_BASENAMES = new Set([
    'node_modules',
    '.git',
    '.generated',
    'package.json',
    'package-lock.json',
    'scripts'
]);

const EXCLUDE_PATTERNS = [
    /^\.env(\..+)?$/i
];

const shouldExclude = (srcPath) => {
  const basename = path.basename(srcPath);
  if (EXCLUDE_BASENAMES.has(basename)) {
    return true;
  }

  const relativePath = path.relative(frontDir, srcPath).replace(/\\/g, '/');
  if (
    relativePath === 'components/runtime' ||
    relativePath.startsWith('components/runtime/') ||
    relativePath === 'pages/cs' ||
    relativePath.startsWith('pages/cs/')
  ) {
    return true;
  }

  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(basename));
};

async function sync() {
    console.log('🔄 front 단일 원본 -> jeju-web webapp 미러 동기화를 시작한다');

    try {
        // webapp 루트 정리. WEB-INF/META-INF는 보존
        const items = await fs.readdir(webappDir);
        for (const item of items) {
            if (item === 'WEB-INF' || item === 'META-INF') {
                continue;
            }
            await fs.remove(path.join(webappDir, item));
        }
        console.log('🧹 webapp 폴더 청소 완료 (WEB-INF 제외)');

        // front 만 사람이 수정하는 원본이다. webapp 은 배포용 미러로만 유지한다.
        // webapp 직접 수정은 금지하고, 항상 front 기준으로 덮어쓴다.
        await fs.copy(frontDir, webappDir, {
            filter: (src) => !shouldExclude(src)
        });

        if (await fs.pathExists(generatedWebappOverlayDir)) {
            await fs.copy(generatedWebappOverlayDir, webappDir, { overwrite: true });
        }

        // webapp 에 복제된 HTML 엔트리를 JSP 미러로 전부 생성한다.
        const { jspFileCount } = await generateJspMirrors(webappDir);
        console.log(`🧷 JSP 미러 ${jspFileCount}개 생성 완료`);

        console.log('✨ front 원본 기준 webapp 미러 동기화 성공');
        console.log(`📍 경로: ${webappDir}`);
    } catch (err) {
        console.error('❌ 동기화 작업 중 치명적인 에러 발생:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    sync();
}

module.exports = sync;
