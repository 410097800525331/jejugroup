const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { syncFrontAssetsToSpring } = require('./sync-front-assets-to-spring.cjs');

const goals = process.argv.slice(2);

if (goals.length === 0) {
  console.error('Usage: node scripts/spring/run-jeju-spring-maven.cjs <goal...>');
  process.exit(1);
}

const cwd = path.resolve(__dirname, '../../jeju-spring');
const command = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';
const env = {
  ...process.env
};

const getJavaBinaryName = () => (process.platform === 'win32' ? 'java.exe' : 'java');

const getJavaExecutableCandidates = () => {
  const binaryName = getJavaBinaryName();
  const candidates = [];

  for (const entry of (process.env.PATH || '')
    .split(path.delimiter)
    .filter(Boolean)) {
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

  if (result.error || result.status !== 0 && result.status !== 1) {
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
  const configuredHomes = [env.JAVA_HOME, env.JDK_HOME].filter(Boolean);
  for (const configuredHome of configuredHomes) {
    const configuredJava = path.join(configuredHome, 'bin', getJavaBinaryName());
    if (!fs.existsSync(configuredJava)) {
      continue;
    }

    const inspection = getJavaHomeFromExecutable(configuredJava);
    if (inspection) {
      return inspection;
    }
  }

  for (const candidate of getJavaExecutableCandidates()) {
    if (fs.existsSync(candidate)) {
      const inspection = getJavaHomeFromExecutable(candidate);
      if (inspection) {
        return inspection;
      }
    }
  }

  return null;
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

  const result = spawnSync(command, goals, {
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
