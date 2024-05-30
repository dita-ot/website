import TocController from './lib/TocController'
import SearchController from './lib/SearchController'
import HelpController from './lib/HelpController'
import $ from 'jquery'
import 'whatwg-fetch'
import URI from 'urijs'
import Prism from 'prismjs'
import { addPlatformTabs } from './lib/Common'

try {
  addPlatformTabs()
} catch (e) {
  console.log(`Failed to add profiling controls: ${e}`)
}
try {
  Prism.highlightAll()
} catch (e) {
  console.log(`Failed to add syntax highlighting: ${e}`)
}

const indexAttr = $('link[rel=index]').attr('href')
if (indexAttr && window.history) {
  const index = URI(indexAttr).absoluteTo(window.location.href).href()
  fetch(index)
    .then((response) => response.text())
    .then((data) => {
      const $toc = $('<body>').append($.parseHTML(data)).find('nav')
      TocController($toc, index)
      SearchController($toc, index)
      HelpController()
    })
}
