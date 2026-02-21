const { execSync } = require("child_process");

try {
    console.log("Running Vite build securely via Node directly...");
    // By directly using Node on the actual Vite javascript file rather than the .bin shell script,
    // we completely bypass the Vercel Linux "Permission Denied" issue caused by folder spaces!
    execSync("node ./node_modules/vite/bin/vite.js build", { stdio: "inherit" });
} catch (error) {
    console.error("Build failed:", error.message);
    process.exit(1);
}
