const fs = require('fs');
const mysql = require('mysql2/promise');

const envContent = fs.readFileSync('jeju-web/.env.alwaysdata', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx > -1) {
        let v = line.substring(idx + 1).trim();
        if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1);
        v = v.replace(/\[|\]/g, '');
        envVars[line.substring(0, idx).trim()] = v;
    }
});

let dbUrl = envVars['ALWAYSDATA_DB_URL'];
const withoutPrefix = dbUrl.substring(13);
const host = withoutPrefix.substring(0, withoutPrefix.indexOf('/'));
const database = withoutPrefix.substring(withoutPrefix.indexOf('/') + 1);

const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
const lastNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '지호', '주원', '지훈', '서진', '서연', '서윤', '지우', '서현', '하은', '하윤', '민서', '지유', '윤서', '지민', '채원', '수아', '지아', '태연', '은지'];

function getRandomName() {
    return firstNames[Math.floor(Math.random() * firstNames.length)] + lastNames[Math.floor(Math.random() * lastNames.length)];
}

function getRandomPhone() {
    const p1 = Math.floor(Math.random() * 9000) + 1000;
    const p2 = Math.floor(Math.random() * 9000) + 1000;
    return `010-${p1}-${p2}`;
}

const providers = ['KAKAO', 'NAVER', 'PASS'];
const genders = ['M', 'F'];

async function seed() {
    console.log(`[Seed] Connecting to ${host} ... DB: ${database}`);
    const conn = await mysql.createConnection({
        host: host,
        user: envVars['ALWAYSDATA_DB_USER'],
        password: envVars['ALWAYSDATA_DB_PASSWORD'],
        database: database
    });

    console.log('[Seed] Inserting admin user... (admin / 1234)');
    await conn.execute(
        'INSERT IGNORE INTO users (id, pw, name, phone, gender, provider, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['admin', '1234', '최고관리자', '010-0000-0000', 'M', 'PASS', 'ADMIN']
    );

    console.log('[Seed] Generating 70 random dummy users...');
    let inserted = 0;
    for (let i = 1; i <= 70; i++) {
        const id = `user${i}`;
        const pw = '1234';
        const name = getRandomName();
        const phone = getRandomPhone();
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const provider = providers[Math.floor(Math.random() * providers.length)];
        
        try {
            await conn.execute(
                'INSERT IGNORE INTO users (id, pw, name, phone, gender, provider, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, pw, name, phone, gender, provider, 'USER']
            );
            inserted++;
        } catch(e) {
            console.error(`[Seed] Error inserting user${i}:`, e.message);
        }
    }

    console.log(`[Seed] ${inserted} dummy users inserted successfully.`);
    
    const [rows] = await conn.execute('SELECT COUNT(*) as cnt FROM users');
    console.log(`[Seed] Total users in DB currently: ${rows[0].cnt}`);

    await conn.end();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
