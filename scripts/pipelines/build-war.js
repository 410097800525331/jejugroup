const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const { runJavaTool } = require('../utils/run-java-tool');

const rootDir = path.resolve(__dirname, '../../');
const jejuWebDir = path.join(rootDir, 'jeju-web');
const srcJavaDir = path.join(jejuWebDir, 'src', 'main', 'java');
const webappDir = path.join(jejuWebDir, 'src', 'main', 'webapp');
const classesDir = path.join(webappDir, 'WEB-INF', 'classes');
const webInfLibDir = path.join(webappDir, 'WEB-INF', 'lib');
const legacyBinDir = path.join(jejuWebDir, 'bin');
const servletApiJarPath = path.join(rootDir, 'scripts', 'lib', 'servlet-api.jar');
const bcryptJarPath = path.join(rootDir, 'scripts', 'lib', 'jbcrypt-0.4.jar');
const warPath = path.resolve(jejuWebDir, 'ROOT.war');

const ensureDependency = async (filePath, message) => {
    if (!(await fs.pathExists(filePath))) {
        throw new Error(message);
    }
};

const collectJavaFiles = async (targetDir) => {
    if (!(await fs.pathExists(targetDir))) {
        return [];
    }

    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const results = await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(targetDir, entry.name);
            if (entry.isDirectory()) {
                return collectJavaFiles(fullPath);
            }
            return entry.name.endsWith('.java') ? [fullPath] : [];
        })
    );

    return results.flat();
};

const compileJavaSources = async () => {
    const javaFiles = await collectJavaFiles(srcJavaDir);
    if (javaFiles.length === 0) {
        console.warn('[WARN] Java 소스 파일 없음');
        return;
    }

    await ensureDependency(
        servletApiJarPath,
        '[ERROR] servlet-api.jar 파일이 없음. scripts/lib/servlet-api.jar 경로 확인 필요'
    );

    await ensureDependency(
        bcryptJarPath,
        '[ERROR] jbcrypt jar 파일이 없음. scripts/lib/jbcrypt-0.4.jar 준비 후 다시 실행 필요'
    );

    await fs.ensureDir(classesDir);
    await fs.emptyDir(classesDir);

    // 타사 라이브러리(jbcrypt)를 WEB-INF/lib로 동기화
    await fs.ensureDir(webInfLibDir);
    await fs.copy(bcryptJarPath, path.join(webInfLibDir, 'jbcrypt-0.4.jar'));

    const legacySourcesFilePath = path.join(__dirname, 'sources.tmp.txt');
    const sourcesFilePath = path.join(os.tmpdir(), `jejugroup-sources-${Date.now()}-${process.pid}.txt`);

    const classpathSeparator = process.platform === 'win32' ? ';' : ':';
    const libWildcardPath = path.join(webInfLibDir, '*').replace(/\\/g, '/');
    const servletApiPath = servletApiJarPath.replace(/\\/g, '/');
    const classPath = `"${libWildcardPath}${classpathSeparator}${servletApiPath}"`;

    try {
        await fs.writeFile(sourcesFilePath, javaFiles.join('\n'), 'utf8');
        runJavaTool(`javac --release 17 -encoding UTF-8 -cp ${classPath} -d "${classesDir}" @"${sourcesFilePath}"`, {
            cwd: rootDir
        });
    } finally {
        // 예외 발생 여부와 무관하게 임시 파일 정리
        await fs.remove(sourcesFilePath);
        await fs.remove(legacySourcesFilePath);
    }
};

async function buildWar() {
    console.log('[BUILD] ROOT.war 빌드 시작');
    console.log(`[BUILD] WAR 생성 경로: ${warPath}`);

    try {
        // 과거 IDE 산출물(bin)이 남아 있으면 빌드 혼선 유발 가능성이 있어 선제 정리
        if (await fs.pathExists(legacyBinDir)) {
            await fs.remove(legacyBinDir);
            console.log('[BUILD] legacy bin 폴더 정리 완료');
        }

        await compileJavaSources();

        // 배포 대상 외 ROOT.war 산출물 정리
        const garbagePaths = [
            path.join(jejuWebDir, 'src', 'ROOT.war'),
            path.join(rootDir, 'ROOT.war'),
            path.join(jejuWebDir, 'bin', 'ROOT.war'),
            path.join(jejuWebDir, 'build', 'ROOT.war')
        ];

        for (const gp of garbagePaths) {
            if (await fs.pathExists(gp)) {
                await fs.remove(gp);
            }
        }

        if (await fs.pathExists(warPath)) {
            await fs.remove(warPath);
        }

        runJavaTool(`jar -cvfM "${warPath}" -C "${webappDir}" .`, {
            cwd: rootDir
        });

        console.log('[BUILD] ROOT.war 생성 완료');
        console.log(`[BUILD] 산출물(절대 경로): ${warPath}`);
    } catch (error) {
        console.error('[ERROR] WAR 빌드 실패:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    buildWar();
}

module.exports = buildWar;
