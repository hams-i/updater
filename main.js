const electron = require("electron");
const { BrowserView, BrowserWindow, ipcMain, Notification } = require("electron");
const {autoUpdater} = require('electron-updater');
const url = require("url");
const path = require("path");

const {app} = electron;
let mainWindow;

autoUpdater.autoDownload = true;

app.on('ready', () =>{
    // Main Screen 
    mainWindow = new BrowserWindow({
        width: 500,
        height: 500,
        icon: __dirname + 'build/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "app.html"),
            protocol: "file:",
            slashes: true
        })
    );

    // Updater
    autoUpdater.checkForUpdates();

    autoUpdater.on('checking-for-update', () => {
      mainWindow.webContents.send("notification","Checking for update...");
    });

    autoUpdater.on('update-available', (info) => {
      mainWindow.webContents.send("notification","Update available.");
    });
 
    autoUpdater.on('update-not-available', (info) => {
      mainWindow.webContents.send("notification","Update not available.");
    });

    autoUpdater.on('error', (err) => {
      mainWindow.webContents.send("notification",'Error in auto-updater. ' + err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      console.log(log_message);
      mainWindow.webContents.send("notification",log_message);
    });

    autoUpdater.on('update-downloaded', (info) => {
      mainWindow.webContents.send("notification",'Update downloaded');
    });
});
