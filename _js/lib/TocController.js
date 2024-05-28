import Common from './Common'
import $ from 'jquery'
import URI from 'urijs'

function TocController($toc, index) {
  const CLASS_OPEN = 'expanded'
  const CLASS_CLOSED = 'collapsed'

  const common = Common(index)

  const $nav = $('nav[role=toc], nav.toc')

  common.initializeMain()
  addTocControllers()
  loadFullToc()

  $nav.wrapInner(`<div class="toc-wrapper"></div>`)

  function loadFullToc() {
    initializeToc($toc)
    $('nav[role=toc], nav.toc').html($toc.html())
    addTocControllers()

    function initializeToc($dummy) {
      let $current
      const location = URI(window.location.href).href()
      $dummy.find('a').each(function () {
        const $a = $(this)
        const abs = URI($a.attr('href')).absoluteTo(index).href()
        $a.attr('href', abs)
        if (abs === location) {
          $current = $a
        }
      })
      if (!$current || !$current.length) {
        const target = URI(window.location.href)
        if (target.fragment().length > 0) {
          $current = $dummy.find(`a[href="${target.fragment('')}"]:first`)
        }
      }
      if (!$current || !$current.length) {
        if (window.location.href.endsWith('/')) {
          const target = `${window.location.href}index.html`
          $current = $dummy.find(`a[href="${target}"]:first`)
        } else if (window.location.href.endsWith('/index')) {
          const target = window.location.href.substring(0, window.location.href.length - 10)
          $current = $dummy.find(`a[href="${target}"]:first`)
        }
      }
      if ($current) {
        $current.parent('li').addClass('active')
        $dummy.find('li').each(function () {
          toggleNode($(this))
        })
        $current.parents('li').each(function () {
          toggleNode($(this))
        })
      }
    }
  }

  function toggleNode($node) {
    if ($node.hasClass(CLASS_CLOSED)) {
      $node.addClass(CLASS_OPEN).removeClass(CLASS_CLOSED)
    } else {
      $node.addClass(CLASS_CLOSED).removeClass(CLASS_OPEN)
    }
  }

  function addTocControllers() {
    $nav.find('li').each(function () {
      const $li = $(this)
      if (!$li.hasClass(CLASS_OPEN)) {
        $li.addClass(CLASS_OPEN)
      }
      if ($li.children('ul').length !== 0) {
        $('<span class="controller"></span>').click(toggleHandler).prependTo($li)
        $li.children('a[href]').filter(common.isLocal).click(expandHandler)
      }
      $li.children('a[href]').filter(common.isLocal).click(navigateHandler)
    })

    function expandHandler(event) {
      event.preventDefault()
      event.stopPropagation()

      const $target = $(event.target)
      const $node = $target.parent('li')
      if ($node.hasClass(CLASS_CLOSED)) {
        $node.addClass(CLASS_OPEN).removeClass(CLASS_CLOSED)
      }
    }

    function toggleHandler(event) {
      const $target = $(event.target)
      const $node = $target.parent('li')
      toggleNode($node)
    }

    function navigateHandler(event) {
      event.preventDefault()
      event.stopPropagation()

      const $target = $(event.target)
      const href = $target.get(0).href
      common.loadMain(href, $target)
    }
  }
}

export default TocController
