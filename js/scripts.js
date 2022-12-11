
//dialog for open
const btn = document.getElementById('btn')
const textArea = document.getElementById('editor')
const fileName = document.getElementById('fileName')
let pathToFile = []
btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
    fileName.innerHTML = filePath.fileName
    textArea.value = filePath.fileData
    pathToFile.push(filePath.fileP)
})

//new file
document.getElementById("new").onclick = () => {
  window.location.reload();
};

//SaveAs
const saveAsButton = document.getElementById('saveAs')

saveAsButton.addEventListener('click', () => {
    const content = textArea.value
    const filepath = pathToFile.toString()
    let button = 'saveAs'
    window.electronAPI.saveFile(content, filepath, button)
});

//Save
const saveButton = document.getElementById('save')

saveButton.addEventListener('click', () => {
  const content = textArea.value
  const filepath = pathToFile.toString()
  let button = 'save'
  window.electronAPI.saveFile(content, filepath, button)
});


// dark mode
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
})



