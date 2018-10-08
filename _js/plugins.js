const REPOSITORY_URL = 'https://plugins.dita-ot.org/_all.json'

let plugins = null

document.addEventListener('DOMContentLoaded', event => {
  fetch(REPOSITORY_URL)
    .then(response => response.json())
    .then(init)
    .catch(err => {
      console.error('Failed to fetch plugins: ' + err)
    })
})

function init(json) {
  plugins = json
  Object.values(plugins)
    .filter(plugin => !!plugin)
    .forEach(plugin => {
      plugin.forEach(version => {
        const buf =
          version.name +
          ' ' +
          (version.description && version.description) +
          ' ' +
          (version.keywords && version.keywords.join(' '))
        version.search = buf
          .toLocaleLowerCase()
          .replace(/\W/g, ' ')
          .replace(/\s+/g, ' ')
      })
    })
  window.onpopstate = event => {
    show(location.hash)
  }
  show(location.hash)
}

function show(hash) {
  let content = null
  if (!!hash) {
    const [name, version] = hash.substr(1).split('/')
    const pluginVersions = plugins[name].slice()
    pluginVersions.sort(compareVersion)
    content = details(pluginVersions, version) || notFound(name, version)
  } else {
    content = list(plugins)
  }
  const wrapper = document.getElementById('plugins')
  clear(wrapper)
  append(wrapper, content)
}

function notFound(name, version) {
  return elem(
    'p',
    !!version ? `Plugin ${name} version ${version} not found.` : `Plugin ${name} not found.`
  )
}

function filterListHandler(event) {
  const query = event.target.value
    .toLocaleLowerCase()
    .replace(/\W/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!!query) {
    let found = false
    document.querySelectorAll('#list > li').forEach(li => {
      const plugin = plugins[li.id]
      if (!!plugin[0].search.match(query)) {
        found = true
        li.style.display = 'list-item'
      } else {
        li.style.display = 'none'
      }
    })
    document.querySelector('#empty').style.display = !found ? 'block' : 'none'
  } else {
    clearFilter()
  }
}

function clearFilter() {
  document.querySelectorAll('#list > li').forEach(li => {
    li.style.display = 'list-item'
  })
}

function clearFilterHandler(event) {
  if (event.keyCode === 27) {
    clearFilter()
    document.querySelector('#query').value = ''
    document.querySelector('#empty').style.display = 'none'
  }
}

function filterForm() {
  const input = elem(
    'input',
    {
      id: 'query',
      type: 'text',
      class: 'form-control',
      placeholder: 'Filter plugins',
      size: 100
    },
    undefined
  )
  input.oninput = filterListHandler
  input.onkeypress = clearFilterHandler
  return input
}

function list(json) {
  return [
    filterForm(),
    elem(
      'p',
      { id: 'empty', style: 'display: none; margin-top: 1em', class: 'alert alert-info' },
      'No matches found.'
    ),
    elem(
      'ul',
      { class: 'list-unstyled', id: 'list' },
      Object.values(json)
        .filter(plugin => !!plugin)
        .sort((a, b) => a[0].name.localeCompare(b[0].name))
        .map(plugin => plugin[0])
        .map(first =>
          elem('li', { id: first.name }, [
            elem('h3', elem('a', { href: `#${first.name}` }, first.name)),
            elem('p', first.description),
            elem(
              'p',
              (first.keywords || []).flatMap(keyword => [
                elem('code', { class: 'small' }, keyword),
                ' \u00A0'
              ])
            )
          ])
        )
    )
  ]
}

function details(versions, version) {
  const first = !!version ? versions.find(plugin => plugin.vers === version) : versions[0]
  if (!first) {
    return null
  }

  const div = document.createElement('div')

  div.appendChild(elem('h2', [`${first.name}`, elem('small', ` ${first.vers}`)]))

  if (!!first.description) {
    append(div, elem('p', { class: 'shortdesc' }, first.description))
  }
  if (!!first.keywords && first.keywords.length !== 0) {
    append(div, [
      elem('h3', 'Keywords'),
      elem('p', first.keywords.flatMap(keyword => [elem('code', keyword), ' \u00A0']))
    ])
  }
  if (!!first.license) {
    append(div, [elem('h3', 'License'), elem('p', license(first.license))])
  }
  if (!!first.homepage) {
    append(div, [
      elem('h3', 'Homepage'),
      elem('p', elem('a', { href: first.homepage }, getDomain(first.homepage)))
    ])
  }
  append(div, [
    elem('h3', 'Install'),
    elem('p', { class: 'small' }, 'DITA-OT 3.1 and newer'),
    elem('pre', `dita --install ${first.name}`),
    elem('p', { class: 'small' }, 'DITA-OT 3.0 and older'),
    elem('pre', `dita --install ${first.url}`)
  ])

  const deps = first.deps
  deps.sort((a, b) => a.name.localeCompare(b.name))
  append(div, [
    elem('h3', 'Dependencies'),
    elem(
      'ul',
      deps
        .filter(dep => dep.name === 'org.dita.base')
        .map(dep => elem('li', `DITA-OT ${humanReadableVersion(dep.req) || ''}`))
    ),
    elem(
      'ul',
      deps
        .filter(dep => dep.name !== 'org.dita.base')
        .map(dep => elem('li', `${dep.name} ${humanReadableVersion(dep.req) || ''}`))
    )
  ])

  append(div, [
    elem('h3', 'Versions'),
    elem(
      'ul',
      versions.map(version =>
        elem('li', elem('a', { href: `#${first.name}/${version.vers}` }, version.vers))
      )
    )
  ])

  return div
}

function license(spdx) {
  switch (spdx) {
    case 'Apache-2.0':
      return elem(
        'a',
        { href: 'https://www.apache.org/licenses/LICENSE-2.0' },
        'Apache License 2.0'
      )
    case 'MIT':
      return elem('a', { href: 'https://opensource.org/licenses/MIT' }, 'MIT License')
    case 'UNLICENSED':
      return 'Unlicensed'
    default:
      return spdx
  }
}

function humanReadableVersion(version) {
  if (version.startsWith('=')) {
    return `${version.substr(1)}`
  } else if (version.startsWith('>=')) {
    return `${version.substr(2)} or newer`
  } else if (version.startsWith('<=')) {
    return `${version.substr(2)} or older`
  }
  return version
}

function elem() {
  const name = arguments[0]
  const attrs = arguments.length === 3 ? arguments[1] : {}
  const content = arguments.length === 3 ? arguments[2] : arguments[1]
  const installBlock = document.createElement(name)
  Object.keys(attrs).forEach(key => {
    installBlock.setAttribute(key, attrs[key])
  })
  append(installBlock, content)
  return installBlock
}

function append(parent, content) {
  if (content === undefined || content === null) {
    return
  }
  switch (typeof content) {
    case 'string':
      parent.appendChild(document.createTextNode(content))
      break
    case 'object':
      if (Array.isArray(content)) {
        content.forEach(c => {
          append(parent, c)
        })
        break
      }
    default:
      parent.appendChild(content)
  }
}

function getDomain(homepage) {
  return homepage.replace(/^\w+:\/\/([^\/]+?)(\/.*)?$/, '$1')
}

function clear(myNode) {
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild)
  }
}

function compareVersion(a, b) {
  function parse(v) {
    return v.split('.').map(v => Number.parseInt(v))
  }
  function compare(a = 0, b = 0) {
    if (a === b) {
      return 0
    } else if (a < b) {
      return 1
    } else {
      return -1
    }
  }
  function zip(as, bs) {
    return as.map(function(e, i) {
      return [e, bs[i]]
    })
  }

  try {
    const as = parse(a)
    const bs = parse(b)
    return zip(as, bs)
      .map(pair => compare(pair[0], pair[1]))
      .reduce((acc, curr) => (acc !== 0 ? acc : curr), 0)
  } catch (e) {
    return 0
  }
}
