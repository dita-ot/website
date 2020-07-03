import EditController from './EditController'
import $ from 'jquery'
import URI from 'urijs'
import Prism from 'prismjs'
import { tabs } from '../dom'

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
      initializeMain()
    }
  }

  function initializeMain() {
    addLinkHandlers()
    addAnchorLinks()
    editController.createEditLink()
    editController.createHistoryLink()
    addPlatformTabs()
    Prism.highlightAll()

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

    function addPlatformTabs() {
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
        .find('pre .filepath')
        .parents('pre')
        .each(function () {
          const $current = $(this)
          const items = activeFirst([
            {
              title: 'Linux and macOS',
              id: 'unix',
              platforms: ['linux', 'mac'],
              content: $current.clone().get(0),
              active: false,
            },
            {
              title: 'Windows',
              id: 'windows',
              platforms: ['windows'],
              content: toWindows($current.clone()).get(0),
              active: false,
            },
          ])
          $current.after(tabs(Math.floor(Math.random() * 26), items))
          $current.remove()
        })
      $main.find('.choicetable').each(function () {
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
                const platforms = $row.attr('data-platform').trim().split(/\s+/)
                return {
                  title: $row.find('.choption').text(),
                  id: platforms.join('_'),
                  platforms,
                  content: $(
                    `<pre class="pre codeblock"><code>${$row.find('.chdesc').html()}</code></pre>`
                  ).get(),
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

      function toWindows($contents) {
        $contents
          .find('.filepath')
          .contents()
          .filter(function () {
            return this.nodeType === Node.TEXT_NODE
          })
          .each(function () {
            this.data = this.data.replace(/\//g, '\\')
          })
        return $contents
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

  function getActivePlatform() {
    let active = window.localStorage.getItem('DITA-OT_PLATFORM')
    if (!!active) {
      return JSON.parse(active)
    } else {
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
    }
  }
}

function intersect(array1, array2) {
  return array1.filter((value) => array2.includes(value))
}

export default Common
