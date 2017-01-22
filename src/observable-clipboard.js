const Observable = require('zen-observable')
const clipboardWatcher = require('electron-clipboard-watcher')

module.exports = new Observable(observer => {
  const watcher = clipboardWatcher({
    watchDelay: 100,
    onTextChange: text => observer.next(text)
  })

  return () => watcher.stop()
})
