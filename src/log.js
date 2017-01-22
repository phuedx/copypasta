const fs = require('fs')
const { resolve } = require('path')

function isDebug () {
  try {
    fs.accessSync(resolve(__dirname, '../DEBUG'), fs.constants.F_OK)

    return true
  } catch (e) {
    return false
  }
}

function getLog () {
  const log = require('electron-log')

  if (isDebug()) {
    log.transports.file.level = 'silly'
  }

  return log
}

module.exports = getLog()
