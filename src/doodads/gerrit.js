const BASE_URL = `https://gerrit.wikimedia.org`

const fetch = require('node-fetch')

function can (text) {
  return !!text.match(/^I[0-9a-f]{8,}/) || !!text.match(/\d{6}/)
}

function doodad (text) {
  const url = `${BASE_URL}/r/changes/${text}`

  return fetch(url)
    .then(response => response.text())

    // TODO: WTF Gerrit!?
    .then(response => response.substr(5))
    .then(JSON.parse)

    .then(response => {
      const changeID = response.change_id
      const url = `${BASE_URL}/r/#/q/${changeID}`
      const id = changeID.substr(0, 9)

      return `<a href="${url}">${id}: ${response.subject}</a>`
    })
}

exports.can = can
exports.doodad = doodad
