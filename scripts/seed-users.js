const { NodeSSH } = require('node-ssh');
const { fakerKO: faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const env = require('d:/lsh/git/jejugroup/scripts/utils/env.js');

const ssh = new NodeSSH();

// 비밀번호 원문 (모두 동일하게 통일하여 테스트 용이성 확보)
const MOCK_PASSWORD_PLAIN = 'Password123!';

// RRN 앞자리에 따른 성별 도출 (1,3,5,7: M / 2,4,6,8: F)
const deriveGender = (rrnDigit) => {
    return ['1', '3', '5', '7'].includes(rrnDigit) ? 'M' : 'F';
};

async function seed() {
    console.log('[SEED] 데이터베이스 SSH 브릿지 접속 중...');
    
    // DB 비밀번호 추출
    const envContent = fs.readFileSync('d:/lsh/git/jejugroup/jeju-web/.env', 'utf-8');
    const dbMatch = envContent.match(/DB_PASSWORD=(.*)/);
    const dbPass = dbMatch ? dbMatch[1].trim() : 'shmajo0821!';

    await ssh.connect({
        host: env.SSH_HOST,
        username: env.SSH_USER,
        password: env.SSH_PASSWORD,
        port: 22,
    });

    console.log('[SEED] 50명의 가상 유저 데이터를 생성 및 BCrypt 암호화 중...');

    const users = [];
    for (let i = 0; i < 50; i++) {
        const id = `user${String(i + 1).padStart(3, '0')}_${faker.string.alphanumeric(4)}`;
        // Node.js의 bcryptjs를 사용하여 Java의 jbcrypt와 동일한 방식($2a$)으로 단방향 암호화 수행
        const pw = bcrypt.hashSync(MOCK_PASSWORD_PLAIN, 10);
        const name = faker.person.lastName() + faker.person.firstName();
        
        // 010-XXXX-XXXX 포맷 강제
        const phone = `010-${faker.string.numeric(4)}-${faker.string.numeric(4)}`;
        
        const email = faker.internet.email({ firstName: id });
        
        // 임의 생년월일 (1970 ~ 2005)
        const birthDateObj = faker.date.birthdate({ min: 1970, max: 2005, mode: 'year' });
        const birthDate = birthDateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // 성별 결정용 뒤자리 첫번째 숫자 (1,2: 1900년대 / 3,4: 2000년대)
        const year = birthDateObj.getFullYear();
        let rrnDigit;
        if (year < 2000) {
            rrnDigit = faker.helpers.arrayElement(['1', '2']);
        } else {
            rrnDigit = faker.helpers.arrayElement(['3', '4']);
        }
        const gender = deriveGender(rrnDigit);
        
        // 무조건 PASS 연동, USER 등급
        const provider = 'PASS';
        const role = 'USER';

        users.push(`('${id}', '${pw}', '${name}', '${phone}', '${email}', '${birthDate}', '${gender}', '${provider}', '${role}')`);
    }

    const valueString = users.join(',\n');
    const insertQuery = `INSERT INTO users (id, pw, name, phone, email, birth_date, gender, provider, role) VALUES \n${valueString};`;
    
    // 이스케이프: ' 는 '\'' 로 치환하여 CLI 쿼리 넘김
    const safeQuery = insertQuery.replace(/'/g, "'\\''");

    const cmd = `mysql -h mysql-jejugroup.alwaysdata.net -u jejugroup -p'${dbPass}' jejugroup_db -e '${safeQuery}'`;

    console.log('[SEED] 생성된 데이터를 AlwaysData DB로 일괄 INSERT 대포 발사...');
    
    const result = await ssh.execCommand(cmd);

    if (result.code === 0) {
        console.log('[SEED] ✅ 50개 계정 안전하게 삽입 완료!');
        console.log(`[INFO] 모든 가상 유저의 공통 비밀번호는 [ ${MOCK_PASSWORD_PLAIN} ] 이다.`);
    } else {
        console.error('[SEED] ❌ 삽입 중 에러 발생:');
        console.error(result.stderr);
    }
    
    ssh.dispose();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
