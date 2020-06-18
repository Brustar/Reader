import { app , BrowserWindow , ipcMain , Menu , shell } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'

import MainMenu from "./MainMenu"
const electron = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let addwindow
let mainMenu

const isDevMode = process.execPath.match(/[\\/]electron/)

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: electron.screen.getPrimaryDisplay().workAreaSize.width,
    height: electron.screen.getPrimaryDisplay().workAreaSize.height,
  })
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`)
  // Open the DevTools.
  if (isDevMode) {
	  //if(process.platform!="win32")
		  //await installExtension(VUEJS_DEVTOOLS)
    mainWindow.webContents.openDevTools()
  }
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  mainWindow.on('enter-full-screen', () => {mainWindow.webContents.send("efc")})
  mainWindow.on('leave-full-screen', () => {mainWindow.webContents.send("lfc")})
  mainMenu = new MainMenu(mainWindow)
  if (isDevMode) {
    enableLiveReload()
    mainMenu.template.push(mainMenu.devMenu)
  }
  const menu = Menu.buildFromTemplate(mainMenu.template)
  Menu.setApplicationMenu(menu)
}

ipcMain.on('bookClick',(event)=>{
  mainWindow.webContents.send("bookClick")
})

ipcMain.on('openbook',(event)=>{
	console.log("open book start."+mainMenu)
  mainMenu.openbook()
  console.log("open book end.")
})

ipcMain.on('appendmenu',(event)=>{
  mainMenu.appendMenu()
})

ipcMain.on('rightClick', (event,data) => {
  mainMenu.createPopupMenu(event,data)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
