const debuggerActive = typeof v8debug === "object" || /--debug|--inspect/.test(process.execArgv.join(" "));
const settings = require("../settings");
const listAllFiles = require("./listAllFiles");
const jsl = require("svjsl");
const col = require("./consoleColors");
const seededRNG = require("./seededRNG");

if(!debuggerActive) var pb = new jsl.ProgressBar(8, `Loading all resource files...`);

const init = () => {
    let rn = seededRNG.generateSeededNumbers(settings.seed.numberCount, 5645104177);
    console.log(`\n\nSeed:   ${col.yellow}${rn.seed}${col.rst}`);
    console.log(`Result: ${col.yellow}${rn.joinedNumbers}${col.rst}\n`);

    process.exit();

    let allFiles = listAllFiles("C:/Users/Sven/Desktop/testRP");

    console.log(`\nBase path: "${allFiles.rpBasePath}"\nFound ${allFiles.files.length} resource files in ${allFiles.folders.length} folders`);
}

init();