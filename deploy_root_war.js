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
        let k = line.substring(0, idx).trim();
        let v = line.substring(idx + 1).trim();
        if (k.startsWith('ALWAYSDATA_')) {
            envVars[k] = cleanVal(v);
        }
    }
});

const HOST = envVars['ALWAYSDATA_SSH_HOST'];
const USER = envVars['ALWAYSDATA_SSH_USER'];
const PASS = envVars['ALWAYSDATA_SSH_PASSWORD'];

try {
    const warPath = 'd:/lsh/git/jejugroup/jeju-web/build/jeju-web.war';
    const sftpUrl = `sftp://${HOST}/home/${USER}/ROOT.war`;
    console.log(`Uploading war file as ROOT.war to avoid context mapping hell`);
    
    // Hide password in output
    const cmd = `curl -k -T "${warPath}" -u "${USER}:${PASS}" "${sftpUrl}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log("Upload ROOT.war Success.");
} catch(e) {
    console.error("Deploy Error:", e.message || e);
    if (e.stderr) {
        console.error("Stderr:", e.stderr.toString().replace(new RegExp(PASS, 'g'), '***'));
    }
    process.exit(1);
}
