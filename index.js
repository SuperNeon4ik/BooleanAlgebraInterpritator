// Initializing Libraries & Packages
const packageConfig = require("./package.json");
const rl = require("readline");
const ChatColor = require("./modules/ChatColor");

// Initializing readline
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initialize variables
var debugMode = process.argv.findIndex(el => el.toLowerCase() == "--debug-mode") > -1;

// Output info about the package
console.log(`${packageConfig.name} by ${packageConfig.author}.\nVersion : ${packageConfig.version}`);
if (debugMode) console.log("WARNING !!! Debug Mode is enabled.");

// DEBUG : Output handled arguments
if (debugMode) console.log("Handled arguments : " + process.argv);
if (process.argv.length < (debugMode ? 4 : 3)) {
    // Has file path provided
}
else {
    // Has no file path provided
}