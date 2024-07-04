// ? ----- [ Packages ] -----
const moment = require("moment");
const fs = require('fs');
require('dotenv').config();

// ? ----- [ Variables ] -----
const today = moment().format("DD-MM-YYYY");
const todayFormatted = moment().format("DD-MM-YYYY HH:mm:ss");
const fileName = `APP/logs/log_${today}.txt`;
const devLog = `APP/logs/dev_log.txt`;
const devLogArchive = `APP/logs/dev_log_archive.txt`;

async function log(message) {
    switch (process.env.NODE_ENV) {
        case "development":
            fs.appendFile(devLog, `\n[${todayFormatted}] >>> ${message}`, (err) => {
                if (err) throw err;
            });

            fs.appendFile(devLogArchive, `\n[${todayFormatted}] >>> ${message}`, (err) => {
                if (err) throw err;
            });
            return;
        case "production":
            fs.appendFile(fileName, `\n[${todayFormatted}] >>> ${message}`, (err) => {
                if (err) throw err;
            });
            return;
    }
}

async function cLog(message) {
    console.log(`[${todayFormatted}] [ API ] >>> ` + message);
}

async function startUp() {
    switch (process.env.NODE_ENV) {
        case "development":
            fs.writeFile(devLog, `----------------------- [ Start of Logs (${todayFormatted}) ] -----------------------`, (err) => {
                if (err) throw err;
            });

            if (fs.existsSync(devLogArchive)) {
                fs.appendFile(devLogArchive, `\n\n>>> Restarting\n----------------------- [ Start of Logs (${todayFormatted}) ] -----------------------`, (err) => {
                    if (err) throw err;
                });
            } else {
                fs.writeFile(devLogArchive, `----------------------- [ Start of Logs (${todayFormatted}) ] -----------------------`, (err) => {
                    if (err) throw err;
                });
            }
            return;
        case "production":
            if (fs.existsSync(fileName)) {
                fs.appendFile(fileName, `\n[${todayFormatted}] >>> ${message}`, (err) => {
                    if (err) throw err;
                });
            } else {
                fs.writeFile(fileName, `----------------------- [ Start of Logs (${todayFormatted}) ] -----------------------`, (err) => {
                    if (err) throw err;
                });
            }
            return;
    }
}

module.exports = {
    log, 
    cLog,
    startUp
}