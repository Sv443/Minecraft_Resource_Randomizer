// const debuggerActive = typeof v8debug === "object" || /--debug|--inspect/.test(process.execArgv.join(" "));
const settings = require("../settings");
const listAllFiles = require("./listAllFiles");
const jsl = require("svjsl");
const col = require("./consoleColors");
const seededRNG = require("./seededRNG");
// const fs = require("fs");
const downloadDefaultRP = require("./downloadDefaultRP");
const readline = require("readline");
const opn = require("opn");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});






var initTimestamp = 0;
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
            process.stdout.write(` > Downloading: ${col.yellow}${currentFileSize}MB${col.rst} / ${col.yellow}${totalFileSize}MB${col.rst}`);

            if(currentFileSize == totalFileSize)
            {
                process.stdout.cursorTo(0);
                process.stdout.clearLine();
                process.stdout.write(` Downloading: ${col.green}Done${col.rst}\n`);
            }
        }).then(() => {
            console.log(` Parsing all resource files...`);

            initResources().then(allFiles => {
                allFiles.toString(); // ESLint ignore
                let doneTimestamp = Math.round(new Date().getTime());
                console.log(`\n\n ${col.green}Done (after ${((doneTimestamp - initTimestamp) / 1000).toFixed(1)} seconds).${col.rst}`);
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
    console.log(`\n\n\n ${col.red}${title}:${col.rst}\n ${col.yellow}${detailed}${col.rst}\n`);
    console.log(" (Window will automatically close after 20 seconds)");
    setTimeout(() => exitProgram(1), 20000);
}

const initResources = () => {
    return new Promise((resolve, reject) => {
        try {
            let allFiles = listAllFiles(userSettings.rpPath);
            console.log(` Found ${col.yellow}${allFiles.files.textures.length}${col.rst} texture files and ${col.yellow}${allFiles.files.sounds.length}${col.rst} sound files in ${col.yellow}${allFiles.folders.length}${col.rst} folders`);

            resolve(allFiles);
        }
        catch(err)
        {
            reject(`Couldn't parse resource files due to error: ${err}`);
        }
    });
}

const askErr = err => {
    console.log(`${col.red}[Error]:${col.rst} ${err}\n`);
    process.exit(1);
};

const askSettings = () => {
    return new Promise((resolve, reject) => {
        let askAction = ` ${col.blue}${settings.info.name} by ${settings.info.author}${col.rst}
 Please choose what you want to do (enter the green digit and press the <Return> key):

 ${col.green}1${col.rst} - Create a random resource pack
 ${col.green}2${col.rst} - View the wiki website for help
 ${col.green}3${col.rst} - About ${settings.info.abbr}
 ${col.green}4${col.rst} - Exit ${settings.info.abbr}

 ${col.cyan}${settings.promptArrow} ${col.rst}`;
        rl.resume();
        rl.question(askAction, answer => {
            rl.pause();
            answer = parseInt(answer);

            switch(answer)
            {
                case 1: // create resource pack
                    logSpacer();
                    ask.seed().then(() => {

                    }).catch(err => askErr(err));
                break;
                case 2:
                    opn(settings.info.docsURL);
                    logSpacer();
                    console.log(` ${col.green}>> Opened wiki\n${col.rst}`);
                    askSettings().then(() => resolve()).catch(err => reject(err));
                break;
                case 3:
                    logSpacer();
                    
                    ask.aboutMRR().then(() => {
                        logSpacer();
                        askSettings().then(() => resolve()).catch(err => reject(err));
                    }).catch(err => reject(err));
                break;
                case 4:
                    exitProgram(0);
                break;
                default:
                    logSpacer();
                    console.log(` ${col.red}>> Invalid number!\n${col.rst}`);
                    askSettings().then(() => resolve()).catch(err => reject(err));
                break;
            }
        });

        // resolve();
    });
}

const ask = {
    seed: () => {
        return new Promise((resolve, reject) => {
            let askAction = ` ${col.yellow}Step 1 / 1337${col.rst}
 Do you have a seed to generate the resource pack from?
 If not or you wanna generate a random resource pack, just press the <Return> key.
 To go to the main menu, enter ${col.yellow}cancel${col.rst}.

 ${col.cyan}Seed ${settings.promptArrow} ${col.rst}`;
            rl.resume();
            rl.question(askAction, answer => {
                rl.pause();

                if(answer == "cancel")
                {
                    logSpacer();
                    return askSettings();
                }

                if(seededRNG.validateSeed(answer))
                {
                    // entered seed is valid, continue with next prompt
                    userSettings.seed = answer;
                    resolve();
                }
                else if(!jsl.isEmpty(answer))
                {
                    // seed is invalid, prompt again
                    logSpacer();
                    console.log(` ${col.red}>> Invalid seed!\n${col.rst}`);
                    ask.seed().then(() => resolve()).catch(err => reject(err));
                }
                else
                {
                    userSettings.seed = seededRNG.generateRandomSeed();
                    resolve();
                }
            });
        });
    },
    aboutMRR: () => {
        return new Promise((resolve, reject) => {
            let askAction = ` ${col.blue}About ${settings.info.name}:${col.rst}
 

 ${col.cyan}${settings.promptArrow} ${col.rst}`;
            rl.resume();
            rl.question(askAction, answer => {
                rl.pause();

                resolve.toString(); // ESLint ignore
                reject.toString(); // ESLint ignore
                answer.toString(); // ESLint ignore
            });
        });
    },
};

/**
 * Logs a spacer to the console
 */
const logSpacer = () => {console.clear();process.stdout.write("\n");}
// const logSpacer = () => console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`);

/**
 * Exits the program
 * @param {Number} code Exit code
 */
const exitProgram = code => {
    try {
        code = parseInt(code);
        if(jsl.isEmpty(code) || isNaN(code)) code = 1;
        console.log(`\n\n\n${col.red}Goodbye!${col.rst}\n`);
        process.exit(code);
    }
    catch(err) // if for some odd reason the program can't be shut down, make sure it does:
    {
        process.exit(0);
    }
}




settings.killSignals.forEach(s => process.on(s, () => exitProgram(0))); // redirects all kill signals to the exitProgram() function

logSpacer();
init();