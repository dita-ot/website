import EditController from './EditController'
import $ from 'jquery'
import URI from 'urijs'

function Common(index) {
  const CLASS_OPEN = 'expanded'
  const CLASS_CLOSED = 'collapsed'

  const editController = EditController()

  const base = URI('.')
    .absoluteTo(index)
    .href()

  const $nav = $('nav[role=toc]')
  const $main = $('main[role=main]')
  const $footer = $('footer')

  window.onpopstate = function(event) {
    loadMain(document.location, undefined, false)
  }

  return {
    loadMain,
    initializeMain,
    isLocal
  }

  function loadMain(href, $tocLink, pushState = true) {
    const abs = URI(href)
      .absoluteTo(window.location.href)
      .href()
    if (pushState) {
      history.pushState({}, '', href)
    }
    $.ajax({
      url: abs,
      success(data) {
        updateToc(href, $tocLink)
        updateMain(data)
      }
    })

    function updateToc(href, $tocLink) {
      $nav.find('.active').removeClass('active')
      if ($tocLink !== undefined) {
        const $li = $tocLink.parent('li')
        $li.addClass('active')
        exposeNode($li)
      } else {
        const abs = URI(href)
          .absoluteTo(window.location.href)
          .href()
        const $li = $nav.find(`a[href="${abs}"]`).parent('li')
        $li.addClass('active')
        exposeNode($li)
      }

      function exposeNode($li) {
        let $current = $li.parents('li:first')
        while ($current.length) {
          if ($current.hasClass(CLASS_CLOSED)) {
            $current.addClass(CLASS_OPEN).removeClass(CLASS_CLOSED)
          }
          $current = $current.parents('li:first')
        }
      }
    }

    function updateMain(data) {
      const $dummy = $('<body>').append($.parseHTML(data))
      $main.html($dummy.find('[role=main]:first').html())
      $footer.html($dummy.find('footer:first').html())
      document.title = $dummy.find('title').text()
      initializeMain()
    }
  }

  function initializeMain() {
    $main
      .find('a[href]')
      .filter(isLocal)
      .click(mainClickHandler)
    editController.createEditLink()
    editController.createHistoryLink()

    function mainClickHandler(event) {
      event.preventDefault()
      event.stopPropagation()

      const $target = $(event.currentTarget)
      const href = $target.attr('href')
      loadMain(href)
    }
  }

  function isLocal() {
    const $a = $(this)
    const abs = URI($a.attr('href'))
      .absoluteTo(window.location.href)
      .href()
    return abs.indexOf(base) !== -1
  }
}

export default Common
