import TocController from './lib/TocController'
import SearchController from './lib/SearchController'
import HelpController from './lib/HelpController'
import $ from 'jquery'
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
  $.ajax({
    url: index,
    success: (data) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(data, 'text/html')
      const nav = doc.getElementsByTagName('nav').item(0)
      const $toc = $(nav.outerHTML)
      TocController($toc, index)
      SearchController($toc, index)
      HelpController()
    },
  })
}
