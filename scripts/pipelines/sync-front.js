const fs = require('fs-extra');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const frontDir = path.join(rootDir, 'front');
const webappDir = path.join(rootDir, 'jeju-web', 'src', 'main', 'webapp');

const EXCLUDE_BASENAMES = new Set([
    'node_modules',
    '.git',
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
    return EXCLUDE_PATTERNS.some((pattern) => pattern.test(basename));
};

async function sync() {
    console.log('🔄 프런트엔드 소스 -> 제이유 백엔드(webapp) 합병을 시작한다');

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

        // front -> webapp 동기화
        await fs.copy(frontDir, webappDir, {
            filter: (src) => !shouldExclude(src)
        });

        // index.html을 JSP 진입점으로 복제
        const htmlPath = path.join(webappDir, 'index.html');
        const jspPath = path.join(webappDir, 'index.jsp');

        if (await fs.pathExists(htmlPath)) {
            const content = await fs.readFile(htmlPath, 'utf8');
            const jspHeader = `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>\n`;
            await fs.writeFile(jspPath, jspHeader + content, 'utf8');
            console.log('🧷 index.jsp 생성 완료 (index.html도 유지)');
        }

        console.log('✨ 프런트엔드 정적 파일 합동 작전 성공');
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
