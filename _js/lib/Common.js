import EditController from './EditController'
import $ from 'jquery'
import URI from 'urijs'
import Prism from 'prismjs'
import { tabs } from '../dom'
import t from '../translations'

const platformMap = {
  unix: ['linux', 'mac'],
}

function Common(index) {
  const CLASS_OPEN = 'expanded'
  const CLASS_CLOSED = 'collapsed'

  const editController = EditController()

  const base = URI('.').absoluteTo(index).href()

  const $nav = $('nav[role=toc]')
  const $main = $('main[role=main]')
  const $footer = $('footer')

  window.onpopstate = function (event) {
    loadMain(document.location, undefined, false)
  }

  return {
    loadMain,
    initializeMain,
    isLocal,
  }

  function loadMain(href, $tocLink, pushState = true) {
    const abs = URI(href).absoluteTo(window.location.href).href()
    if (pushState) {
      history.pushState({}, '', href)
    }
    $.ajax({
      url: abs,
      success(data) {
        updateToc(href, $tocLink)
        updateMain(data)
      },
    })

    function updateToc(href, $tocLink) {
      $nav.find('.active').removeClass('active')
      if ($tocLink !== undefined) {
        const $li = $tocLink.parent('li')
        $li.addClass('active')
        exposeNode($li)
      } else {
        const abs = URI(href).absoluteTo(window.location.href).href()
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
      scrollToStart()
      initializeMain()
    }
  }

  function scrollToStart() {
    let target
    if (location.hash === '') {
      target = $main.get(0)
    } else {
      target = document.getElementById(location.hash.substring(1))
    }
    if (target) {
      target.scrollIntoView()
    }
  }

  function initializeMain() {
    addLinkHandlers()
    addAnchorLinks()
    editController.createEditLink()
    editController.createHistoryLink()
    try {
      addPlatformTabs($main)
    } catch (e) {
      console.log(`Failed to add profiling controls: ${e}`)
    }
    try {
      Prism.highlightAll()
    } catch (e) {
      console.log(`Failed to add syntax highlighting: ${e}`)
    }

    function addLinkHandlers() {
      $main.find('a[href]').filter(isLocal).click(mainClickHandler)

      function mainClickHandler(event) {
        event.preventDefault()
        event.stopPropagation()

        const $target = $(event.currentTarget)
        const href = $target.attr('href')
        loadMain(href)
      }
    }

    function addAnchorLinks() {
      $main
        .find(
          'article[id] > h2:first-child, section[id] > h2:first-child, section[id] > h3:first-child , dt[id]'
        )
        .each(function () {
          const $current = $(this)
          const id = getId($current)
          if (id) {
            const link = $('<a class="anchor-link"></a>').attr('href', '#' + id)
            $current.append(link)
            $current.addClass('anchor-link-container')
          }
        })

      function getId($current) {
        return $current.parents('*[id]').addBack().filter(hasNonAriaId).last().attr('id')

        function hasNonAriaId() {
          const id = this.getAttribute('id')
          if (id) {
            const labelledBy = $main.get(0).querySelector(`*[aria-labelledby="${id}"]`)
            if (!labelledBy) {
              return true
            }
          }
          return false
        }
      }
    }
  }

  function isLocal() {
    const $a = $(this)
    const abs = URI($a.attr('href')).absoluteTo(window.location.href).href()
    return abs.indexOf(base) !== -1
  }
}

export function addPlatformTabs($main = $('main[role=main]')) {
  const activePlatform = getActivePlatform()
  function activeFirst(items) {
    const firstActive = items.find((item) => intersect(activePlatform, [item.id]).length !== 0)
    if (firstActive) {
      firstActive.active = true
    } else {
      items[0].active = true
    }
    return items
  }
  $main
    .find('pre.multi-platform')
    .filter(function () {
      let $current = $(this)
      return (
        $current.parents('.platform-tab-content').length === 0 &&
        $current.find('.filepath:not(.preserve-separator), .language-bash, .syntax-bash').length !==
          0
      )
    })
    .each(function () {
      const $current = $(this)
      const items = activeFirst([
        {
          title: 'Linux or macOS',
          id: 'linux_macos',
          platforms: ['linux', 'mac'],
          content: $current.clone().wrapAll(`<div class="tab-pane-wrapper"></div>`).parent().get(),
          active: false,
        },
        {
          title: 'Windows',
          id: 'windows',
          platforms: ['windows'],
          content: toWindows($current.clone())
            .wrapAll(`<div class="tab-pane-wrapper"></div>`)
            .parent()
            .get(),
          active: false,
        },
      ])
      $current.after(tabs(Math.floor(Math.random() * 26), items))
      $current.remove()
    })
  $main
    .find('.choicetable.multi-platform')
    .filter(function () {
      let $current = $(this)
      return $current.parents('.platform-tab-content').length === 0
    })
    .each(function () {
      const $current = $(this)
      // console.log('$current', $current)
      const $rows = $current.find('.chrow')
      // console.log('$rows', $rows)
      if ($rows.length === $rows.filter('[data-platform]').length) {
        // console.log('every row has platform', $rows)
        const items = activeFirst(
          $rows
            .map(function () {
              const $row = $(this)
              const platforms = getPlatforms($row)
              const $content = $row.find('.chdesc').contents().clone()
              return {
                title: $row.find('.choption').text(),
                id: platforms.join('_'),
                platforms,
                content: $content.wrapAll(`<div class="tab-pane-wrapper"></div>`).parent().get(),
                active: false,
              }
            })
            .get()
        )
        // console.log(items)
        $current.after(tabs(Math.floor(Math.random() * 26), items))
        $current.remove()
      } else {
        console.log('not every row has platform', $rows, $rows.filter('[data-platform]'))
      }
    })
  $main
    .find('.steps.multi-platform')
    .filter(function () {
      let $current = $(this)
      return $current.parents('.platform-tab-content').length === 0
    })
    .each(function () {
      const $current = $(this)
      const platforms = [
        ...new Set(
          $current
            .find('[data-platform]')
            .map(function () {
              return getPlatforms($(this))
            })
            .get()
            .flat()
        ),
      ].sort()
      if (platforms.length !== 0) {
        const items = activeFirst(
          platforms.map((platform) => {
            const $content = simplify(
              filterByPlatform(
                platform === 'windows' ? toWindows($current.clone()) : $current.clone(),
                platform
              )
            )
            return {
              title: t(platform),
              id: platform,
              platforms: [platform],
              content: $content.wrapAll(`<div class="tab-pane-wrapper"></div>`).parent().get(),
              active: false,
            }
          })
        )
        $current.after(tabs(Math.floor(Math.random() * 26), items))
        $current.remove()
      } else {
        console.log('steps has no platform profiles')
      }
    })

  function filterByPlatform($content, platform) {
    function noMatch() {
      return !getPlatforms($(this)).includes(platform)
    }

    $content.find('[data-platform]').filter(noMatch).remove()
    return $content
  }

  function simplify($content) {
    $content
      .find('.choices')
      .filter(function () {
        const $current = $(this)
        return $current.find('.choice').length === 1
      })
      .wrapAll('<div class="p"></div>')
      .find('.choice')
      .children()
      .first()
      .unwrap('.choice')
      .unwrap('.choices')
    return $content
  }

  function toWindows($contents) {
    $contents
      .find('.language-bash')
      .addBack('.language-bash')
      .removeClass('language-bash')
      .addClass('language-batch')
    $contents
      .find('.syntax-bash')
      .addBack('.syntax-bash')
      .removeClass('syntax-bash')
      .addClass('syntax-batch')
    $contents
      .find('.filepath:not(.preserve-separator), .filepath:not(.preserve-separator) *')
      .contents()
      .filter(function () {
        return this.nodeType === Node.TEXT_NODE
      })
      .each(function () {
        this.data = this.data.replace(/\//g, '\\')
      })
    $contents
      .find('.language-batch, .language-batch *, .syntax-batch, .syntax-batch *')
      .addBack()
      .children()
      .contents()
      .filter(function () {
        return this.nodeType === Node.TEXT_NODE
      })
      .each(function () {
        this.data = this.data.replace(/\\\n/g, '^\n').replace(/(^|\n)\$/g, '$1>')
      })
    return $contents
  }
}

export function getPlatforms($elem) {
  return expandPlatforms($elem.attr('data-platform').trim().split(/\s+/))
}

export function expandPlatforms(platforms) {
  return platforms.map((p) => platformMap[p] || [p]).flat()
}

function getActivePlatform() {
  let stored = window.localStorage.getItem('DITA-OT_PLATFORM')
  if (!!stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.log(`Failed to read platform profile from local storage: ${e}`)
    }
  }
  let active
  if (navigator.appVersion.indexOf('Win') !== -1) {
    active = ['windows']
  } else if (navigator.appVersion.indexOf('Mac') !== -1) {
    active = ['mac']
  } else if (navigator.appVersion.indexOf('Linux') !== -1) {
    active = ['linux']
  } else {
    active = ['windows']
  }
  window.localStorage.setItem('DITA-OT_PLATFORM', JSON.stringify(active))
  return active
}

export function intersect(array1, array2) {
  return array1.filter((value) => array2.includes(value))
}

export default Common
