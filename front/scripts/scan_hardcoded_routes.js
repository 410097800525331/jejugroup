/**
 * [Security/Architecture Enforcement] 
 * 프론트엔드 내 하드코딩된 라우팅 요소 탐지 스크립트 (확장판)
 * HTML, JS, CSS 내부의 라우팅 관련 안티패턴을 모두 찾아냅니다. (SSOT 정책 위반)
 */

const fs = require('fs');
const path = require('path');

const FRONT_DIR = path.resolve(__dirname, '../');
const GENERATED_WEBAPP_OVERLAY_DIR = path.resolve(__dirname, '../.generated/webapp-overlay');
const ROUTE_MODULE_PATH = path.resolve(FRONT_DIR, 'core/modules/constants/routes.module.js');
const IGNORE_DIRS = ['node_modules', '.git', '.generated', 'scripts', 'assets'];
const ALLOWED_VALUES = ['#', 'javascript:void(0)', '', '/'];
const ROUTE_ENTRY_IGNORE = new Set(['apps/cs/client/index.html']);

// HTML(href, src), JS(import, window.location, replace/href=), CSS(url) 매칭용 통합 정규식
const MATCHERS = [
    { type: 'HTML/href', regex: /<a[^>]+href=["']([^"']+)["'][^>]*>/gi },
    { type: 'HTML/src', regex: /src=["']([^"']+)["']/gi },
    { type: 'HTML/link', regex: /href=["']([^"']+)["']/gi },
    { type: 'JS/import', regex: /from\s+["']([^"']+)["']/gi },
    { type: 'JS/dynamic-import', regex: /import\(["']([^"']+)["']\)/gi },
    { type: 'JS/location', regex: /\.location\.(href|replace)\s*[=(]\s*["']([^"']+)["']/gi },
    { type: 'CSS/url', regex: /url\(["']?([^"')]+)["']?\)/gi }
];

let violationCount = 0;

function normalizeRelativePath(filePath) {
    return path.relative(FRONT_DIR, filePath).replace(/\\/g, '/');
}

function generatedOverlayPath(targetPath) {
    const relativePath = normalizeRelativePath(targetPath);
    if (relativePath.startsWith('components\\runtime') || relativePath.startsWith('components/runtime')) {
        return path.resolve(GENERATED_WEBAPP_OVERLAY_DIR, relativePath);
    }

    if (relativePath.startsWith('pages\\cs') || relativePath.startsWith('pages/cs')) {
        return path.resolve(GENERATED_WEBAPP_OVERLAY_DIR, relativePath);
    }

    return null;
}

function collectHtmlEntrypoints(dir, collected = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                collectHtmlEntrypoints(fullPath, collected);
            }
            return;
        }

        if (path.extname(file).toLowerCase() === '.html') {
            collected.push(normalizeRelativePath(fullPath));
        }
    });

    return collected;
}

function collectRouteHtmlPaths() {
    const source = fs.readFileSync(ROUTE_MODULE_PATH, 'utf8');
    const matches = source.matchAll(/(?:pageRoute|hashPageRoute)\(\s*["']([^"']+\.html)["']/g);
    return new Set(
        Array.from(matches, (match) => match[1].replace(/^\.?\//, ''))
    );
}

function validateEntrypointCoverage() {
    const routePaths = collectRouteHtmlPaths();
    const htmlEntrypoints = collectHtmlEntrypoints(FRONT_DIR)
        .filter((relativePath) => !ROUTE_ENTRY_IGNORE.has(relativePath));

    htmlEntrypoints.forEach((relativePath) => {
        if (routePaths.has(relativePath)) {
            return;
        }

        console.error(`[MISSING_ROUTE] 발견: ${relativePath}`);
        console.error('  -> 권장 사항: ROUTE_METADATA 에 경로를 추가하거나 엔트리 제외 규칙을 명시하세요.\n');
        violationCount++;
    });
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                scanDirectory(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.html', '.js', '.css'].includes(ext)) {
                checkFile(fullPath, ext);
            }
        }
    });
}

function checkFile(filePath, ext) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    MATCHERS.forEach(({ type, regex }) => {
        // 확장자에 맞지 않는 매처는 스킵 (선택적 최적화)
        if (ext === '.css' && !type.startsWith('CSS')) return;
        if (ext === '.js' && type.startsWith('HTML')) return;
        
        // 정규식 초기화
        regex.lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
            // 위치 그룹에 따라 추출 인덱스 다름
            const value = (type === 'JS/location') ? match[2].trim() : match[1].trim();

            if (
                value.startsWith('http') ||
                value.startsWith('mailto:') ||
                value.startsWith('tel:') ||
                value.startsWith('data:') ||
                value.includes('{BASE_PATH}') ||
                ALLOWED_VALUES.includes(value)
            ) {
                continue;
            }

            // [위반 체크 로직]
            // 1. HTML 내 <a> 태그 하드코딩 라우팅 감지 (pages/ 포함 또는 .html 종료 혹은 ?/# 파라미터 동반)
            const cleanedValue = value.split('?')[0].split('#')[0];
            const isRoutingViolation = type === 'HTML/href' && (cleanedValue.endsWith('.html') || cleanedValue.includes('/pages/'));
            
            // 2. JS 내 하드코딩 라우팅 감지 (location)
            const isJsRoutingViolation = type === 'JS/location' && (cleanedValue.endsWith('.html') || cleanedValue.includes('/pages/'));

            // 3. 상대 경로 뎁스 이탈 (깨진 경로 추적)
            // 현재 작업 범위 내에서 '../../..' 이상의 경로 접근은 의심스러움 또는 
            // 실제 파일 유무를 파일시스템에서 체크
            let isBrokenPath = false;
            if (value.startsWith('.')) {
                try {
                    // split으로 파라미터나 해시 제거 (? 또는 #)
                    const cleanPath = value.split('?')[0].split('#')[0];
                    const targetPath = path.resolve(path.dirname(filePath), cleanPath);
                    const overlayPath = generatedOverlayPath(targetPath);
                    if (!fs.existsSync(targetPath) && !overlayPath) {
                        isBrokenPath = true;
                    }
                } catch(e) {}
            }

            if (isRoutingViolation || isJsRoutingViolation || isBrokenPath) {
                const lineNumber = lines.findIndex(line => line.includes(value)) + 1;
                const violationType = isBrokenPath ? 'BROKEN_PATH (존재하지 않는 파일 참조)' : 'HARDCODED_ROUTE (SSOT 정책 위반)';
                
                console.error(`[${violationType}] 발견: ${filePath}:${lineNumber}`);
                console.error(`  -> [${type}] ${match[0]}`);
                if (!isBrokenPath) console.error(`  -> 권장 사항: 데이터 라우팅 방식(ROUTES 상수)으로 변경하세요.\n`);
                else console.error(`  -> 권장 사항: 올바른 상대/절대 경로로 수정하세요.\n`);
                
                violationCount++;
            }
        }
    });
}

console.log('--- 하드코딩 경로 및 깨진 에셋 스캔 시작 ---');
scanDirectory(FRONT_DIR);
validateEntrypointCoverage();

if (violationCount > 0) {
    console.error(`\n총 ${violationCount} 개의 위반 및 깨진 참조가 발견되었습니다.`);
    process.exit(1);
} else {
    console.log('\n✅ 모든 파일이 SSOT 라우팅 원칙을 준수하며 깨진 경로가 없습니다.');
    process.exit(0);
}
