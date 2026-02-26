const fs = require('fs');
const https = require('https');

const envContent = fs.readFileSync('d:/lsh/git/jejugroup/jeju-web/.env.alwaysdata', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx > -1) {
        let k = line.substring(0, idx).trim();
        let v = line.substring(idx + 1).trim();
        v = v.replace(/^\[|\]$/g, '');
        envVars[k] = v;
    }
});

const USER = envVars['ALWAYSDATA_SSH_USER'];
const PASS = envVars['ALWAYSDATA_SSH_PASSWORD'];

async function checkSite() {
    const authHeader = 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64');
    const apiBase = 'https://api.alwaysdata.com/v1/site/';
    
    // dynamically import node-fetch 
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(() => globalThis.fetch(...args));
    
    try {
        const res = await fetch(apiBase, { headers: { 'Authorization': authHeader } });
        if (!res.ok) {
            console.error(`Failed to fetch sites: HTTP ${res.status}`);
            return;
        }
        
        const sites = await res.json();
        const targetSite = sites.find(s => s.addresses.some(a => a.name.includes('jejugroup.alwaysdata.net')));
        
        if (!targetSite) {
            console.log("No matching site found.");
            return;
        }

        console.log(`=== Site Information ===`);
        console.log(`ID: ${targetSite.id}`);
        console.log(`Name: ${targetSite.name}`);
        console.log(`Type: ${targetSite.type}`);
        console.log(`Path (URL Route): ${targetSite.path}`);
        console.log(`Java App Path (File Path): ${targetSite.java_app_path}`);
        console.log(`Java Version: ${targetSite.java_version}`);
        console.log(`State: ${targetSite.state || 'N/A'}`);
        
    } catch (err) {
        console.error("Error:", err);
    }
}
checkSite();
