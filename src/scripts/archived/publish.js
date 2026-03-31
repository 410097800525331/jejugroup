const build_war = require('./build_war');
const deploy = require('./deploy');

async function publish() {
    console.log("==========================================");
    console.log("🚀 Jeju Group One-Click Build & Deployment 🚀");
    console.log("==========================================\n");

    try {
        console.log("▶ [Step 1] Compiling Java codes and Packaging ROOT.war...");
        await build_war();
        
        console.log("\n▶ [Step 2] Pushing ROOT.war to AlwaysData Server via SSH...");
        await deploy();

        console.log("\n==========================================");
        console.log("🎉 ALL OPERATIONS FINISHED SUCCESSFULLY 🎉");
        console.log("==========================================");
    } catch (e) {
        console.error("\n❌ [Publish Pipeline Failed] Process terminated prematurely:");
        console.error(e);
        process.exit(1);
    }
}

// Execute the pipeline
publish();
