/**
 * Console color codes
 * @typedef {Object} ConsoleColors
 * @prop {String} rst Reset to default
 * @prop {String} reset Reset to default
 * @prop {String} fat Creates fat text
 * @prop {String} red Red colored text
 * @prop {String} green Green colored text
 * @prop {String} yellow Yellow colored text
 * @prop {String} blue Blue colored text
 * @prop {String} pink Pink colored text
 * @prop {String} cyan Cyan colored text
 */
const colors = {
    rst:    "\x1b[0m",
    reset:  "\x1b[0m",
    fat:    "\x1b[37m",
    red:    "\x1b[31m\x1b[1m",
    green:  "\x1b[32m\x1b[1m",
    yellow: "\x1b[33m\x1b[1m",
    blue:   "\x1b[34m\x1b[1m",
    pink:   "\x1b[35m\x1b[1m",
    cyan:   "\x1b[36m\x1b[1m"
}

module.exports = colors;