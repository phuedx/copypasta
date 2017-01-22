const { app, globalShortcut, clipboard, shell } = require('electron')

const doodads = require('./src/doodads')

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    let text = clipboard.readText()
    let doodad

    for (let i = 0; i < doodads.length; ++i) {
      if (doodads[i].can(text)) {
        doodad = doodads[i]

        break
      }
    }

    if (doodad) {
      doodad.doodad(text)
        .then(clipboard.writeHTML)
        .then(shell.beep)
    } else {
      console.log(`Can't find a doodad that can doodad "${text}"`)
    }
  })
})
