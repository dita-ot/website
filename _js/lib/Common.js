define(['EditController', 'jquery'], (EditController, $) =>
  function Common(index) {
    const CLASS_OPEN = 'expanded'
    const CLASS_CLOSED = 'collapsed'

    const editController = EditController()

    const base = new URI('.').absoluteTo(index).href()

    const $nav = $('nav[role=toc]')
    const $main = $('main[role=main]')

    return {
      loadMain,
      initializeMain,
      isLocal
    }

    function loadMain(href, $tocLink) {
      $.ajax({
        url: href,
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
          const abs = new URI(href).absoluteTo(window.location.href).href()
          const $li = $nav.find(`a[href="${abs}"]`).parent('li')
          $li.addClass('active')
          exposeNode($li)
        }
        window.history.pushState({}, '', href)

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

      function mainClickHandler(event) {
        event.preventDefault()
        event.stopPropagation()

        const $target = $(event.target)
        const href = $target.attr('href')
        loadMain(href)
      }
    }

    function isLocal() {
      const $a = $(this)
      const abs = new URI($a.attr('href')).absoluteTo(window.location.href).href()
      return abs.indexOf(base) !== -1
    }
  })
