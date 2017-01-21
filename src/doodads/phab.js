const jsdom = require('jsdom')

function can (text) {
  return !!text.match(/T\d+$/)
}

function doodad (text) {
  let url = text

  // e.g. T1
  if (text[0] === 'T') {
    url = `https://phabricator.wikimedia.org/${text}`
  }

  return new Promise((resolve, reject) => {
    jsdom.env({
      url: url,
      done: (_, window) => {
        const d = window.document
        const id = text.match(/T\d+$/)[0]
        const title = d.querySelector('.phui-header-header').textContent

        resolve(`<a href="${url}">${id}: ${title}</a>`)
      }
    })
  })
}

exports.can = can
exports.doodad = doodad
