// Initializing Libraries & Packages
const fs = require("fs");
const rl = require("readline");
const packageConfig = require("./package.json");
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
    // Has no file path provided
}
else {
    // Has file path provided
    let file = undefined;
    process.argv.forEach((el, i) => {
        if (i > 1 && el.endsWith(".boolscript")) {
            file = el;
        }
    });

    if (file == undefined) {
        ChatColor.log(ChatColor.FG_RED + "ERR " + ChatColor.CC_EXTRA_WHITE + "No '.boolscript' file found in arguments.");
        return;  
    }
    else {
        if (debugMode) ChatColor.log(ChatColor.FG_CYAN + "File FOUND : " + ChatColor.RESET + file);

        try {
            let contents = fs.readFileSync(file);
            if (debugMode) ChatColor.log(ChatColor.FG_CYAN + "INFO " + ChatColor.CC_EXTRA_WHITE + `File ('${file}') contents found:${ChatColor.RESET}\n${contents}`);
        }
        catch (ex) {
            ChatColor.log(ChatColor.FG_RED + "ERR " + ChatColor.CC_EXTRA_WHITE + "Can't read the file '" + file + "'.");
            return;  
        }
    }
}

readline.close(); // close since we don't use readline yet.