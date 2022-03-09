const electron = require("electron");

const { app, BrowserWindow } = electron;
// const { app, BrowserWindow } = require('electron')
const globalShortcut = electron.globalShortcut

// include the Node.js 'path' module at the top of your file
const path = require('path')


// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  globalShortcut.register('f5', function() {
		console.log('f5 is pressed')
		win.reload()
	})
	globalShortcut.register('CommandOrControl+R', function() {
		console.log('CommandOrControl+R is pressed')
		win.reload()
	})
}
// ...

  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

const Store = require('electron-store');
Store.initRenderer();