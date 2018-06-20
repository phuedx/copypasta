const { app, clipboard, shell, Menu, Tray, MenuItem } = require('electron')
const { resolve } = require('path')
const observableClipboard = require('./src/observable-clipboard')
const log = require('./src/log')
const doodads = require('./src/doodads')

let tray
const menu = Menu.buildFromTemplate([
  { type: 'separator' },
  { role: 'quit' }
])

/**
 * Notifies the user that the clipboard's text has been modified.
 */
function notifyUser () {
  shell.beep()

  app.dock.bounce('informational')
}

/**
 * Try to find a doodad that can convert a piece of text to HTML in some way
 * and, if so, uses it and alerts the user to it.
 *
 * @param {string} text
 * @return {Promise<void>} If a doodad is found, then a resolved promise is
 *  returned; a rejected promise is returned otherwise.
 */
function tryCopypasta (text) {
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

    return doodad.doodad(text)
      .then(clipboard.writeHTML)
      .then(notifyUser)
  }

  const message = `Couldn't find a doodad for "${text}"`

  log.info(message)

  return Promise.reject(new Error(message))
}

app.on('ready', () => {
  log.info('Ready...')

  tray = new Tray(resolve('./resources/copypasta.png'))
  tray.setToolTip('copypasta')
  tray.setContextMenu(menu)

  observableClipboard.subscribe({
    next (text) {
      tryCopypasta(text)
        .then(() => {
          menu.insert(0, new MenuItem({
            label: text,
            click: () => tryCopypasta(text)
          }))

          // Per Electron's documentation [0]:
          //
          // > On Linux in order for changes made to individual MenuItems to
          // > take effect, you have to call setContextMenu again.
          //
          // This affects macOS High Sierra (10.13.5) too.
          //
          // [0] https://electronjs.org/docs/all#class-tray
          tray.setContextMenu(menu)
        })
    }
  })
})
