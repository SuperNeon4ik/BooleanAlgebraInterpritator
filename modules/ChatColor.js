const colorRegex = /(\\x1b\[[0-8,30-37,40-47]m)*/g;
const codeRegex = /((?<!\\)\&[[0-6]a,[0-7][b,c],[0-4]d])*/g;

// Main Colors
const RESET = "\x1b[0m";
const BRIGHT = "\x1b[1m";
const DIM = "\x1b[2m";
const UNDERSCORE = "\x1b[4m";
const BLINK = "\x1b[5m";
const REVERSE = "\x1b[7m";
const HIDDEN = "\x1b[8m";

// ForeGround (text) Colors
const FG_BLACK = "\x1b[30m";
const FG_RED = "\x1b[31m";
const FG_GREEN = "\x1b[32m";
const FG_YELLOW = "\x1b[33m";
const FG_BLUE = "\x1b[34m";
const FG_MAGENTA = "\x1b[35m";
const FG_CYAN = "\x1b[36m";
const FG_WHITE = "\x1b[37m";

// BackGround Colors
const BG_BLACK = "\x1b[40m";
const BG_RED = "\x1b[41m";
const BG_GREEN = "\x1b[42m";
const BG_YELLOW = "\x1b[43m";
const BG_BLUE = "\x1b[44m";
const BG_MAGENTA = "\x1b[45m";
const BG_CYAN = "\x1b[46m";
const BG_WHITE = "\x1b[47m";

// Color Combos
const CC_EXTRA_WHITE = FG_WHITE + BRIGHT;
const CC_BRIGHT_RED = FG_RED + BRIGHT;
const CC_BRIGHT_YELLOW = FG_YELLOW + BRIGHT;
const CC_BRIGHT_GREEN = FG_GREEN + BRIGHT;
const CC_BRIGHT_CYAN = FG_CYAN + BRIGHT;

// Color Codes
const ColorCodes = {
    "&0a": RESET,
    "&1a": BRIGHT,
    "&2a": DIM,
    "&3a": UNDERSCORE,
    "&4a": BLINK,
    "&5a": REVERSE,
    "&6a": HIDDEN,

    "&0b": FG_BLACK,
    "&1b": FG_RED,
    "&2b": FG_GREEN,
    "&3b": FG_YELLOW,
    "&4b": FG_BLUE,
    "&5b": FG_MAGENTA,
    "&6b": FG_CYAN,
    "&7b": FG_WHITE,

    "&0c": BG_BLACK,
    "&1c": BG_RED,
    "&2c": BG_GREEN,
    "&3c": BG_YELLOW,
    "&4c": BG_BLUE,
    "&5c": BG_MAGENTA,
    "&6c": BG_CYAN,
    "&7c": BG_WHITE,

    "&0d": CC_EXTRA_WHITE,
    "&1d": CC_BRIGHT_RED,
    "&2d": CC_BRIGHT_YELLOW,
    "&3d": CC_BRIGHT_GREEN,
    "&4d": CC_BRIGHT_CYAN,
};

function generateConsolePrefix(color) {
    let match = codeRegex.test(color);
    if (match) color = ColorCodes[color];

    match = colorRegex.test(color);
    if (match) return color + "%s" + RESET;
    else return RESET;
}

function replaceColorCodes(input) {
    let matches = input.match(/&\d[a,b,c,d]/g);

    if (matches != null) {
        matches.forEach(el => {
            if (ColorCodes[el] != undefined) input = input.replace(el, ColorCodes[el]);
        });
    }
    
    return input + RESET;
}

function log(input) {
    console.log(replaceColorCodes(input) + RESET);
}

module.exports = { 
    RESET, BRIGHT, DIM, UNDERSCORE, BLINK, REVERSE, HIDDEN,
    FG_BLACK, FG_RED, FG_GREEN, FG_YELLOW, FG_BLUE, FG_MAGENTA, FG_CYAN, FG_WHITE,
    BG_BLACK, BG_RED, BG_GREEN, BG_YELLOW, BG_BLUE, BG_MAGENTA, BG_CYAN, BG_WHITE,
    CC_EXTRA_WHITE, CC_BRIGHT_RED, CC_BRIGHT_YELLOW, CC_BRIGHT_GREEN, CC_BRIGHT_CYAN,

    generateConsolePrefix, replaceColorCodes, log
};