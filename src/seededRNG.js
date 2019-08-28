const settings = require("../settings");
const jsl = require("svjsl");


/**
 * Creates a random seed and returns it
 * @returns {Number}
 */
const generateRandomSeed = () => {
    let seed = "";

    for(let i = 0; i < settings.seed.digitCount; i++)
    {
        seed += Math.floor(jsl.randRange(0, 9)).toString();
    }
    if(seed.startsWith("0")) return generateRandomSeed(); // make sure the first item is not 0, so we can parse it as an int without losing the first digit
    return parseInt(seed);
}

/**
 * 
 * @param {*} count 
 * @param {*} seed 
 */
const generateSeededNumbers = (count, seed) => { // thanks to olsn for this code snippet: http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    let result = [];
    let initialSeed = seed;

    if(jsl.isEmpty(seed) || seed.toString().length != settings.seed.digitCount) seed = generateRandomSeed();

    let seededRandom = (min, max) => {
        max = max || 1;
        min = min || 0;
    
        seed = (seed * 9301 + 49297) % 233280;
        let rnd = seed / 233280;
    
        return Math.floor(min + rnd * (max - min));
    }

    for(let i = 0; i < count; i++)
    {
        result.push(seededRandom(0, 9));
    }

    if(result[0] == 0) result[0] = 1; // make sure the first item is not 0, so we can parse it as an int without losing the first digit

    return {
        numbers: result,
        seed: initialSeed,
        joinedNumbers: result.join("")
    }
}

module.exports = { generateSeededNumbers, generateRandomSeed };