const {app, BrowserWindow, ipcMain, nativeTheme, dialog} = require('electron')
const path = require('path')
const fs = require('fs')


async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ filters: [
    // Restricting the user to only Text Files.
    {
        name: 'Text Files',
        extensions: ['txt']
    }, ],})
  if (!canceled) {
      const data = await fs.readFileSync(filePaths[0], 'utf8')
      return {
          fileName: filePaths[0].substring(filePaths[0].lastIndexOf('\\') + 1),
          fileData: data,
          fileP: filePaths[0]
      }
  }
}



function handleSave (event, content, filepath, button) {

  if (filepath && button === 'save') {
    fs.writeFile(filepath, content, (err) => {
      if (err) {
          console.log("An error ocurred updating the file" + err.message);
          return;
      }
  
      console.log("The file has been succesfully saved");
  });
  } else {

    dialog.showSaveDialog({
      //set the default path and name for save as dialog
      defaultPath: path.join(__dirname, 'C:/Users/%userprofile%/Documents/New.txt'),
  
      // Restricting the user to only Text Files.
      filters: [
          {
              name: 'Text Files',
              extensions: ['txt']
          }, ],
      properties: []
  }).then(file => {
      // Stating whether dialog operation was cancelled or not.
      console.log(file.canceled);
      if (!file.canceled) {
          console.log(file.filePath.toString());
            
          // Creating and Writing to the New.txt file
          fs.writeFile(file.filePath.toString(), 
              content, function (err) {
              if (err) throw err;
              console.log('Saved!');
          });
      }
  }).catch(err => {
      console.log(err)
  });
  }

}

function createWindow () {
  const mainWindow = new BrowserWindow({
   
    autoHideMenuBar: true,
    width: 1200,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      
    }
  })
  mainWindow.setTitle('TextModi')
  mainWindow.loadFile('index.html')

//dark mode for ipc main
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

}


app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('save-file', handleSave)

  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})