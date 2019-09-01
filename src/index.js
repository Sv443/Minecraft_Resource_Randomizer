const debuggerActive = typeof v8debug === "object" || /--debug|--inspect/.test(process.execArgv.join(" "));
const settings = require("../settings");
const listAllFiles = require("./listAllFiles");
const jsl = require("svjsl");
const col = require("./consoleColors");
const seededRNG = require("./seededRNG");
const fs = require("fs");
const downloadDefaultRP = require("./downloadDefaultRP");

console.log(`\n\n\n\n\n`);

var initTimestamp = 0;
var pb;
var userSettings = {
    gameVersion: "1.14",
    rpPath: "./.MRR/1.14/unzipped"
};

const init = () => {
    initTimestamp = Math.round(new Date().getTime());

    askSettings().then(() => {
        downloadDefaultRP(userSettings.gameVersion, pbMsg => {
            console.log(pbMsg);
        }, (currentFileSize, totalFileSize) => {
            process.stdout.cursorTo(0);
            process.stdout.clearLine();
            process.stdout.write(`> Downloading: ${col.yellow}${currentFileSize}MB${col.rst} / ${col.yellow}${totalFileSize}MB${col.rst}`);

            if(currentFileSize == totalFileSize)
            {
                process.stdout.cursorTo(0);
                process.stdout.clearLine();
                process.stdout.write(`Downloading: ${col.green}Done${col.rst}\n`);
            }
        }).then(() => {
            console.log(`Parsing all resource files...`);

            initResources().then(allFiles => {
                let doneTimestamp = Math.round(new Date().getTime());
                console.log(`\n\n${col.green}Done (after ${((doneTimestamp - initTimestamp) / 1000).toFixed(1)} seconds).${col.rst}`);
            }).catch(err => {
                initError(`Error while parsing resource files`, err);
            });
        }).catch(err => {
            initError(`Error while downloading/unzipping resource pack template`, err);
        });
    }).catch(err => {
        initError(`Error while asking for settings`, err);
    });
}

const initError = (title, detailed) => {
    console.log(`\n\n\n${col.red}${title}:${col.rst}\n${col.yellow}${detailed}${col.rst}\n`);
    console.log("(Window will automatically close after 20 seconds)");
    setTimeout(() => process.exit(1), 20000);
}

const initResources = () => {
    return new Promise((resolve, reject) => {
        try {
            let allFiles = listAllFiles(userSettings.rpPath);
            console.log(`Found ${col.yellow}${allFiles.files.textures.length}${col.rst} texture files and ${col.yellow}${allFiles.files.sounds.length}${col.rst} sound files in ${col.yellow}${allFiles.folders.length}${col.rst} folders`);

            resolve(allFiles);
        }
        catch(err)
        {
            reject(`Couldn't parse resource files due to error: ${err}`);
        }
    });
}

const askSettings = () => {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

init();