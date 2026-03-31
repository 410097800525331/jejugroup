const { NodeSSH } = require('node-ssh');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { resolveDeployConfig } = require('../utils/deploy-contract');

const ssh = new NodeSSH();

const rootDir = path.resolve(__dirname, '../../');
const tempDir = path.join(rootDir, '.codex-temp');
const archiveName = 'oci-docker-redeploy-src.tar.gz';
const archivePath = path.join(tempDir, archiveName);
const wrapperJarPath = path.join(rootDir, 'jeju-spring', 'gradle', 'wrapper', 'gradle-wrapper.jar');
const HEALTHCHECK_TIMEOUT_MS = Number(process.env.OCI_HEALTHCHECK_TIMEOUT_MS || process.env.HEALTHCHECK_TIMEOUT_MS || 60000);
const HEALTHCHECK_INTERVAL_MS = Number(process.env.OCI_HEALTHCHECK_INTERVAL_MS || process.env.HEALTHCHECK_INTERVAL_MS || 3000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureDirectory = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const shellQuote = (value) => `'${String(value).replace(/'/g, `'\"'\"'`)}'`;

const waitForHealthCheck = async (url) => {
  const deadline = Date.now() + HEALTHCHECK_TIMEOUT_MS;
  let attempt = 0;

  while (Date.now() < deadline) {
    attempt += 1;

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        redirect: 'follow'
      });

      console.log(`[HEALTH] attempt=${attempt} status=${response.status}`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      console.log(`[HEALTH] attempt=${attempt} error=${error.message}`);
    }

    await sleep(HEALTHCHECK_INTERVAL_MS);
  }

  throw new Error(`Health check timeout: ${url}`);
};

const createDeploymentArchive = () => {
  ensureDirectory(tempDir);
  if (fs.existsSync(archivePath)) {
    fs.rmSync(archivePath, { force: true });
  }

  const excludePatterns = [
    '.git',
    'node_modules',
    '.codex-temp',
    '.gradle',
    'front/.generated',
    'parity_shots',
    'test-results',
    'jeju-spring/build',
    'jeju-spring/target',
    '*.war',
    '*.jar',
    '*.pem',
    '*.key',
    '.env',
    '.env.*',
    'jeju-spring/.env',
    'jeju-web/.env'
  ];

  const tarArgs = ['-czf', archivePath];
  for (const pattern of excludePatterns) {
    tarArgs.push(`--exclude=${pattern}`);
  }
  tarArgs.push('.');

  execFileSync('tar', tarArgs, {
    cwd: rootDir,
    stdio: 'inherit'
  });
};

const resolveWrapperJar = () => {
  if (!fs.existsSync(wrapperJarPath)) {
    throw new Error(`Gradle wrapper jar not found: ${wrapperJarPath}`);
  }

  return wrapperJarPath;
};

const buildRemoteScript = ({ appDir, sharedEnvHostPath, sharedEnvContainerPath, uploadsDir, remoteHealthUrl }) => `
set -e
APP_DIR=${shellQuote(appDir)}
ACTIVE_DIR="$APP_DIR/docker-src"
STAGING_DIR="$APP_DIR/docker-src.staging.$$"
BACKUP_DIR="$APP_DIR/docker-src.backup.$(date +%s)"
ARCHIVE="$APP_DIR/${archiveName}"
WRAPPER_TMP="$APP_DIR/gradle-wrapper.jar"
SHARED_ENV_FILE=${shellQuote(sharedEnvHostPath)}
SHARED_ENV_PATH=${shellQuote(sharedEnvContainerPath)}
UPLOADS_DIR=${shellQuote(uploadsDir)}
REMOTE_HEALTH_URL=${shellQuote(remoteHealthUrl)}

cleanup() {
  if [ -d "$STAGING_DIR" ]; then
    mv "$STAGING_DIR" "$APP_DIR/docker-src.staging.failed.$$" 2>/dev/null || true
  fi
}
trap cleanup INT TERM HUP

if [ ! -f "$SHARED_ENV_FILE" ]; then
  echo "[REDEPLOY] missing env file: $SHARED_ENV_FILE" >&2
  exit 1
fi

export JEJU_SHARED_ENV_FILE="$SHARED_ENV_FILE"
export JEJU_SHARED_ENV_PATH="$SHARED_ENV_PATH"
export JEJU_UPLOADS_DIR="$UPLOADS_DIR"

mkdir -p "$STAGING_DIR"
tar -xzf "$ARCHIVE" -C "$STAGING_DIR"
mkdir -p "$STAGING_DIR/jeju-spring/gradle/wrapper"
mv "$WRAPPER_TMP" "$STAGING_DIR/jeju-spring/gradle/wrapper/gradle-wrapper.jar"

if [ -e "$BACKUP_DIR" ]; then
  mv "$BACKUP_DIR" "$BACKUP_DIR.old.$(date +%s)"
fi
if [ -d "$ACTIVE_DIR" ]; then
  mv "$ACTIVE_DIR" "$BACKUP_DIR"
fi
mv "$STAGING_DIR" "$ACTIVE_DIR"
trap - INT TERM HUP

mkdir -p "$UPLOADS_DIR" "$UPLOADS_DIR/mypage-avatars"
chown -R 1000:1000 "$UPLOADS_DIR" || true

cd "$ACTIVE_DIR"
docker compose up -d mysql
docker compose up -d --build app nginx
docker compose ps

for i in $(seq 1 60); do
  code=$(curl -s -o /tmp/jeju-health.json -w '%{http_code}' "$REMOTE_HEALTH_URL" || true)
  if [ "$code" = "200" ]; then
    cat /tmp/jeju-health.json
    exit 0
  fi
  sleep 2
done

echo "[REDEPLOY] remote health check timed out" >&2
docker compose logs --no-color --tail=120 app nginx >&2 || true
exit 1
`.trim();

async function deploy() {
  const config = resolveDeployConfig().oci;

  console.log('[DEPLOY] OCI Docker Compose deploy start');
  console.log(`[DEPLOY] SSH host: ${config.sshHost}`);
  console.log(`[DEPLOY] target dir: ${config.appDir}`);

  createDeploymentArchive();
  const wrapperJar = resolveWrapperJar();

  try {
    await ssh.connect({
      host: config.sshHost,
      username: config.sshUser,
      password: config.sshKeyPath ? undefined : config.sshPassword,
      privateKey: config.sshKeyPath || undefined,
      port: 22
    });

    await ssh.execCommand(`mkdir -p ${shellQuote(config.appDir)}`);

    console.log(`[DEPLOY] archive upload: ${archivePath} -> ${config.remoteArchivePath}`);
    await ssh.putFile(archivePath, config.remoteArchivePath);

    console.log(`[DEPLOY] wrapper upload: ${wrapperJar} -> ${config.remoteWrapperPath}`);
    await ssh.putFile(wrapperJar, config.remoteWrapperPath);

    const remoteScript = buildRemoteScript({
      appDir: config.appDir,
      sharedEnvHostPath: config.sharedEnvHostPath,
      sharedEnvContainerPath: config.sharedEnvContainerPath,
      uploadsDir: config.uploadsDir,
      remoteHealthUrl: config.remoteHealthUrl
    });

    const result = await ssh.execCommand(remoteScript);
    if (result.stdout) {
      console.log(result.stdout.trim());
    }
    if (result.stderr) {
      console.warn(result.stderr.trim());
    }

    if (result.code !== 0) {
      throw new Error('Remote docker compose redeploy failed');
    }

    console.log(`[DEPLOY] public health check: ${config.publicHealthUrl}`);
    await waitForHealthCheck(config.publicHealthUrl);
    console.log('[DEPLOY] OCI deploy complete');
  } catch (error) {
    console.error('[ERROR] OCI deploy failed:', error);
    process.exit(1);
  } finally {
    ssh.dispose();
    console.log('[DEPLOY] SSH session closed');
  }
}

if (require.main === module) {
  deploy();
}

module.exports = deploy;
