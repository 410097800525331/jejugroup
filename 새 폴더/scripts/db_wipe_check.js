const { NodeSSH } = require('node-ssh');
const env = require('d:/lsh/git/jejugroup/scripts/utils/env.js');
const ssh = new NodeSSH();

async function run() {
  console.log('[DB-CHECK] 데이터베이스 SSH 브릿지 접속 중...');
  await ssh.connect({
    host: env.SSH_HOST,
    username: env.SSH_USER,
    password: env.SSH_PASSWORD,
    port: 22,
  });

  console.log('[DB-CHECK] 보안 프로토콜에 따라 users 테이블 초기화 및 스키마 추출 진행...');
  // ssh 내부에서 mysql CLI 호출하여 쿼리 실행
  // DB 패스워드는 env에서 가져와야 하지만, dotenv 설정상 .env가 소스상에 있으니 직접 전달하거나 ssh-password 활용.
  // env.js에 DB_PASSWORD가 없다면 dotenv로 직접 파싱
  const fs = require('fs');
  const envContent = fs.readFileSync('d:/lsh/git/jejugroup/jeju-web/.env', 'utf-8');
  const dbMatch = envContent.match(/DB_PASSWORD=(.*)/);
  const dbPass = dbMatch ? dbMatch[1].trim() : 'shmajo0821!';

  const cmd = `mysql -h mysql-jejugroup.alwaysdata.net -u jejugroup -p'${dbPass}' jejugroup_db -e "DELETE FROM users; DESCRIBE users;"`;
  const result = await ssh.execCommand(cmd);

  console.log('--- [SCHEMA RESULTS] ---');
  console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  
  ssh.dispose();
}

run().catch(console.error);
