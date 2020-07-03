export function elem() {
  const name = arguments[0]
  const attrs = arguments.length === 3 ? arguments[1] : {}
  const content = arguments.length === 3 ? arguments[2] : arguments[1]
  const installBlock = document.createElement(name)
  Object.keys(attrs).forEach((key) => {
    installBlock.setAttribute(key, attrs[key])
  })
  append(installBlock, content)
  return installBlock
}

export function append(parent, content) {
  if (content === undefined || content === null) {
    return
  }
  switch (typeof content) {
    case 'string':
      parent.appendChild(document.createTextNode(content))
      break
    case 'object':
      if (Array.isArray(content)) {
        content.forEach((c) => {
          append(parent, c)
        })
        break
      }
    default:
      parent.appendChild(content)
  }
}

export function clear(myNode) {
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild)
  }
}

export function tabs(id, items) {
  return [
    elem(
      'ul',
      { class: 'nav nav-tabs platform-tabs', role: 'tablist' },
      items.map((item, i) =>
        elem(
          'li',
          { class: 'nav-item', role: 'presentation' },
          $(
            elem(
              'a',
              {
                class: `nav-link platform-tab ${item.active ? 'active' : ''}`,
                'data-value': item.id,
                'data-toggle': 'tab',
                href: `#v${id}_${i}`,
                role: 'tab',
              },
              item.title
            )
          )
            .click(function () {
              const $current = $(this)
              const activatedHref = $current.attr('href')
              $(`.platform-tab`)
                .filter(function () {
                  const $current = $(this)
                  return (
                    $current.attr('data-value') === item.id &&
                    $current.attr('href') !== activatedHref
                  )
                })
                .each(function () {
                  $(this).tab('show')
                  window.localStorage.setItem('DITA-OT_PLATFORM', JSON.stringify(item.platforms))
                })
            })
            .get(0)
        )
      )
    ),
    elem(
      'div',
      { class: 'tab-content platform-tab-content' },
      items.map((item, i) =>
        elem(
          'div',
          {
            class: `tab-pane fade ${item.active ? 'show active' : ''}`,
            id: `v${id}_${i}`,
            role: 'tabpanel',
          },
          item.content
        )
      )
    ),
  ]
}
