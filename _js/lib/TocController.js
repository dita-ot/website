'use strict'

define([
  'Common',
  //'rx',
  'lodash',
  'jquery'
  //'uri'
], function (
  Common,
  //Rx,
  _,
  $
) {
  return function TocController($toc, index) {
    const CLASS_OPEN = 'expanded'
    const CLASS_CLOSED = 'collapsed'

    const common = Common(index)

    var $nav = $('nav[role=toc]')

    common.initializeMain()
    addTocControllers()
    loadFullToc()

    function loadFullToc() {
      initializeToc($toc)
      $('nav[role=toc]').html($toc.html())
      addTocControllers()

      function initializeToc($dummy) {
        var $current
        $dummy.find('a').each(function () {
          const $a = $(this)
          const abs = new URI($a.attr('href')).absoluteTo(index).href()
          $a.attr('href', abs)
          if (abs === window.location.href) {
            $current = $a
          }
        })
        if (!$current || !$current.length) {
          const target = new URI(window.location.href)
          if (target.fragment().length > 0) {
            $current = $dummy.find('a[href="' + target.fragment('') + '"]:first')
          }
        }
        if (!$current || !$current.length) {
          if (_.endsWith(window.location.href, '/')) {
            const target = window.location.href + 'index.html'
            $current = $dummy.find('a[href="' + target + '"]:first')
          } else if (_.endsWith(window.location.href, '/index')) {
            const target = window.location.href.substring(0, window.location.href.length - 10)
            $current = $dummy.find('a[href="' + target + '"]:first')
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
        if ($li.children('ul').length) {
          $('<span class="controller"></span>')
            .click(toggleHandler)
            .prependTo($li)
        }
        $li.children('a[href]')
          .filter(common.isLocal)
          .click(navigateHandler)
      })

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
})
