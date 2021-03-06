const {app, BrowserWindow} = require('electron')
// Module with utilities for working with file and directory paths.
const path = require('path')
// Module with utilities for URL resolution and parsing.
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Deep linked url
let deeplinkingUrl

// Force Single Instance Application
const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.

  // Protocol handler for win32
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = argv.slice(1)
  }
  logEverywhere("app.makeSingleInstance# " + deeplinkingUrl)

  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
  }
})
if (shouldQuit) {
    app.quit()
    return
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Protocol handler for win32
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = process.argv.slice(1)
  }
  logEverywhere("createWindow# " + deeplinkingUrl)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Define custom protocol handler. Deep linking works on packaged versions of the application!
app.setAsDefaultProtocolClient('myapp')

// Protocol handler for osx
app.on('open-url', function (event, url) {
  event.preventDefault()
  deeplinkingUrl = url
  logEverywhere("open-url# " + deeplinkingUrl)
})

// Log both at dev console and at running node console instance
function logEverywhere(s) {
    console.log(s)
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
    }
}

// var AutoLaunch = require('auto-launch');
 
// var minecraftAutoLauncher = new AutoLaunch({
//     name: 'elecAjey',
//     path: '/Applications/elecAjey.app',
//     isHidden: true
// });
 
// minecraftAutoLauncher.enable();
 
// //minecraftAutoLauncher.disable(); 
 
 
// minecraftAutoLauncher.isEnabled()
// .then(function(isEnabled){
//     if(isEnabled){
//         return;
//     }
//     minecraftAutoLauncher.enable();
// })
// .catch(function(err){
//     // handle error 
// });

/*
var Service = require('node-mac').Service,
    svc = new Service({
      name: 'Hello World',
      description: 'The nodejs.org example web server.',
      script: require('path').join(__dirname,'server.js'),
      template: '/workspace/node-linux/lib/templates/systemv/debian',
      env:{
        name: "NODE_ENV",
        value: "production"
      }
    });

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  console.log('\nInstallation Complete\n---------------------');
  svc.start();
});

// Just in case this file is run twice.
svc.on('alreadyinstalled',function(){
  console.log('This service is already installed.');
  console.log('Attempting to start it.');
  svc.start();
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){
  console.log(svc.name+' started!\nVisit http://127.0.0.1:3000 to see it in action.\n');
});

// Install the script as a service.
svc.install();

*/