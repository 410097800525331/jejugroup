const fs = require('fs');
const mysql = require('mysql2/promise');

const envContent = fs.readFileSync('d:/lsh/git/jejugroup/jeju-web/.env.alwaysdata', 'utf-8');
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

async function check() {
    const conn = await mysql.createConnection({
        host: host, user: envVars['ALWAYSDATA_DB_USER'], password: envVars['ALWAYSDATA_DB_PASSWORD'], database: database
    });
    const [rows] = await conn.execute(
        `SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_COLUMN_NAME
         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE REFERENCED_TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME = 'users'`, 
         [database]
    );
    console.table(rows);
    await conn.end();
}
check();
