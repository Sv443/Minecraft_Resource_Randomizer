const settings = require("../settings");
const jsl = require("svjsl");
const fs = require("fs");
const col = require("./consoleColors");


/**
 * @typedef {Array<Object>} MRR_FileInfo
 * @param {Array<String>} textures
 * @param {Array<String>} sounds
 */

/**
 * @typedef {Object} MRR_FileList
 * @prop {String} rpBasePath
 * @prop {MRR_FileInfo} files
 * @prop {Array<String>} folders
 */

/**
 * Lists all files inside a specified folder and all its sub-folders
 * @param {String} dir The directory that should be searched through
 * @returns {MRR_FileList}
 */
const listAllFiles = (dir = "../") => {
    let doneObj = {
        rpBasePath: "",
        files: {
            textures: [],
            sounds: []
        },
        folders: []
    };

    let m = 0;

    let walk = (path) => {
        if(settings.listAllFiles.verboseLogging) console.log(`\nWalking "${path}"`);

        let all = fs.readdirSync(path, {
            encoding: "utf8"
        });

        m = 0;

        all.forEach(item => {
            let itemPath = "";
            let containsDriveLetter = path.match(/^[A-Za-z]\:/);
            itemPath = !containsDriveLetter ? `./${path}/${item}` : `${path}/${item}`;
            let itemStats = fs.statSync(itemPath);

            if(itemStats.isDirectory())
            {
                let iPathSpl = itemPath.split("/");
                let dirName = iPathSpl[iPathSpl.length - 1];

                if(dirName == "assets")
                {
                    iPathSpl = iPathSpl.join("/");
                    doneObj["rpBasePath"] = iPathSpl;
                }

                doneObj.folders.push(itemPath);

                if(!containsDriveLetter) walk(itemPath.substr(2));
                else walk(itemPath);
            }
            else if(itemStats.isFile())
            {
                let fileName = item.split(".").pop();
                let ispl = itemPath.split(".");
                let correctFileType = false;
                let itemType = "";

                if(ispl[ispl.length - 1] == "png" && fileName != "pack.png")
                {
                    correctFileType = true;
                    itemType = "image";
                }
                else if(ispl[ispl.length - 1] == "ogg")
                {
                    correctFileType = true;
                    itemType = "sound";
                }

                if(correctFileType)
                {
                    if(settings.listAllFiles.verboseLogging) process.stdout.write(`${col.yellow}*${col.rst}${m % 5 == 0 ? " " : ""}`);
                    m++;

                    if(typeof fileName == "object" && !jsl.isEmpty(filename.length)) fileName = fileName.join(".");
                    if(itemType == "image") doneObj.files.textures.push({
                        "fileName": fileName,
                        "path": itemPath
                    });
                    else if(itemType == "sound") doneObj.files.sounds.push({
                        "fileName": fileName,
                        "path": itemPath
                    });
                }
            }
        });
        if(settings.listAllFiles.verboseLogging && m > 0) process.stdout.write(`${col.red} | ${col.yellow} ${m} total${col.rst}\n`);
        else if(settings.listAllFiles.verboseLogging && m == 0) process.stdout.write(`${col.red} | ${col.yellow} (empty)${col.rst}\n`);
    }

    walk(dir);

    let deleteIdxs = [];
    doneObj.folders.forEach(folder => {
        let idxOf = doneObj.folders.indexOf(folder);
        if(doneObj.folders.includes(folder)) deleteIdxs.push(idxOf);
    });

    if(deleteIdxs.length > 0) deleteIdxs.forEach(idx => {
        doneObj.folders.splice(idx, 1);
    });

    if(jsl.isEmpty(doneObj.rpBasePath)) throw new Error("Not a valid Minecraft resource pack");

    doneObj.files.textures.forEach((file, i) => {
        doneObj.files.textures[i].path = file.path.substring(doneObj.rpBasePath.length + 1);
    });

    doneObj.files.sounds.forEach((file, i) => {
        doneObj.files.sounds[i].path = file.path.substring(doneObj.rpBasePath.length + 1);
    });

    doneObj.folders.forEach((folder, i) => {
        doneObj.folders[i] = folder.substring(doneObj.rpBasePath.length + 1);
    });

    if(settings.listAllFiles.verboseLogging) console.log(`\n\n${col.green}[---- DONE WALKING ----]${col.rst}\n`);
    return doneObj;
}

module.exports = listAllFiles;


/*

Example object returned by listAllFiles():

{
    "rpBasePath": "C:/Users/Example/Desktop/TestRP",
    "files": [
        {
            "fileName": "diamond_sword",
            "path": "minecraft/textures/items/diamond_sword.png"
        },
        {
            "fileName": "dirt_block",
            "path": "minecraft/textures/blocks/dirt.png"
        }
    ],
    "folders": [
        "minecraft",
        "minecraft/textures",
        "minecraft/textures/items",
        "minecraft/textures/blocks"
    ]
}

*/