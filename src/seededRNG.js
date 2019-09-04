const settings = require("../settings");
const jsl = require("svjsl");


/**
 * Creates a random seed according to `settings.js`
 * @returns {Number}
 */
const generateRandomSeed = () => {
    let seed = "";

    for(let i = 0; i < settings.seed.digitCount; i++)
    {
        seed += Math.floor(jsl.randRange(settings.seed.digitRange[0], settings.seed.digitRange[1]) + 1).toString();
    }
    if(seed.startsWith("0"))
    {
        seed = seed.substring(1); // make sure the first item is not 0, so we can parse it as an int without losing the first digit
        seed = (Math.floor(Math.random() * (settings.seed.digitRange[1] - 1)) + 1).toString() + seed;
    }
    return parseInt(seed);
}

/**
 * @typedef {Object} SeededRandomNumbers
 * @prop {Array<Number>} numbers An array of the random numbers
 * @prop {Number} seed
 * @param {String} joined The random numbers, but as a string
 */

/**
 * Generates random numbers based on a seed
 * @param {Number} count How many random numbers should be generated
 * @param {Number} seed 
 * @returns {SeededRandomNumbers}
 */
const generateSeededNumbers = (count, seed) => { // thanks to olsn for this code snippet: http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    let result = [];
    let initialSeed = seed;

    seed = validateSeed(seed) ? parseInt(seed) : generateRandomSeed();

    let seededRandom = (min, max) => {
        max = max || 1;
        min = min || 0;
    
        seed = (seed * 9301 + 49297) % 233280;
        let rnd = seed / 233280;
    
        return Math.floor(min + rnd * (max - min));
    }

    for(let i = 0; i < count; i++)
        result.push(seededRandom(settings.seed.digitRange[0], settings.seed.digitRange[1]));

    if(result[0] == 0)
        result[0] = 1; // make sure the first item is not 0, so we can parse it as an int without losing the first digit

    return {
        numbers: result,
        seed: initialSeed,
        joined: result.join("")
    }
}

/**
 * Validates a seed based on `settings.js`
 * @param {(Number|String)} seed 
 * @return {Boolean}
 */
const validateSeed = seed => {
    seed = seed.toString();

    let regex = new RegExp(`^[${settings.seed.digitRange[0]}-${settings.seed.digitRange[1]}]{${settings.seed.digitCount}}$`, "gm");

    if(!seed.match(regex) || seed.includes("\n"))
        return false;

    if(seed.length == settings.seed.digitCount)
        return true;

    return false;
}

module.exports = { generateSeededNumbers, generateRandomSeed, validateSeed };