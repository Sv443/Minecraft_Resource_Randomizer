const debuggerActive = typeof v8debug === "object" || /--debug|--inspect/.test(process.execArgv.join(" "));
const settings = require("../settings");
const listAllFiles = require("./listAllFiles");
const jsl = require("svjsl");
const col = require("./consoleColors");
const seededRNG = require("./seededRNG");

if(!debuggerActive) var pb = new jsl.ProgressBar(8, `Parsing all resource files...`);

const init = () => {
    let parseFilesHR = process.hrtime();
    let allFiles = listAllFiles("C:/Users/Sven/Desktop/testRP");
    let parseFilesHR_M = (process.hrtime(parseFilesHR)[1] / 1e6).toFixed(2);


    // console.log(`\nBase path: "${allFiles.rpBasePath}"\nFound ${allFiles.files.length} resource files in ${allFiles.folders.length} folders`);
    if(!debuggerActive) pb.next(`Done parsing resource files after ${parseFilesHR_M}ms`);
}

init();