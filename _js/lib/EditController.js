define(
  ['jquery'],
  $ =>
    function EditController() {
      const OXYGEN = 'https://www.oxygenxml.com/oxygen-xml-web-author/app/oxygen.html'
      const PROJECT_BASE = 'github://getFileContent/dita-ot/docs/'
      const PROJECT_MAP = 'userguide-book.ditamap'
      const PROJECT_BRANCH = 'develop'

      return {
        createEditLink
      }

      function createEditLink() {
        let $link = $('#editLink')
        if (location.pathname.indexOf('/dev/') != -1 && $('.generated').length === 0) {
          let url
          // TODO Why edit map when document is generated?
          if (document.querySelector('.generated')) {
            url = getEditURL(PROJECT_BRANCH, PROJECT_MAP)
          } else {
            const htmlURL = location.pathname.substring(location.pathname.indexOf('/dev/'))
            let file = htmlURL.endsWith('.html')
              ? `${htmlURL.slice('/dev/'.length, htmlURL.length - '.html'.length)}.dita`
              : `${htmlURL.slice('/dev/'.length, htmlURL.length)}index.dita`
            if (file.indexOf('/first-build-') != -1) {
              file = file.replace('first-build-', '')
            }
            if (file.indexOf('/build-') != -1) {
              file = file.replace('build-', '')
            }
            url = getEditURL(PROJECT_BRANCH, file, PROJECT_MAP)
          }
          if ($link.length === 0) {
            $link = $(
              '<a class="btn btn-success btn-xs pull-right" id="editLink" target="_blank" title="Edit this file"><span class="glyphicon glyphicon-pencil"></span> Edit this page</a>'
            )
            $('footer > .container').append($link)
          }
          $link.attr('href', url)
        } else {
          $link.remove()
        }
      }

      function getEditURL(branch, file, map) {
        let url = `${OXYGEN}?url=${encodeURIComponent(`${PROJECT_BASE + branch}/${file}`)}`
        if (map) {
          url = `${url}&ditamap=${encodeURIComponent(`${PROJECT_BASE + branch}/${map}`)}`
        }
        return url
      }
    }
)
