import { compareVersion, matchVersion } from './version'
import values from 'object.values'
if (!Object.values) {
  values.shim()
}
import 'es6-promise/auto'
import 'whatwg-fetch'
import { elem, append, clear } from './dom'
import t from './translations'

const REPOSITORY_URL = 'https://plugins.dita-ot.org/_all.json'
const VERSIONS = [
  '3.3',
  '3.2',
  // '3.1.3',
  // '3.1.2',
  // '3.1.1',
  '3.1',
  // '3.0.4',
  // '3.0.3',
  // '3.0.2',
  // '3.0.1',
  '3.0',
  // '2.5.4',
  // '2.5.3',
  // '2.5.2',
  // '2.5.1',
  '2.5',
  // '2.4.6',
  // '2.4.5',
  // '2.4.4',
  // '2.4.3',
  // '2.4.2',
  // '2.4.1',
  '2.4',
  // '2.3.3',
  // '2.3.2',
  // '2.3.1',
  '2.3',
  // '2.2.5',
  // '2.2.4',
  // '2.2.3',
  // '2.2.2',
  // '2.2.1',
  '2.2',
  // '2.1.2',
  // '2.1.1',
  '2.1',
  // '2.0.1',
  '2.0',
  // '1.8.5',
  // '1.8.4',
  // '1.8.3',
  // '1.8.2',
  // '1.8.1',
  '1.8'
  // '1.7.5',
  // '1.7.4',
  // '1.7.3',
  // '1.7.2',
  // '1.7.1'
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
    const [name, version] = hash.substring(hash.charAt(1) === '!' ? 2 : 1).split('/')
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
    doFilter()
  } else {
    window.scrollTo(0, 0)
  }
}

function notFound(name, version) {
  return elem(
    'p',
    !!version
      ? t('VERSION_NOT_FOUND', name, version) //`Plugin ${name} version ${version} not found.`
      : t('NOT_FOUND', name) //`Plugin ${name} not found.`
  )
}

const query = {
  freetext: null,
  version: null
}

function queryHandler(event) {
  query.freetext = event.target.value
    .toLocaleLowerCase()
    .replace(/\W/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  doFilter()
}

function versionHandler(event) {
  query.version = event.target.value
  doFilter()
}

function doFilter() {
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
      const text = t('FOUND', count)
      hits.appendChild(document.createTextNode(text))
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
  // clear(hits)
}

function clearFilterHandler(event) {
  if (event.keyCode === 27) {
    // clearFilter()
    document.querySelector('#query').value = ''
    query.freetext = ''
    // document.querySelector('#empty, #hits').style.display = 'none'
    doFilter()
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
      placeholder: t('FILTER_PLACEHOLDER'),
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
    [elem('option', { value: '' }, t('FILTER_ANY_VERSION'))].concat(options)
  )
  version.onchange = versionHandler

  return elem('div', { class: 'form-row my-4' }, [
    elem('div', { class: 'col-md-8' }, input),
    ' ',
    elem('div', { class: 'col-md-4' }, version)
  ])
}

function list(json) {
  return [
    filterForm(),
    elem(
      'p',
      { id: 'empty', style: 'display: none; margin-top: 1em', class: 'alert alert-info' },
      t('NO_MATCHES')
    ),
    elem('p', { id: 'hits', style: 'display: none; margin-top: 1em' }, ''),
    elem(
      'ul',
      { class: 'list-unstyled', id: 'list' },
      Object.values(json)
        .filter(plugin => !!plugin && !plugin.alias)
        .sort((a, b) => a[0].name.localeCompare(b[0].name))
        .map(plugin => plugin[0])
        .map(first =>
          elem('li', { id: first.name }, [
            elem('h3', elem('a', { href: `#!${first.name}` }, first.name)),
            elem('p', first.description),
            elem(
              'p',
              (first.keywords || []).reduce(
                (acc, keyword) =>
                  acc.concat([elem('code', { class: 'small' }, keyword), ' \u00A0']),
                []
              )
            )
          ])
        )
    )
  ]
}

function details(versions, version) {
  const first = !!version
    ? versions.find(plugin => plugin.vers === version)
    : versions[versions.length - 1]
  if (!first) {
    return null
  }

  const div = document.createElement('div')

  div.appendChild(
    elem('h2', [`${first.name}`, elem('small', { class: 'text-muted' }, ` ${first.vers}`)])
  )

  if (!!first.description) {
    append(div, elem('p', { class: 'shortdesc' }, first.description))
  }
  if (!!first.keywords && first.keywords.length !== 0) {
    append(div, [
      elem('h3', t('KEYWORDS')),
      elem(
        'p',
        first.keywords.reduce((acc, keyword) => acc.concat([elem('code', keyword), ' \u00A0']), [])
      )
    ])
  }
  if (!!first.license) {
    append(div, [elem('h3', t('LICENSE')), elem('p', license(first.license))])
  }
  if (!!first.homepage) {
    append(div, [
      elem('h3', t('HOMEPAGE')),
      elem('p', elem('a', { href: first.homepage }, getDomain(first.homepage)))
    ])
  }
  append(div, [
    elem('h3', t('INSTALL')),
    elem('p', { class: 'small' }, t('INSTALL_CURRENT')),
    elem('pre', `dita --install ${first.name}`),
    elem('p', { class: 'small' }, t('INSTALL_OLD')),
    elem('pre', `dita --install ${first.url}`)
  ])

  const deps = first.deps
  deps.sort((a, b) => a.name.localeCompare(b.name))
  append(div, [
    elem('h3', t('DEPENDENCIES')),
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
    elem('h3', t('VERSIONS')),
    elem(
      'ul',
      versions.map(version =>
        elem('li', elem('a', { href: `#!${first.name}/${version.vers}` }, version.vers))
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

function getDomain(homepage) {
  return homepage.replace(/^\w+:\/\/([^\/]+?)(\/.*)?$/, '$1')
}
