const settings = require("../settings");
const jsl = require("svjsl");
const col = require("./consoleColors");
const fs = require("fs");
const AdmZip = require("adm-zip");
const https = require("https");


const downloadAndUnzip = (version, updateCallback, fileSizeUpd) => {
    return new Promise((resolve, reject) => {
        let versionExists = false;
        Object.keys(settings.defaultPacks).forEach(key => {
            if(key == version)
                versionExists = true;
        });

        if(!versionExists)
            return reject(`Version "${version}" not found`);

        download(version, version, updateCallback, fileSizeUpd).then((pathToZip) => {
            updateCallback(`Unzipping file...`);
            
            let unzipToPath = `${settings.download.downloadFolder}/${version}/unzipped`;
            if(!fs.existsSync(unzipToPath)) fs.mkdirSync(unzipToPath);

            unzip(pathToZip, unzipToPath).then(() => {
                resolve();
            }).catch(err => {
                reject(`Couldn't unzip file due to error: ${err}`);
            });
        }).catch(err => {
            reject(`Couldn't download file due to error: ${err}`);
        });
    });
}

const download = (version, folderName, updateCallback, fileSizeUpd) => {
    return new Promise((resolve, reject) => {
        fs.exists(settings.download.downloadFolder, exists => {
            if(!exists) fs.mkdirSync(settings.download.downloadFolder);
            
            fs.exists(`${settings.download.downloadFolder}/${folderName}`, exists2 => {
                if(!exists2) fs.mkdirSync(`${settings.download.downloadFolder}/${folderName}`);

                let zipFullPath = `${settings.download.downloadFolder}/${folderName}/${version}.zip`;
                fs.exists(zipFullPath, exists3 => {
                    if(exists3)
                    {
                        updateCallback(`Resource pack of game version ${col.yellow}${version}${col.rst} is already downloaded`);
                        resolve(zipFullPath);
                    }
                    else
                    {
                        updateCallback(`Downloading resource pack template...`);

                        let downloadURL = "";
                        let options = {
                            directory: `${settings.download.downloadFolder}/${folderName}/`,
                            filename: `${version}.zip`
                        };

                        Object.keys(settings.defaultPacks).forEach((key, i) => {
                            if(key == version) downloadURL = settings.defaultPacks[key].url;
                        });

                        downloadFile(downloadURL, options, fileSizeUpd).then(() => setTimeout(() => {
                            resolve(zipFullPath);
                        }, 300)).catch(err => reject(err));
                    }
                });
            });
        });
    });
}

const downloadFile = (url, options, fileSizeUpd) => { // thanks to Vince Yuan for making my life easier: https://stackoverflow.com/a/22907134/8602926
    return new Promise((resolve, reject) => {
        let lastM = false;
        let dest = `${options.directory}${options.filename}`;
        let file = fs.createWriteStream(dest);

        let req = https.get(url, res => {
            let totalSize = (res.headers["content-length"] / 1e+6).toFixed(2);
            let sizeUpdateIv = setInterval(() => {
                fileSizeUpd((fs.statSync(dest).size / 1e+6).toFixed(2), totalSize);
            }, 100);
            res.pipe(file);

            file.on("finish", () => {
                clearInterval(sizeUpdateIv);
                if((fs.statSync(dest).size / 1e+6).toFixed(2) == totalSize && !lastM)
                {
                    lastM = true;
                    fileSizeUpd(totalSize, totalSize);
                }

                let cb = () => setTimeout(() => {
                    resolve();
                }, 300);
                file.close(cb);
            });
        });

        req.on("error", err => {
            fs.unlink(dest, () => reject(`Couldn't download file due to error: ${err}`));
        });
    });
}

const unzip = (zipPath, destPath) => {
    return new Promise((resolve, reject) => {
        fs.exists(zipPath, exists => {
            if(!exists)
                return reject(`ZIP file not found in path: "${zipPath}"`);

            let zip = new AdmZip(zipPath);

            zip.extractAllToAsync(destPath, true, err => {
                if(!err || err.toString().endsWith("Error: Nothing to decompress")) resolve();
                else reject(`Error while unzipping file in path "${zipPath}": ${err}`);
            });
        });
    });
}

module.exports = downloadAndUnzip;

// return new Promise((resolve, reject) => {});