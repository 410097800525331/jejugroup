const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '../../');
const explicitDeployEnvFile = process.env.JEJU_DEPLOY_ENV_FILE || '';
const defaultDeployEnvPath = path.resolve(rootDir, 'deploy', '.env.oci');
const localDeployEnvPath = explicitDeployEnvFile ? path.resolve(rootDir, explicitDeployEnvFile) : defaultDeployEnvPath;
const hasExplicitDeployEnvFile = explicitDeployEnvFile.trim() !== '';

if (hasExplicitDeployEnvFile) {
  if (!fs.existsSync(localDeployEnvPath)) {
    throw new Error(`[DEPLOY] missing deploy env file: ${localDeployEnvPath}`);
  }

  dotenv.config({ path: localDeployEnvPath });
} else if (fs.existsSync(localDeployEnvPath)) {
  dotenv.config({ path: localDeployEnvPath });
}

const resolveEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }

  return '';
};

const requireEnv = (label, ...keys) => {
  const value = resolveEnv(...keys);
  if (!value) {
    throw new Error(`[DEPLOY] missing required env: ${label} (${keys.join(', ')})`);
  }

  return value;
};

const resolveOptionalPath = (value) => (value ? path.resolve(rootDir, value) : '');
const resolveRemoteEnvPath = (baseDir) => path.posix.join(baseDir, '.env');

const resolveDeployConfig = () => {
  const target = resolveEnv('DEPLOY_TARGET', 'JEJU_DEPLOY_TARGET') || 'oci';
  const appDir = resolveEnv('OCI_APP_DIR', 'JEJU_DEPLOY_APP_DIR') || '/opt/jejugroup';
  const sharedEnvHostPath = resolveEnv('OCI_SHARED_ENV_FILE', 'JEJU_SHARED_ENV_FILE') || resolveRemoteEnvPath(appDir);
  const sharedEnvContainerPath = resolveEnv('OCI_SHARED_ENV_PATH', 'JEJU_SHARED_ENV_PATH') || resolveRemoteEnvPath('/opt/jejugroup');
  const uploadsDir = resolveEnv('OCI_UPLOADS_DIR', 'JEJU_UPLOADS_DIR') || '/uploads';
  const publicHealthUrl = requireEnv('OCI_PUBLIC_HEALTH_URL', 'OCI_PUBLIC_HEALTH_URL', 'HEALTHCHECK_URL');
  const remoteHealthUrl = resolveEnv('OCI_REMOTE_HEALTH_URL') || 'http://127.0.0.1/actuator/health';
  const sshHost = requireEnv('OCI_SSH_HOST', 'OCI_SSH_HOST', 'SSH_HOST');
  const sshUser = requireEnv('OCI_SSH_USER', 'OCI_SSH_USER', 'SSH_USER');
  const sshKeyPath = resolveEnv('OCI_SSH_KEY_PATH', 'SSH_KEY_PATH');
  const sshPassword = resolveEnv('OCI_SSH_PASSWORD', 'SSH_PASSWORD');

  if (!sshKeyPath && !sshPassword) {
    throw new Error('[DEPLOY] missing SSH credential: OCI_SSH_KEY_PATH or OCI_SSH_PASSWORD');
  }

  return {
    target,
    sharedEnvPath: localDeployEnvPath,
    oci: {
      appDir,
      sharedEnvHostPath,
      sharedEnvContainerPath,
      uploadsDir,
      publicHealthUrl,
      remoteHealthUrl,
      sshHost,
      sshUser,
      sshKeyPath: resolveOptionalPath(sshKeyPath),
      sshPassword,
      remoteArchivePath: `${appDir}/oci-docker-redeploy-src.tar.gz`,
      remoteWrapperPath: `${appDir}/gradle-wrapper.jar`
    }
  };
};

module.exports = {
  resolveDeployConfig
};
