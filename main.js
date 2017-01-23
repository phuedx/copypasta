const { app, clipboard, shell } = require('electron')

const observableClipboard = require('./src/observable-clipboard')
const log = require('./src/log')
const doodads = require('./src/doodads')

/**
 * Notifies the user that the clipboard's text has been modified.
 */
function notifyUser () {
  shell.beep()

  app.dock.bounce('informational')
}

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
          .then(notifyUser)
      } else {
        log.info(`Couldn't find a doodad for "${text}"`)
      }
    }
  })
})
