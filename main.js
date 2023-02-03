const electron = require("electron");
const { BrowserView, BrowserWindow, ipcMain, Notification } = require("electron");
const {autoUpdater, AppUpdater} = require('electron-updater');

const {app} = electron;
let mainWindow;


app.on('ready', () =>{
    // Updater
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available.');
    });
 
    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available.');
    });

    autoUpdater.on('error', (err) => {
      console.log('Error in auto-updater. ' + err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      console.log(log_message);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded');
    });

    // Main Screen 
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false/*,
            devTools: !app.isPackaged*/
        }
    });


    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "app.html"),
            protocol: "file:",
            slashes: true
        })
    );
});
