import os
import subprocess
import urllib.request
import json
import base64

def clean_val(v):
    v = v.strip()
    if v.startswith('[') and v.endswith(']'):
        return v[1:-1]
    return v

env_vars = {}
with open('d:/lsh/git/jejugroup/jeju-web/.env.alwaysdata', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#'): continue
        if '=' in line:
            k, v = line.split('=', 1)
            env_vars[k.strip()] = clean_val(v)

HOST = env_vars['ALWAYSDATA_SSH_HOST']
USER = env_vars['ALWAYSDATA_SSH_USER']
PASS = env_vars['ALWAYSDATA_SSH_PASSWORD']

DB_URL = env_vars['ALWAYSDATA_DB_URL']
DB_USER = env_vars['ALWAYSDATA_DB_USER']
DB_PASS = env_vars['ALWAYSDATA_DB_PASSWORD']

# 1. SFTP Upload
war_path = 'd:/lsh/git/jejugroup/jeju-web/build/jeju-web.war'
sftp_url = f"sftp://{HOST}/home/{USER}/jeju-web.war"
print(f"Uploading war file to: {sftp_url}")
cmd = ['curl', '-k', '-T', war_path, '-u', f"{USER}:{PASS}", sftp_url]
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("SFTP Upload Failed:", res.stderr.replace(PASS, '***'))
    print("Exit code:", res.returncode)
    exit(1)
print("Upload Success.")

# 2. Alwaysdata API: Find site or create
api_base = "https://api.alwaysdata.com/v1/site/"
auth_str = f"{USER} account API token" # Actually Alwaysdata API can use API token or basic auth with account password.
# Alwaysdata API Basic Auth expects the API token as the username and empty password, or accountname and password?
# Let's check if the Password is the main account password.
# We will use basic auth with USER and PASS for API. It might fail if it's just an SSH user.
b64_auth = base64.b64encode(f"{USER}:{PASS}".encode()).decode()

headers = {
    'Authorization': f"Basic {b64_auth}",
    'Content-Type': 'application/json'
}

req = urllib.request.Request(api_base, method="GET", headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        sites = json.loads(resp.read())
except Exception as e:
    print("API Error getting sites:", str(e))
    # If API fails, we just don't do this step and output it
    exit(0)

target_domain = f"jejugroup.alwaysdata.net"
target_site = None
for s in sites:
    if any(target_domain in addr['name'] for addr in s.get('addresses', [])):
        target_site = s
        break

env_vars_payload = {
    "DB_URL": DB_URL,
    "DB_USER": DB_USER,
    "DB_PASSWORD": DB_PASS
}
app_path = f"/home/{USER}/jeju-web.war"
# For java type site, the path is the URL path. 
# And the application path is java_app_path or command?
site_payload = {
    "name": target_domain,
    "path": "/jeju-web",
    "type": "java",
    "java_app_path": app_path,
    "java_version": "21",
    "addresses": [{"name": target_domain}],
    "environment": env_vars_payload
}

if target_site:
    print(f"Site found, updating config for site id: {target_site['id']}")
    # Update is PUT
    # Need to keep other params safe, so just update these
    target_site['java_app_path'] = app_path
    target_site['environment'] = env_vars_payload
    target_site['path'] = "/jeju-web"
    target_site['type'] = "java"
    req = urllib.request.Request(f"{api_base}{target_site['id']}/", data=json.dumps(target_site).encode(), headers=headers, method="PUT")
else:
    print("Site not found, creating new site...")
    req = urllib.request.Request(api_base, data=json.dumps(site_payload).encode(), headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as resp:
        print("API Response:", resp.status)
        if target_site:
            restart_req = urllib.request.Request(f"{api_base}{target_site['id']}/restart/", data=b'', headers=headers, method="POST")
            with urllib.request.urlopen(restart_req) as r_resp:
                print("Site restarted:", r_resp.status)
except urllib.error.HTTPError as e:
    print("API Update Error:", repr(e))
    print(e.read().decode())
    exit(1)

print("Deployment Complete.")
