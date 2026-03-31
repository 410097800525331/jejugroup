const { NodeSSH } = require('node-ssh');
const env = require('./env');

const ssh = new NodeSSH();

async function check() {
  await ssh.connect({
    host: env.SSH_HOST,
    username: env.SSH_USER,
    password: env.SSH_PASSWORD,
  });
  
  const result = await ssh.execCommand('ls -la ~');
  console.log('Home:', result.stdout);
  
  const result2 = await ssh.execCommand('find ~ -name "ROOT.war" 2>/dev/null');
  console.log('ROOT.war paths:', result2.stdout);
  
  const result3 = await ssh.execCommand('find ~ -name "webapps" 2>/dev/null');
  console.log('webapps paths:', result3.stdout);
  
  ssh.dispose();
}
check();
