const { app, clipboard, shell } = require('electron')
const log = require('electron-log')

const observableClipboard = require('./src/observable-clipboard')
const doodads = require('./src/doodads')

app.on('ready', () => {
  log.info('Ready...')

  observableClipboard.subscribe({
    next (text) {
      log.info(`Trying to find a doodad for "${text}"...`)

      let doodad

      for (let i = 0; i < doodads.length; ++i) {
        if (doodads[i].can(text)) {
          doodad = doodads[i]

          break
        }
      }

      if (doodad) {
        log.info('Found a doodad!')
        log.info('Doodading...')

        doodad.doodad(text)
          .then(clipboard.writeHTML)
          .then(shell.beep)
      } else {
        log.info(`Couldn't find a doodad for "${text}"`)
      }
    }
  })
})
