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

const resolveJavaExecutable = () => {
  const binaryName = process.platform === 'win32' ? 'java.exe' : 'java';
  const pathCandidates = (process.env.PATH || '')
    .split(path.delimiter)
    .filter(Boolean)
    .map((entry) => path.join(entry, binaryName));

  for (const candidate of pathCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
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
        const directCandidate = path.join(root, 'bin', binaryName);
        if (fs.existsSync(directCandidate)) {
          return directCandidate;
        }
      }

      for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
          continue;
        }

        const candidate = path.join(root, entry.name, 'bin', binaryName);
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
    }
  }

  return null;
};

const resolveJavaHome = () => {
  const configuredHome = env.JAVA_HOME || env.JDK_HOME;
  if (configuredHome) {
    const configuredJava = path.join(configuredHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
    if (fs.existsSync(configuredJava)) {
      return configuredHome;
    }
  }

  const javaExecutable = resolveJavaExecutable();
  if (!javaExecutable) {
    return null;
  }

  return path.dirname(path.dirname(javaExecutable));
};

const javaHome = resolveJavaHome();

if (javaHome) {
  env.JAVA_HOME = javaHome;
} else {
  console.error('[jeju-spring] JDK를 찾지 못했습니다. JDK 17+ 설치 후 JAVA_HOME 또는 PATH를 확인하세요.');
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
