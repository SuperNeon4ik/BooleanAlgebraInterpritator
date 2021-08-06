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
const debugMode = process.argv.findIndex(el => el.toLowerCase() == "--debug-mode") > -1;

// Output info about the package
console.log(`${packageConfig.name} by ${packageConfig.author}.\nVersion : ${packageConfig.version}\n`);
if (debugMode) console.log(ChatColor.generateConsolePrefix("&3b"), "WARNING !!! Debug Mode is enabled.\n");

// DEBUG : Output handled arguments
if (debugMode) ChatColor.log("&6bHandled arguments : &0a[ " + process.argv.join(", ") + " ]");

// Check if file is provided in arguments
if (process.argv.length < (debugMode ? 4 : 3)) {
    // Has file path provided
    readline.close();
}
else {
    // Has no file path provided
}