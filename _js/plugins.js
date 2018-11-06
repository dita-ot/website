const REPOSITORY_URL = 'https://plugins.dita-ot.org/_all.json'
const VERSIONS = [
  '3.2',
  '3.1.3',
  '3.1.2',
  '3.1.1',
  '3.1',
  '3.0.4',
  '3.0.3',
  '3.0.2',
  '3.0.1',
  '3.0',
  '2.5.4',
  '2.5.3',
  '2.5.2',
  '2.5.1',
  '2.5',
  '2.4.6',
  '2.4.5',
  '2.4.4',
  '2.4.3',
  '2.4.2',
  '2.4.1',
  '2.4',
  '2.3.3',
  '2.3.2',
  '2.3.1',
  '2.3',
  '2.2.5',
  '2.2.4',
  '2.2.3',
  '2.2.2',
  '2.2.1',
  '2.2',
  '2.1.2',
  '2.1.1',
  '2.1',
  '2.0.1',
  '2.0',
  '1.8.5',
  '1.8.4',
  '1.8.3',
  '1.8.2',
  '1.8.1',
  '1.8',
  '1.7.5',
  '1.7.4',
  '1.7.3',
  '1.7.2',
  '1.7.1'
]

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
      if (plugin.alias) {
        // skip
      } else {
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
      }
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
  if (!hash) {
    filterList()
  }
}

function notFound(name, version) {
  return elem(
    'p',
    !!version ? `Plugin ${name} version ${version} not found.` : `Plugin ${name} not found.`
  )
}

var query = {}

function queryHandler(event) {
  query.freetext = event.target.value
    .toLocaleLowerCase()
    .replace(/\W/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  filterList()
}

function versionHandler(event) {
  query.version = event.target.value
  filterList()
}

function filterList() {
  if (!!query.freetext || !!query.version) {
    let count = 0
    document.querySelectorAll('#list > li').forEach(li => {
      const plugin = plugins[li.id]
      if (match(plugin[0])) {
        count++
        li.style.display = 'list-item'
      } else {
        li.style.display = 'none'
      }
    })
    const empty = document.querySelector('#empty')
    const hits = document.querySelector('#hits')
    if (count === 0) {
      empty.style.display = 'block'
      hits.style.display = 'none'
      clear(hits)
    } else {
      empty.style.display = 'none'
      hits.style.display = 'block'
      clear(hits)
      hits.appendChild(document.createTextNode(`Found ${count} matches.`))
    }
  } else {
    clearFilter()
  }
}

function match(plugin) {
  let freetext = !query.freetext
  if (!!query.freetext && !!plugin.search.match(query.freetext)) {
    freetext = true
  }
  let version = !query.version
  const platform = plugin.deps.find(dep => dep.name === 'org.dita.base')
  if (!!query.version && !!platform && matchVersion(query.version, platform.req)) {
    version = true
  }
  return freetext && version
}

function clearFilter() {
  document.querySelectorAll('#list > li').forEach(li => {
    li.style.display = 'list-item'
  })
  const hits = document.querySelector('#hits')
  hits.style.display = 'none'
  clear(hits)
}

function clearFilterHandler(event) {
  if (event.keyCode === 27) {
    clearFilter()
    document.querySelector('#query').value = ''
    document.querySelector('#empty, #hits').style.display = 'none'
  }
}

function filterForm() {
  const input = elem(
    'input',
    {
      id: 'query',
      value: query.freetext || '',
      type: 'text',
      class: 'form-control',
      placeholder: 'Filter plugins',
      size: 50
    },
    undefined
  )
  input.oninput = queryHandler
  input.onkeypress = clearFilterHandler

  const options = VERSIONS.map(version => {
    const atts = { value: version }
    if (version === query.version) {
      atts.selected = 'selected'
    }
    return elem('option', atts, version)
  })
  const version = elem(
    'select',
    { id: 'version', class: 'form-control' },
    [elem('option', { value: '' }, 'Any version')].concat(options)
  )
  version.onchange = versionHandler

  return elem('div', { class: 'form-inline' }, [
    elem('div', { class: 'form-group' }, input),
    ' ',
    elem('div', { class: 'form-group' }, version)
  ])
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
      'p',
      { id: 'hits', style: 'display: none; margin-top: 1em', class: 'alert alert-info' },
      'Matches found.'
    ),
    elem(
      'ul',
      { class: 'list-unstyled', id: 'list' },
      Object.values(json)
        .filter(plugin => !!plugin && !plugin.alias)
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
    elem('p', { class: 'small' }, 'DITA-OT 3.2 and newer'),
    elem('pre', `dita --install ${first.name}`),
    elem('p', { class: 'small' }, 'DITA-OT 3.1 and older'),
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

// Compare

function parse(value) {
  const op = value.replace(/\./g, '').replace(/[^=<>.]/g, '')
  const v = value.replace(/[=<>]/g, '')
  const tokens = v.split('.').map(v => Number.parseInt(v))
  if (tokens.length < 3) {
    for (let i = tokens.length; i < 3; i++) {
      tokens.push(0)
    }
  }
  return {
    op: !!op ? op : null,
    tokens: tokens
  }
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

function compareVersion(a, b) {
  try {
    const as = parse(a)
    const bs = parse(b)
    const comparedPairs = zip(as.tokens, bs.tokens).map(pair => compare(pair[0], pair[1]))
    return verify(comparedPairs)
  } catch (e) {
    return 0
  }
}

function verify(pairs, op) {
  const reduced = pairs.reduce((acc, curr) => (acc !== 0 ? acc : curr), 0)
  if (op === '>=') {
    return reduced <= 0
  } else if (op === '>') {
    return reduced < 0
  } else if (op === '<=') {
    return reduced >= 0
  } else if (op === '<') {
    return reduced > 0
  } else {
    return reduced === 0
  }
}

function matchVersion(a, b) {
  try {
    const as = parse(a)
    const bs = parse(b)
    const comparedPairs = zip(as.tokens, bs.tokens).map(pair => compare(pair[0], pair[1]))
    return verify(comparedPairs, bs.op)
  } catch (e) {
    return false
  }
}
