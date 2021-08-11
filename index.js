// Initializing Libraries & Packages
const fs = require("fs");
const rl = require("readline");
const packageConfig = require("./package.json");

const ChatColor = require("./modules/ChatColor");
const fileLauncher = require("./fileLauncher");

// Initializing readline
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initialize variables
const isDebugMode = process.argv.findIndex(el => el.toLowerCase() == "--debug-mode") > -1;
const outputParsing = process.argv.findIndex(el => el.toLowerCase() == "--parse-output") > -1;

// Output info about the package
ChatColor.log(`${packageConfig.name} by ${packageConfig.author}.\n` +
    `Version : ${packageConfig.version} &1bPROTOTYPE VERSION\n`);
if (isDebugMode) ChatColor.log("&3bWARNING &0dDebug Mode is enabled.");
if (outputParsing) ChatColor.log("&3bWARNING &0dParsing Output is enabled.");
if (isDebugMode || outputParsing) console.log();

// DEBUG : Output handled arguments
if (isDebugMode) ChatColor.log("&3bDEBUG &0dHandled arguments : &0a[ " + process.argv.join(", ") + " ]");

// Check if file is provided in arguments
if (process.argv.length < (isDebugMode ? 4 : 3)) {
    // Has no file path provided
}
else {
    // Has file path provided
    runTheProvidedFile();
}

readline.close(); // close since we don't use readline yet.

/* FUNCTIONS */

function runTheProvidedFile() {
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
        if (isDebugMode) ChatColor.log(ChatColor.FG_CYAN + "DEBUG " + ChatColor.CC_EXTRA_WHITE + "File FOUND : " + ChatColor.RESET + file);

        try {
            let contents = fs.readFileSync(file).toString();
            if (isDebugMode) ChatColor.log(ChatColor.FG_CYAN + "INFO " + ChatColor.CC_EXTRA_WHITE + `File ('${file}') contents found.`);

            try {
                fileLauncher.execute(contents, isDebugMode, outputParsing);
            }
            catch (ex) {
                ChatColor.log(ChatColor.FG_RED + "FATAL ERR " + ChatColor.CC_EXTRA_WHITE + "Failed to execute the code '" + file + "'.");
                if (isDebugMode) console.log(ex);
                return;
            }
        }
        catch (ex) {
            ChatColor.log(ChatColor.FG_RED + "FATAL ERR " + ChatColor.CC_EXTRA_WHITE + "Can't read the file '" + file + "'.");
            return;  
        }
    }
}