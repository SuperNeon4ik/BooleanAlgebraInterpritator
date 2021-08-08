const chatColor = require("./modules/ChatColor");

const MixedArgumentationTokens = [ "and", "or" ];
var debugMode = false;
const ParsingError = { 
    NONE: "NONE",
    WRONG_USAGE: "WRONG_USAGE", 
    TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND", 
    UNEXPECTED_ERROR: "UNEXPECTED_ERROR" 
};

function parse(plainText) {
    let generalTokens = plainText.trim().replace(/\s+/g, " ")
        .split(/\s*;\s*\n*\s*/g);
    let tokens = [];

    let errorCount = 0;
    generalTokens.forEach((el, i) => {
        if (!el.startsWith("#") && el != "") {
            let subtokens = el.split(/(?<!".*)\s+(?!.*")/g);
            let pretokens = [];
            subtokens.forEach((el2, i2) => {
                if (el2 != "") {
                    let parsingError = ParsingError.NONE;
                    try {
                        if (el2 == "and" || el2 == "or") {
                            if (i2 <= 0 || i2 >= subtokens.length - 1) parsingError = ParsingError.WRONG_USAGE;
                            else {
                                let str1 = pretokens.pop();
                                let str2 = subtokens[i2 + 1];

                                let val1 = undefined;
                                let val2 = undefined;

                                if (str1 == 0) val1 = false;
                                else if (str1 == 1) val1 = true;
                                else val1 = null;

                                if (str2 == 0) val2 = false;
                                else if (str2 == 1) val2 = true;
                                else val2 = null;

                                if (val1 == null || val2 == null) parsingError = ParsingError.WRONG_USAGE;
                                else {
                                    let result = undefined;

                                    if (el2 == "and") {
                                        if (val1 && val2) result = val1;
                                        else if (!val1 && !val2) result = val1;
                                        else if (!val1 && val2) result = val1;
                                        else if (val1 && !val2) result = val2;
                                    }
                                    else if (el2 == "or") {
                                        if (val1 && val2) result = val1;
                                        else if (!val1 && !val2) result = val1;
                                        else if (!val1 && val2) result = val1;
                                        else if (val1 && !val2) result = val2;
                                    }

                                    if (result == undefined) parsingError = ParsingError.UNEXPECTED_ERROR;
                                    else {
                                        subtokens[i2 + 1] = result ? "1" : "0";

                                        if (debugMode) 
                                            chatColor.log(`&6bDEBUG &0dMade an action at T${i}S${i2} : &0a${val1} ${el2} ${val2} = ${result}`);
                                    }
                                }
                            }
                        }
                        else {
                            pretokens.push(el2);
                        }
                    }
                    catch (err) {
                        parsingError = ParsingError.UNEXPECTED_ERROR;
                        if (debugMode) console.log(err);
                    }

                    if (parsingError != ParsingError.NONE) {
                        errorCount++;

                        let errorDesc = `Failed ${el2}`;
                        if (parsingError == ParsingError.WRONG_USAGE)
                            errorDesc = `Wrong '${el2}' usage`;
                        else if (parsingError == ParsingError.TOKEN_NOT_FOUND)
                            errorDesc = `Can't understand token '${el2}'`;
                        else if (parsingError == ParsingError.UNEXPECTED_ERROR) 
                            errorDesc = `Unexpected Error at token '${el2}'`;

                        chatColor.log(`&1bERR &0dParsing Error : ${errorDesc}. &0aT${i}S${i2} - Line ${i}.`);
                        return null;
                    }

                    if (debugMode) chatColor.log(`&6bDEBUG &0dT${i}S${i2} : &0a${el2}`);
                }
            });

            tokens.push(pretokens);
        }
    });

    if (errorCount > 0) {
        chatColor.log(`&1bFATAL ERR &0dGot ${errorCount} errors. &0aSee the list above.`);
        return null;   
    }
    
    if (debugMode) chatColor.log(`&6bINFO &0aSuccessfully parsed the code.`);
    return tokens;
}

function deploy(tokens) {
    if (debugMode)
        chatColor.log("&6bDEBUG &0dDEPLOY - Got an input : &0a[ '" + tokens.join("', '") + "' ]");

    tokens.forEach((el, i) => {
        if (el[0].startsWith("print")) {
            let text = el[1];
            if (text == undefined) text = el[0].substring(7, el[0].length - 1);
            chatColor.log("&4bOUT &0a" + text);
        }
    });
}

function execute(plainText, isDebugMode) {
    if (typeof (isDebugMode) == "boolean")
        debugMode = isDebugMode;

    const tokens = parse(plainText);
    if (tokens == null) throw "Tokens can't be NULL";
    else {
        deploy(tokens);
    }
}

module.exports = { parse, deploy, execute };