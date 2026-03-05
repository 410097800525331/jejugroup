const { NodeSSH } = require('node-ssh');
const path = require('path');
const fs = require('fs');
const env = require('../utils/env');

const ssh = new NodeSSH();

const rootDir = path.resolve(__dirname, '../../');
const localWarPath = path.join(rootDir, 'jeju-web', 'ROOT.war');
const DEFAULT_HEALTHCHECK_URL = process.env.HEALTHCHECK_URL || 'https://jejugroup.alwaysdata.net/';
const HEALTHCHECK_TIMEOUT_MS = Number(process.env.HEALTHCHECK_TIMEOUT_MS || 60000);
const HEALTHCHECK_INTERVAL_MS = Number(process.env.HEALTHCHECK_INTERVAL_MS || 3000);
const TOMCAT_RESTART_TIMEOUT_SEC = Number(process.env.TOMCAT_RESTART_TIMEOUT_SEC || 60);
const ALWAYSDATA_API_BASE = process.env.ALWAYSDATA_API_BASE || 'https://api.alwaysdata.com/v1';
const RESTART_STRICT_MODE = String(process.env.RESTART_STRICT_MODE || 'false').toLowerCase() === 'true';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const escapeForShellSingleQuote = (value) => String(value || '').replace(/'/g, `'"'"'`);

const extractTomcatInstanceId = (serverXmlPath) => {
  if (!serverXmlPath) {
    return '';
  }

  const match = serverXmlPath.match(/\/tomcat\/(\d+)\/server\.xml$/);
  return match ? match[1] : '';
};

const extractCookieValue = (setCookieHeader, key) => {
  if (!setCookieHeader) {
    return '';
  }

  const regex = new RegExp(`${key}=([^;,\\s]+)`);
  const match = setCookieHeader.match(regex);
  return match ? match[1] : '';
};

const restartTomcatViaAdminConsole = async (siteIdHint) => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    return { attempted: false, restarted: false, inconclusive: true, method: 'admin-console' };
  }

  const loginUrl = 'https://admin.alwaysdata.com/login/';
  const siteListUrl = 'https://admin.alwaysdata.com/site/';

  const loginPage = await fetch(loginUrl);
  const loginHtml = await loginPage.text();
  const csrfCookie = extractCookieValue(loginPage.headers.get('set-cookie') || '', 'csrftoken');
  const csrfToken = loginHtml.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/)?.[1] || '';

  if (!csrfCookie || !csrfToken) {
    throw new Error('AlwaysData admin login page parse failed');
  }

  const loginForm = new URLSearchParams({
    csrfmiddlewaretoken: csrfToken,
    login: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    alive: 'on'
  });

  const loginResponse = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `csrftoken=${csrfCookie}`,
      Referer: loginUrl
    },
    redirect: 'manual',
    body: loginForm.toString()
  });

  if (loginResponse.status !== 302) {
    throw new Error(`AlwaysData admin login failed: status=${loginResponse.status}`);
  }

  const loginSetCookie = loginResponse.headers.get('set-cookie') || '';
  const sessionId = extractCookieValue(loginSetCookie, 'sessionid');
  const nextCsrfCookie = extractCookieValue(loginSetCookie, 'csrftoken') || csrfCookie;
  if (!sessionId) {
    throw new Error('AlwaysData admin login failed: session cookie missing');
  }

  const cookieHeader = `csrftoken=${nextCsrfCookie}; sessionid=${sessionId}`;
  const sitePage = await fetch(siteListUrl, {
    headers: {
      Cookie: cookieHeader
    }
  });

  const siteHtml = await sitePage.text();
  if (!sitePage.ok) {
    throw new Error(`AlwaysData site page fetch failed: status=${sitePage.status}`);
  }

  const siteCsrf = siteHtml.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/)?.[1] || '';
  if (!siteCsrf) {
    throw new Error('AlwaysData site page csrf parse failed');
  }

  const restartPathFromPage = siteHtml.match(/action="(\/site\/\d+\/restart\/)"/)?.[1] || '';
  const restartPath = siteIdHint ? `/site/${siteIdHint}/restart/` : restartPathFromPage;
  if (!restartPath) {
    throw new Error('AlwaysData restart path not found');
  }

  const restartResponse = await fetch(`https://admin.alwaysdata.com${restartPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieHeader,
      Referer: siteListUrl
    },
    redirect: 'manual',
    body: new URLSearchParams({
      csrfmiddlewaretoken: siteCsrf
    }).toString()
  });

  if (!(restartResponse.status >= 200 && restartResponse.status < 400)) {
    throw new Error(`AlwaysData restart request failed: status=${restartResponse.status}`);
  }

  console.log(`[DEPLOY] AlwaysData 관리자 콘솔 재시작 요청 성공 (${restartPath})`);
  return { attempted: true, restarted: true, inconclusive: false, method: 'admin-console' };
};

const detectTomcatServerXml = async () => {
  const command = `find /home/${env.SSH_USER}/admin/config/tomcat -maxdepth 3 -name server.xml | while read f; do grep -q 'docBase="/home/${env.SSH_USER}/ROOT.war"' "$f" && echo "$f"; done | head -n 1`;
  const result = await ssh.execCommand(command);
  return result.stdout.trim();
};

const detectAutoDeploy = async (serverXmlPath) => {
  if (!serverXmlPath) {
    return '';
  }

  const command = `grep -o 'autoDeploy="[^"]*"' "${serverXmlPath}" | head -n 1`;
  const result = await ssh.execCommand(command);
  return result.stdout.trim();
};

const restartTomcatViaApi = async () => {
  if (!env.ALWAYSDATA_API_KEY || !env.ALWAYSDATA_SITE_ID) {
    return { attempted: false, restarted: false, inconclusive: true, method: 'api' };
  }

  const authUser = `${env.ALWAYSDATA_API_KEY} account=${env.ALWAYSDATA_ACCOUNT}`;
  const authHeader = `Basic ${Buffer.from(`${authUser}:`).toString('base64')}`;
  const endpoint = `${ALWAYSDATA_API_BASE}/site/${env.ALWAYSDATA_SITE_ID}/restart/`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: authHeader
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AlwaysData API restart failed: status=${response.status} body=${body.slice(0, 200)}`);
  }

  console.log('[DEPLOY] AlwaysData API 재시작 요청 성공');
  return { attempted: true, restarted: true, inconclusive: false, method: 'api' };
};

const restartTomcatViaSshSignal = async (serverXmlPath) => {
  const instanceId = extractTomcatInstanceId(serverXmlPath);
  const safeServerXmlPath = escapeForShellSingleQuote(serverXmlPath);
  const instancePattern = instanceId ? `|/[t]omcat/${instanceId}/` : '';

  // AlwaysData 일부 환경은 프로세스 목록 가시성이 제한되어 kill 대상 탐지가 불가할 수 있음
  const restartCommand = `
PATTERN='[o]rg.apache.catalina.startup.Bootstrap|[c]atalina\\\\.sh run|/[a]dmin/config/tomcat${instancePattern}'
BEFORE_PIDS=$(pgrep -f "$PATTERN" 2>/dev/null || true)
if [ -n "$BEFORE_PIDS" ]; then
  echo "[REMOTE] kill: $BEFORE_PIDS"
  echo "$BEFORE_PIDS" | xargs -r kill -9 || true
  sleep 2

  for i in $(seq 1 ${TOMCAT_RESTART_TIMEOUT_SEC}); do
    AFTER_PIDS=$(pgrep -f "$PATTERN" 2>/dev/null || true)
    if [ -n "$AFTER_PIDS" ] && [ "$AFTER_PIDS" != "$BEFORE_PIDS" ]; then
      echo "[REMOTE] restart-ok: $AFTER_PIDS"
      exit 0
    fi
    sleep 1
  done

  echo "[REMOTE] restart-timeout"
  exit 1
fi

echo "[REMOTE] kill: no-visible-pid"
if [ -n '${safeServerXmlPath}' ] && [ -f '${safeServerXmlPath}' ]; then
  touch '${safeServerXmlPath}' || true
  echo "[REMOTE] touch-server-xml"
fi
exit 2
`.trim();

  const result = await ssh.execCommand(restartCommand);
  if (result.stdout) {
    console.log(result.stdout.trim());
  }
  if (result.stderr) {
    console.warn(result.stderr.trim());
  }

  const stdout = (result.stdout || '').trim();
  if (result.code === 0 && stdout.includes('[REMOTE] restart-ok')) {
    return { attempted: true, restarted: true, inconclusive: false, method: 'ssh-signal' };
  }

  if (result.code === 2 && stdout.includes('[REMOTE] kill: no-visible-pid')) {
    return { attempted: true, restarted: false, inconclusive: true, method: 'ssh-signal' };
  }

  if (stdout.includes('[REMOTE] kill:') || (result.stderr || '').includes('No such process')) {
    return { attempted: true, restarted: false, inconclusive: true, method: 'ssh-signal' };
  }

  throw new Error('Tomcat restart command failed');
};

const restartTomcat = async (serverXmlPath) => {
  const siteId = extractTomcatInstanceId(serverXmlPath) || env.ALWAYSDATA_SITE_ID;

  if (env.ALWAYSDATA_API_KEY && env.ALWAYSDATA_SITE_ID) {
    console.log('[DEPLOY] AlwaysData API 재시작 시도');
    try {
      return await restartTomcatViaApi();
    } catch (error) {
      console.warn(`[WARN] API 재시작 실패, SSH fallback 수행: ${error.message}`);
    }
  }

  console.log('[DEPLOY] AlwaysData 관리자 콘솔 재시작 시도');
  try {
    return await restartTomcatViaAdminConsole(siteId);
  } catch (error) {
    console.warn(`[WARN] 관리자 콘솔 재시작 실패, SSH fallback 수행: ${error.message}`);
  }

  console.log('[DEPLOY] 관리자/API 재시작 경로 불가, SSH 재시작 경로 사용');
  return restartTomcatViaSshSignal(serverXmlPath);
};

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

const verifyRuntimeBcryptLoaded = async () => {
  const verifyCommand = `
CLASS_FILE="/home/${env.SSH_USER}/ROOT/ROOT/WEB-INF/classes/controller/SignupServlet.class"
if [ ! -f "$CLASS_FILE" ]; then
  echo "[VERIFY] runtime-class-missing"
  exit 2
fi

if strings "$CLASS_FILE" | grep -Eq 'BCryptUtil|hashPassword'; then
  echo "[VERIFY] runtime-bcrypt-ok"
  exit 0
fi

echo "[VERIFY] runtime-bcrypt-missing"
exit 1
`.trim();

  for (let i = 1; i <= 10; i += 1) {
    const result = await ssh.execCommand(verifyCommand);
    if (result.stdout) {
      console.log(result.stdout.trim());
    }
    if (result.stderr) {
      console.warn(result.stderr.trim());
    }

    if (result.code === 0) {
      return;
    }

    await sleep(2000);
  }

  throw new Error('Runtime class validation failed: bcrypt marker not found');
};

async function deploy() {
  console.log('[DEPLOY] alwaysdata 업로드 시작');

  if (!fs.existsSync(localWarPath)) {
    console.error('[ERROR] ROOT.war 없음, 먼저 build 실행 필요');
    process.exit(1);
  }

  console.log(`[DEPLOY] 서버 접속 시도: ${env.SSH_HOST}`);

  try {
    await ssh.connect({
      host: env.SSH_HOST,
      username: env.SSH_USER,
      password: env.SSH_PASSWORD,
      port: 22
    });

    const remotePath = env.REMOTE_DEPLOY_PATH;
    console.log(`[DEPLOY] 업로드: ${localWarPath} -> ${remotePath}`);
    await ssh.putFile(localWarPath, remotePath);
    console.log('[DEPLOY] 업로드 완료');

    const serverXmlPath = await detectTomcatServerXml();
    const autoDeploy = await detectAutoDeploy(serverXmlPath);
    let restartResult = null;

    if (autoDeploy === 'autoDeploy="false"') {
      console.log('[DEPLOY] Tomcat autoDeploy=false 확인');
      console.log('[DEPLOY] 재시작 트리거 실행');
      restartResult = await restartTomcat(serverXmlPath);
    } else if (autoDeploy) {
      console.log(`[DEPLOY] Tomcat 설정: ${autoDeploy}`);
      console.log('[DEPLOY] autoDeploy=true 환경으로 판단, 재시작 생략');
    } else {
      console.warn('[WARN] Tomcat server.xml 자동 탐지 실패');
      console.warn('[WARN] 안전을 위해 재시작 트리거 실행');
      restartResult = await restartTomcat(serverXmlPath);
    }

    if (restartResult && restartResult.inconclusive) {
      console.warn('[WARN] 원격 프로세스 가시성 제한으로 재시작 확인 불가');
      console.warn('[WARN] 헬스체크 결과로 최종 배포 성공 여부 판단');
      if (RESTART_STRICT_MODE) {
        throw new Error('Tomcat restart inconclusive in strict mode');
      }
    }

    console.log(`[DEPLOY] 헬스체크 시작: ${DEFAULT_HEALTHCHECK_URL}`);
    await waitForHealthCheck(DEFAULT_HEALTHCHECK_URL);
    console.log('[DEPLOY] 런타임 BCrypt 로딩 검증 시작');
    await verifyRuntimeBcryptLoaded();
    console.log('[DEPLOY] 헬스체크 성공, 배포 완료');
  } catch (error) {
    console.error('[ERROR] 배포 실패:', error);
    process.exit(1);
  } finally {
    ssh.dispose();
    console.log('[DEPLOY] SSH 세션 종료');
  }
}

if (require.main === module) {
  deploy();
}

module.exports = deploy;
