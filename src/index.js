const debuggerActive = typeof v8debug === "object" || /--debug|--inspect/.test(process.execArgv.join(" "));
const settings = require("../settings");
const listAllFiles = require("./listAllFiles");
const jsl = require("svjsl");
const col = require("./consoleColors");
const seededRNG = require("./seededRNG");

console.log(`\n\n\n\n\n`);
if(!debuggerActive) var pb = new jsl.ProgressBar(8, `Parsing all resource files...`);

const init = () => {
    let parseFilesHR = process.hrtime();
    let allFiles = listAllFiles("C:/Users/Sven/Desktop/testRP");
    let parseFilesHR_M = (process.hrtime(parseFilesHR)[1] / 1e6).toFixed(2);


    if(!debuggerActive) pb.next(`Done parsing ${col.yellow}${allFiles.files.length}${col.rst} resource files in ${col.yellow}${allFiles.folders.length}${col.rst} folders after ${col.yellow}${parseFilesHR_M}ms${col.rst}`);
}

init();