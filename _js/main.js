import TocController from './lib/TocController'
import SearchController from './lib/SearchController'
import HelpController from './lib/HelpController'
import $ from 'jquery'
import URI from 'urijs'
import Prism from 'prismjs'

Prism.highlightAll()

const indexAttr = $('link[rel=index]').attr('href')
if (indexAttr && window.history) {
  const index = URI(indexAttr)
    .absoluteTo(window.location.href)
    .href()
  $.ajax({
    url: index,
    success: data => {
      const $toc = $('<body>')
        .append($.parseHTML(data))
        .find('nav')
      TocController($toc, index)
      SearchController($toc, index)
      HelpController()
    }
  })
}
