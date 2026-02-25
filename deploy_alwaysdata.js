const fs = require('fs');
const { execSync } = require('child_process');

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
        envVars[k] = cleanVal(v);
    }
});

const HOST = envVars['ALWAYSDATA_SSH_HOST'];
const USER = envVars['ALWAYSDATA_SSH_USER'];
const PASS = envVars['ALWAYSDATA_SSH_PASSWORD'];

const DB_URL = envVars['ALWAYSDATA_DB_URL'];
const DB_USER = envVars['ALWAYSDATA_DB_USER'];
const DB_PASS = envVars['ALWAYSDATA_DB_PASSWORD'];

async function deploy() {
    try {
        const warPath = 'd:/lsh/git/jejugroup/jeju-web/build/jeju-web.war';
        const sftpUrl = `sftp://${HOST}/home/${USER}/jeju-web.war`;
        console.log(`Uploading war file to: ${sftpUrl}`);
        
        // Use curl for SFTP upload
        // Hide password in output
        const cmd = `curl -k -T "${warPath}" -u "${USER}:${PASS}" "${sftpUrl}"`;
        execSync(cmd, { stdio: 'pipe' });
        console.log("Upload Success.");
        
        // 2. We can configure the Java site by logging into the Alwaysdata API
        // For Alwaysdata API, basic auth uses "account_token:" or basic auth with account credentials
        const authHeader = 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64');
        const apiBase = 'https://api.alwaysdata.com/v1/';
        
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(() => globalThis.fetch(...args));
        
        const res = await fetch(`${apiBase}site/`, {
            headers: { 'Authorization': authHeader }
        });
        
        if (!res.ok) {
            console.log(`API check skipped. HTTP ${res.status}`);
            return;
        }
        
        const sites = await res.json();
        const targetDomain = 'jejugroup.alwaysdata.net';
        const targetSite = sites.find(s => s.addresses.some(a => a.name.includes(targetDomain)));
        
        const appPath = `/home/${USER}/jeju-web.war`;
        const envPayload = { DB_URL, DB_USER, DB_PASSWORD: DB_PASS };
        
        if (targetSite) {
            console.log(`Site found, updating config for site id: ${targetSite.id}`);
            const updateRes = await fetch(`${apiBase}site/${targetSite.id}/`, {
                method: 'PUT',
                headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: "java",
                    java_app_path: appPath,
                    path: "/jeju-web",
                    environment: envPayload
                })
            });
            console.log(`Update API Response: ${updateRes.status}`);
            
            const restartRes = await fetch(`${apiBase}site/${targetSite.id}/restart/`, {
                method: 'POST',
                headers: { 'Authorization': authHeader }
            });
            console.log(`Restart API Response: ${restartRes.status}`);
        } else {
            console.log("Site not found. Creating...");
        }
        
    } catch (e) {
        console.error("Deploy Error:", e.message || e);
        if (e.stderr) {
            console.error("Stderr:", e.stderr.toString().replace(new RegExp(PASS, 'g'), '***'));
        }
        process.exit(1);
    }
}

deploy();
