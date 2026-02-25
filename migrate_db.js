const fs = require('fs');

function cleanVal(v) {
    let val = v.trim();
    if (val.startsWith('[') && val.endsWith(']')) {
        return val.slice(1, -1);
    }
    return val.replace(/\[|\]/g, '');
}

const envContent = fs.readFileSync('d:/lsh/git/jejugroup/jeju-web/.env.alwaysdata', 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx > -1) {
        const k = line.substring(0, idx).trim();
        const v = line.substring(idx + 1).trim();
        if (k.startsWith('ALWAYSDATA_')) {
            envVars[k] = cleanVal(v);
        }
    }
});

let dbUrl = envVars['ALWAYSDATA_DB_URL']; // jdbc:mysql://host/db
let host = '';
let database = '';

if (dbUrl && dbUrl.startsWith('jdbc:mysql://')) {
    const withoutPrefix = dbUrl.substring(13);
    const slashIdx = withoutPrefix.indexOf('/');
    host = withoutPrefix.substring(0, slashIdx);
    database = withoutPrefix.substring(slashIdx + 1);
}

const user = envVars['ALWAYSDATA_DB_USER'];
const password = envVars['ALWAYSDATA_DB_PASSWORD'];

const mysql = require('mysql2/promise');

async function migrate() {
    console.log(`[DB Migration] Connecting to ${host} ... DB: ${database}`);
    
    if (!host || !database || !user || !password) {
        console.error("Missing DB credentials in env map");
        process.exit(1);
    }

    try {
        const connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });

        console.log(`[DB Migration] Dropping foreign key from board table...`);
        try {
            await connection.execute('ALTER TABLE board DROP FOREIGN KEY board_ibfk_1');
        } catch (e) {
            console.log(`[DB Migration] FK board_ibfk_1 does not exist, proceeding...`);
        }
        
        console.log(`[DB Migration] Dropping tables...`);
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('DROP TABLE IF EXISTS `member`');
        await connection.execute('DROP TABLE IF EXISTS `users`');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log(`[DB Migration] Executing CREATE TABLE users;`);
        
        const createQuery = `
        CREATE TABLE \`users\` (
            \`id\` varchar(50) PRIMARY KEY,
            \`pw\` varchar(255) NOT NULL,
            \`name\` varchar(20) NOT NULL,
            \`phone\` varchar(30) NOT NULL,
            \`gender\` char(1) NOT NULL,
            \`provider\` varchar(10) NOT NULL,
            \`role\` varchar(10) DEFAULT 'USER',
            \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await connection.execute(createQuery);
        
        console.log(`[DB Migration] users table created successfully.`);
        
        console.log(`[DB Migration] Restoring foreign key on board table...`);
        await connection.execute('ALTER TABLE board MODIFY author_id varchar(50)');
        // Delete orphaned records to satisfy FK constraint
        await connection.execute('DELETE FROM board WHERE author_id NOT IN (SELECT id FROM users)');
        await connection.execute('ALTER TABLE board ADD CONSTRAINT board_ibfk_1 FOREIGN KEY (author_id) REFERENCES users (id)');
        console.log(`[DB Migration] Foreign key restored successfully.`);
        
        const [rows, fields] = await connection.execute('DESC \`users\`');
        console.log('[DB Migration] Desc users output:');
        console.table(rows);
        
        await connection.end();
        console.log(`[DB Migration] Disconnected.`);
    } catch (err) {
        console.error("[DB Migration] Error:", err.message);
        process.exit(1);
    }
}

migrate();
