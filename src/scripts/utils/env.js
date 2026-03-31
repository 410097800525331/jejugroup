const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '../../');
const envPath = path.resolve(rootDir, process.env.JEJU_SHARED_ENV_PATH || path.join('jeju-spring', '.env'));

dotenv.config({ path: envPath });

const resolveEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  return '';
};

const requireEnv = (...keys) => {
  const value = resolveEnv(...keys);
  if (!value) {
    console.error(`[Fatal Error] 환경 변수 누락 감지: ${keys.join(', ')}`);
    console.error(`보안 프로토콜에 의거 가동을 즉시 중단한다. .env 파일을 점검할 것`);
    process.exit(1);
  }
  return value;
};

module.exports = {
  SSH_HOST: requireEnv('SSH_HOST', 'ALWAYSDATA_SSH_HOST'),
  SSH_USER: requireEnv('SSH_USER', 'ALWAYSDATA_SSH_USER'),
  SSH_PASSWORD: requireEnv('SSH_PASSWORD', 'ALWAYSDATA_SSH_PASSWORD'),
  REMOTE_DEPLOY_PATH: process.env.REMOTE_DEPLOY_PATH || '/home/jejugroup/ROOT.war',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.ALWAYSDATA_ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || process.env.ALWAYSDATA_ADMIN_PASSWORD || '',
  ALWAYSDATA_API_KEY: process.env.ALWAYSDATA_API_KEY || '',
  ALWAYSDATA_SITE_ID: process.env.ALWAYSDATA_SITE_ID || '',
  ALWAYSDATA_ACCOUNT: process.env.ALWAYSDATA_ACCOUNT || resolveEnv('SSH_USER', 'ALWAYSDATA_SSH_USER') || ''
};
