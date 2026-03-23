const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { syncFrontAssetsToSpring } = require('./sync-front-assets-to-spring.cjs');

const tasks = process.argv.slice(2);

if (tasks.length === 0) {
  console.error('Usage: node scripts/spring/run-jeju-spring-gradle.cjs <task...>');
  process.exit(1);
}

const cwd = path.resolve(__dirname, '../../jeju-spring');
const command = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const env = {
  ...process.env
};

const getJavaBinaryName = () => (process.platform === 'win32' ? 'java.exe' : 'java');

const getJavaExecutableCandidates = () => {
  const binaryName = getJavaBinaryName();
  const candidates = [];

  for (const entry of (process.env.PATH || '').split(path.delimiter).filter(Boolean)) {
    candidates.push(path.join(entry, binaryName));
  }

  if (process.platform === 'win32') {
    const commonRoots = [
      process.env.JAVA_HOME,
      process.env.JDK_HOME,
      'C:\\Program Files\\Java',
      'C:\\Program Files\\Eclipse Adoptium',
      'C:\\Program Files\\Microsoft',
      'C:\\Program Files\\Amazon Corretto',
      path.join(os.homedir(), 'scoop', 'apps')
    ].filter(Boolean);

    for (const root of commonRoots) {
      if (!fs.existsSync(root)) {
        continue;
      }

      if (root.toLowerCase().endsWith('java') || root.toLowerCase().includes('jdk')) {
        candidates.push(path.join(root, 'bin', binaryName));
      }

      for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
          continue;
        }

        candidates.push(path.join(root, entry.name, 'bin', binaryName));
      }
    }
  }

  return candidates;
};

const getJavaHomeFromExecutable = (javaExecutable) => {
  const result = spawnSync(javaExecutable, ['-XshowSettings:properties', '-version'], {
    encoding: 'utf8'
  });

  if (result.error || (result.status !== 0 && result.status !== 1)) {
    return null;
  }

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const homeMatch = output.match(/^\s*java\.home\s*=\s*(.+)\s*$/im);
  const versionMatch = output.match(/version "(?:1\.)?(\d+)/i);

  if (!homeMatch || !versionMatch) {
    return null;
  }

  const javaHome = homeMatch[1].trim();
  const javaMajorVersion = Number.parseInt(versionMatch[1], 10);

  if (!Number.isInteger(javaMajorVersion)) {
    return null;
  }

  const javaBinary = path.join(javaHome, 'bin', getJavaBinaryName());
  if (!fs.existsSync(javaBinary)) {
    return null;
  }

  return {
    javaHome,
    javaMajorVersion
  };
};

const resolveJavaHome = () => {
  const inspections = [];
  const seenHomes = new Set();

  const collectInspection = (javaExecutable) => {
    if (!fs.existsSync(javaExecutable)) {
      return;
    }

    const inspection = getJavaHomeFromExecutable(javaExecutable);
    if (!inspection || seenHomes.has(inspection.javaHome)) {
      return;
    }

    seenHomes.add(inspection.javaHome);
    inspections.push(inspection);
  };

  const configuredHomes = [env.JAVA_HOME, env.JDK_HOME].filter(Boolean);
  for (const configuredHome of configuredHomes) {
    collectInspection(path.join(configuredHome, 'bin', getJavaBinaryName()));
  }

  for (const candidate of getJavaExecutableCandidates()) {
    collectInspection(candidate);
  }

  if (inspections.length === 0) {
    return null;
  }

  inspections.sort((left, right) => right.javaMajorVersion - left.javaMajorVersion);
  return inspections[0];
};

const javaInspection = resolveJavaHome();

if (javaInspection) {
  env.JAVA_HOME = javaInspection.javaHome;
} else {
  console.error('[jeju-spring] JDK를 찾지 못했습니다. JDK 21+ 설치 후 JAVA_HOME 또는 PATH를 확인하세요.');
  process.exit(1);
}

const javaMajorVersion = javaInspection.javaMajorVersion;

if (javaMajorVersion == null) {
  console.error('[jeju-spring] Java 버전을 확인하지 못했습니다. JDK 21+ 환경인지 다시 확인하세요.');
  process.exit(1);
}

if (javaMajorVersion < 21) {
  console.error(`[jeju-spring] 현재 JDK ${javaMajorVersion}은(는) 지원하지 않습니다. jeju-spring은 JDK 21+ 기준으로 패키징합니다.`);
  process.exit(1);
}

const run = async () => {
  try {
    await syncFrontAssetsToSpring();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const result = spawnSync(command, tasks, {
    cwd,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
};

void run();
