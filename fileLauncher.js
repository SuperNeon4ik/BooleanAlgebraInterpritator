function parse(plainText) {
    let generalTokens = plainText.trim().replace(/\s+/g, " ")
        .split(/;\s*\n*\s*/g);

    const chatColor = require("./modules/ChatColor");

    generalTokens.forEach((el, i) => {
        if (!el.startsWith("#")) {
            let subtokens = el.split(/(?<!".*)\s+(?!.*")/g);
            subtokens.forEach((el2, i2) => {
                chatColor.log(`&6bINFO &0dT${i}S${i2} : &0a${el2}`);
            });
        }
    });
}

function deploy(tokens) {

}

function execute(plainText) {
    deploy(parse(plainText));
}

module.exports = { parse, deploy, execute }