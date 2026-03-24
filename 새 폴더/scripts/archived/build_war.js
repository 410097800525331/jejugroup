const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const JEJU_WEB = path.join(ROOT_DIR, 'jeju-web');
const SRC_JAVA = path.join(JEJU_WEB, 'src', 'main', 'java');
const WEBAPP_DIR = path.join(JEJU_WEB, 'src', 'main', 'webapp');
const CLASSES_DIR = path.join(WEBAPP_DIR, 'WEB-INF', 'classes');
const LIB_DIR = path.join(WEBAPP_DIR, 'WEB-INF', 'lib');
const SCRIPTS_LIB_DIR = path.join(__dirname, 'lib');
const SERVLET_API_JAR = path.join(SCRIPTS_LIB_DIR, 'servlet-api.jar');
const OUTPUT_WAR = path.join(JEJU_WEB, 'ROOT.war');

// Utility to run shell commands synchronously
function run(cmd, cwd = ROOT_DIR) {
    console.log(`\x1b[36m> ${cmd}\x1b[0m`);
    try {
        execSync(cmd, { stdio: 'inherit', cwd });
    } catch (e) {
        console.error(`\x1b[31m[ERROR] Command failed: ${cmd}\x1b[0m`);
        process.exit(1);
    }
}

// Download file utility
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        console.log(`📡 Downloading ${url} ...`);
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                fs.unlink(dest, () => reject(new Error(`Failed to get '${url}' (${response.statusCode})`)));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

// Recursively find all .java files
function findJavaFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findJavaFiles(filePath, fileList);
        } else if (file.endsWith('.java')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

async function build() {
    console.log("🔨 \x1b[33mJeju Web Automatic WAR Build Script\x1b[0m");

    // 1. Ensure required directories
    if (!fs.existsSync(SCRIPTS_LIB_DIR)) fs.mkdirSync(SCRIPTS_LIB_DIR, { recursive: true });
    if (!fs.existsSync(CLASSES_DIR)) fs.mkdirSync(CLASSES_DIR, { recursive: true });

    // 2. Resolve servlet-api.jar dependency for building servlets manually
    if (!fs.existsSync(SERVLET_API_JAR)) {
        console.log("📦 servlet-api.jar not found locally. Downloading from Maven Central...");
        try {
            await downloadFile('https://repo1.maven.org/maven2/javax/servlet/javax.servlet-api/4.0.1/javax.servlet-api-4.0.1.jar', SERVLET_API_JAR);
            console.log("✅ Download complete.");
        } catch (e) {
            console.error("❌ Failed to download servlet API:", e.message);
            process.exit(1);
        }
    }

    // 3. Compile Java Source Code
    const javaFiles = findJavaFiles(SRC_JAVA);
    if (javaFiles.length === 0) {
        console.warn("⚠️ No .java files found in src/main/java");
    } else {
        console.log(`\n⚙️ Compiling ${javaFiles.length} Java files...`);
        // We write the list of files to a temporary file to prevent command line length limits
        const sourcesFile = path.join(__dirname, 'sources.txt');
        fs.writeFileSync(sourcesFile, javaFiles.join('\n'), 'utf-8');

        // Platform independent classpath formatting
        const sep = process.platform === 'win32' ? ';' : ':';
        const classPath = `"${path.join(LIB_DIR, '*').replace(/\\/g, '/')}${sep}${SERVLET_API_JAR.replace(/\\/g, '/')}"`;
        
        // Compile using javac
        run(`javac -encoding UTF-8 -cp ${classPath} -d "${CLASSES_DIR}" @"${sourcesFile}"`);
        fs.unlinkSync(sourcesFile);
        console.log("✅ Java compilation complete.");
    }

    // 4. Package into ROOT.war
    console.log("\n📦 Packaging ROOT.war ...");
    if (fs.existsSync(OUTPUT_WAR)) {
        fs.unlinkSync(OUTPUT_WAR);
    }
    run(`jar cvf "${OUTPUT_WAR}" -C "${WEBAPP_DIR}" .`);
    console.log(`\n🎉 Build Complete! Artifact created at: \x1b[32m${OUTPUT_WAR}\x1b[0m`);
    console.log("🚀 You can now run `node scripts/deploy.js` to deploy to AlwaysData.");
}

if (require.main === module) {
    build();
}
module.exports = build;
