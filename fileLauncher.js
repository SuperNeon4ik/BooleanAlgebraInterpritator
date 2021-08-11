const chatColor = require("./modules/ChatColor");

var debugMode = false;
var outputParse = false;
const ParsingError = { 
    NONE: "NONE",
    WRONG_USAGE: "WRONG_USAGE", 
    TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND", 
    UNEXPECTED_ERROR: "UNEXPECTED_ERROR" 
};

const WrongVariableNames = [ "print", "and", "or", "not", "="]
let variables = {};

function parse(plainText, isSubParse) {
    const generalTokens = plainText.trim().replace(/(\s+\n*)+/g, " ")
        .split(/\s*;\s*\n*\s*/g);
    const tokens = [];

    if (isSubParse != true) variables = {};

    let errorCount = 0;
    generalTokens.forEach((el, i) => {
        if (!el.startsWith("#") && el != "") {
            const preresolveTokens = /(?<!\(.*)\(.*\)(?!.*\))/g.exec(el);

            if (preresolveTokens != null) {
                preresolveTokens.forEach((el2, i2) => {
                    const code = el2.substring(1, el2.length - 1);
                    const output = parse(code, true);

                    if (output[1] != undefined) {
                        errorCount += output[1];
                        el = el.replace(el2, output[0] + "");
                        if (debugMode)
                            chatColor.log(`&1bERR &0dPreresolve Token : &0a'${code}' => '${output[0]}'`);
                    }
                    else {
                        el = el.replace(el2, output + "");
                        if (debugMode)
                            chatColor.log(`&3bDEBUG &0dPreresolve Token : &0a'${code}' => '${output}'`);
                    }
                });
            }

            let subtokens = el.split(/(?<!".*)\s+(?!.*")/g);
            let pretokens = [];

            if (debugMode && isSubParse != true)
                chatColor.log(`&3bDEBUG &0dT${i} : &0a[ ${subtokens.join(", ")} ]`);

            // parsing 'not' and strings
            subtokens.forEach((el2, i2) => {
                if (el2 != "") {
                    let parsingError = ParsingError.NONE;
                    try {
                        if (el2 == "not") {
                            if (i2 >= subtokens.length - 1) parsingError = ParsingError.WRONG_USAGE;
                            else {
                                let oldValue = subtokens[i2 + 1];
                                let value = null;

                                if (getVariableValue(oldValue, false) != undefined) 
                                    oldValue = getVariableValue(oldValue, false);

                                if (oldValue == 1) value = "0";
                                else if (oldValue == 0) value = "1";

                                if (value == null) parsingError = ParsingError.WRONG_USAGE;
                                else {
                                    subtokens[i2] = "";
                                    subtokens[i2 + 1] = value;

                                    if (debugMode && isSubParse != true) 
                                        chatColor.log(`&3bDEBUG &0dMade an action at T${i}S${i2} : &0a${el2} ${oldValue} = ${value}`);
                                }
                            }
                        }
                        
                        const regexExec = /(?<=").+(?=")/g.exec(el2);
                        if (regexExec != null) {
                            const original = regexExec[0];
                            let text = original;
                            const tags = /(?<!\\){.+}/g.exec(text);

                            if (tags != null) {
                                tags.forEach((el3, i3) => {
                                    const code = el3.substring(1, el3.length - 1);
                                    const output = parse(code, true);

                                    if (output[1] != undefined) {
                                        errorCount += output[1];
                                        text = text.replace(el3, output[0] + "");
                                        if (debugMode)
                                            chatColor.log(`&1bERR &0dString Tag : &0a'${el3}' => '${output[0]}'`);
                                    }
                                    else {
                                        text = text.replace(el3, output + "");
                                        if (debugMode)
                                            chatColor.log(`&3bDEBUG &0dString Tag : &0a'${el3}' => '${output}'`);
                                    }
                                });
                            }

                            subtokens[i2] = el2.replace(original, text);
                        }
                    }
                    catch (err) {
                        parsingError = ParsingError.UNEXPECTED_ERROR;
                        if (debugMode) console.log(err);
                    }
                }
            });

            // parsing 'and' & 'or'
            subtokens.forEach((el2, i2) => {
                if (el2 != "") {
                    let parsingError = ParsingError.NONE;
                    try {
                        if (el2 == "and" || el2 == "or" || el2 == "=") {
                            if (i2 <= 0 || i2 >= subtokens.length - 1) parsingError = ParsingError.WRONG_USAGE;
                            else {
                                let str1 = pretokens.pop();
                                let str2 = subtokens[i2 + 1];

                                if (el2 != "=") {
                                    if (getVariableValue(str1, false) != undefined) {
                                        if (debugMode) 
                                            chatColor.log(`&3bDEBUG &0a${str1} &0d=> &0a${getVariableValue(str1, false)}`);
                                        str1 = getVariableValue(str1, false);
                                    }
                                }
                                if (getVariableValue(str2, false) != undefined) {
                                    if (debugMode) 
                                        chatColor.log(`&3bDEBUG &0a${str2} &0d=> &0a${getVariableValue(str2, false)}`);
                                    str2 = getVariableValue(str2, false);
                                }

                                let val1 = undefined;
                                let val2 = undefined;

                                if (str1 == 0) val1 = false;
                                else if (str1 == 1) val1 = true;
                                else val1 = null;

                                if (str2 == 0) val2 = false;
                                else if (str2 == 1) val2 = true;
                                else val2 = null;

                                if (el2 == "and" || el2 == "or") {
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

                                            if (debugMode && isSubParse != true) 
                                                chatColor.log(`&3bDEBUG &0dMade an action at T${i}S${i2} : &0a${val1} ${el2} ${val2} = ${result}`);
                                        }
                                    }
                                }
                                else if (el2 == "=") {
                                    // setting variable's value
                                    if (str2 == "input" && val1 == null) {
                                        if (/[a-z,A-Z]+/g.test(str1) && !WrongVariableNames.includes(str1)) {
                                            variables[str1] = {
                                                value: "0",
                                                isDynamic: true
                                            };
                                            subtokens[i2 + 1] = "";

                                            if (debugMode && isSubParse != true) 
                                                chatColor.log(`&3bDEBUG &0dSet the dynamic variable value at T${i}S${i2} : &0a${str1} = input`);
                                        }
                                        else parsingError = ParsingError.WRONG_USAGE;
                                    }
                                    else if (val1 != null || val2 == null) parsingError = ParsingError.WRONG_USAGE;
                                    else {
                                        if (/[a-z,A-Z]+/g.test(str1) && !WrongVariableNames.includes(str1)) {
                                            variables[str1] = {
                                                value: str2,
                                                isDynamic: false
                                            };
                                            subtokens[i2 + 1] = "";

                                            if (debugMode && isSubParse != true) 
                                                chatColor.log(`&3bDEBUG &0dSet the variable value at T${i}S${i2} : &0a${str1} = ${val2}`);
                                        }
                                        else parsingError = ParsingError.WRONG_USAGE;
                                    }
                                }
                            }
                        }
                        else if (getVariableValue(el2, false) != undefined) {
                            if (debugMode) 
                                chatColor.log(`&3bDEBUG &0a${el2} &0d=> &0a${getVariableValue(el2, false)}`);
                            pretokens.push(getVariableValue(el2, false));
                        }
                        else pretokens.push(el2);                    
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
                }
            });

            if (pretokens.length > 0) tokens.push(pretokens);
        }
    });

    if (errorCount > 0) {
        if (isSubParse) {
            return [null, errorCount];
        }
        else {
            chatColor.log(`&1bFATAL ERR &0dGot ${errorCount} errors. &0aSee the list above.`);
            return null;   
        }
    }
    
    if (debugMode && isSubParse != true) chatColor.log(`&6bINFO &0aSuccessfully parsed the code.`);

    if (outputParse && isSubParse != true) {
        chatColor.log(`&6bINFO &0aOutputting parse code.`);
        const fs = require("fs");

        let output = "";
        tokens.forEach((el, i) => {
            output += el.join(" ") + ";\n";
        });

        fs.writeFileSync("parseOutput.boolscript", output);
    }

    return tokens;
}

function deploy(tokens) {
    if (debugMode)
        chatColor.log("&3bDEBUG &0dDEPLOY - Got an input : &0a[ '" + tokens.join("', '") + "' ]");

    tokens.forEach((el, i) => {
        if (el[0] != undefined && el[0] != null) {
            el.forEach((el2, i2) => {
                const regexExec = /(?<=").+(?=")/g.exec(el2);
                if (regexExec != null) {
                    const original = regexExec[0];
                    let text = original;

                    text = text.replace(/\\n/g, "\n&4bOUT &0a");
                    text = text.replace(/\\t/g, "\t");
                    text = text.replace(/\\{/g, "{");
                    el[i2] = el2.replace(original, text);
                }   
            });

            if (el[0].startsWith("print")) {
                let text = el[1];

                if (el[0].trim() == "print" && el.length == 1)
                    text = "";
                else if (text == undefined)
                    text = el[0].substring(7, el[0].length - 1);
                else if (el.length > 2)
                    chatColor.log("&1bERR &0dUnexpected argument count for token 'print'. &0aToken string : '" + el + "'")
                else {
                    if (text != 1 && text != 0) 
                        chatColor.log("&1bERR &0dUnexpected token. &0aToken string : '" + el + "'")
                }
                chatColor.log("&4bOUT &0a" + text);
            }
        }
    });
}

function execute(plainText, isDebugMode, doOutputParse) {
    if (typeof (isDebugMode) == "boolean")
        debugMode = isDebugMode;
    if (typeof (doOutputParse) == "boolean")
        outputParse = doOutputParse;

    const tokens = parse(plainText);
    if (tokens == null) throw "Tokens can't be NULL";
    else {
        deploy(tokens);
    }
}

function getVariableValue(name, isDynamic) {
    if (variables[name] == undefined) return undefined;
    else {
        const variable = variables[name];
        if (variable.isDynamic && isDynamic) return variable.value;
        else if (!variable.isDynamic && !isDynamic) return variable.value;
        else return undefined;
    }
}

module.exports = { parse, deploy, execute };