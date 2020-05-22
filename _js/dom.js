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

export function tabs(items) {
  return [
    elem(
      'ul',
      { class: 'nav nav-tabs', role: 'tablist' },
      items.map((item, i) =>
        elem(
          'li',
          { class: 'nav-item', role: 'presentation' },
          elem(
            'a',
            {
              class: `nav-link ${i === 0 ? 'active' : ''}`,
              id: 'home-tab',
              'data-toggle': 'tab',
              href: `#v${i}`,
              role: 'tab',
            },
            item.title
          )
        )
      )
    ),
    elem(
      'div',
      { class: 'tab-content' },
      items.map((content, i) =>
        elem(
          'div',
          { class: `tab-pane fade ${i === 0 ? 'show active' : ''}`, id: `v${i}`, role: 'tabpanel' },
          content.content
        )
      )
    ),
  ]
}
