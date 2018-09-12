let plugins = null

document.addEventListener('DOMContentLoaded', event => {
  fetch('https://plugins.dita-ot.org/_all.json')
    .then(response => response.json())
    .then(init)
    .catch(err => {
      console.error('Failed to fetch plugins: ' + err)
    })
})

function init(json) {
  plugins = json
  window.onpopstate = event => {
    show(location.hash)
  }
  show(location.hash)
}

function show(hash) {
  if (!!hash) {
    const plugin = plugins[hash.substr(1)]
    details(plugin)
  } else {
    list(plugins)
  }
}

function list(json) {
  const ul = document.createElement('ul')
  Object.values(json)
    .filter(plugin => !!plugin)
    .sort((a, b) => a[0].name.localeCompare(b[0].name))
    .forEach(plugin => {
      const first = plugin[0]
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.setAttribute('href', `#${first.name}`)
      a.setAttribute('style', 'font-weight:bold')
      a.appendChild(document.createTextNode(first.name))
      li.appendChild(a)
      const desc = document.createElement('p')
      desc.setAttribute('class', 'small')
      desc.appendChild(document.createTextNode(first.description))
      li.appendChild(desc)
      ul.appendChild(li)
    })
  const wrapper = document.getElementById('plugins')
  clear(wrapper)
  wrapper.appendChild(ul)
}

function details(vs) {
  const versions = vs.slice().sort(compareVersion)
  const first = versions[versions.length - 1]
  const div = document.createElement('div')

  div.appendChild(elem('h2', {}, first.name))

  if (!!first.description) {
    append(div, [elem('p', { class: 'shortdesc' }, first.description)])
  }
  if (!!first.keywords && first.keywords.length !== 0) {
    append(div, [elem('h3', {}, 'Keywords'), elem('p', {}, first.keywords.join(', '))])
  }
  if (!!first.homepage) {
    append(div, [
      elem('h3', {}, 'Homepage'),
      elem('p', {}, [elem('a', { href: first.homepage }, getDomain(first.homepage))])
    ])
  }
  append(div, [
    elem('h3', {}, 'Install'),
    elem('p', { class: 'small' }, 'DITA-OT 3.1 and newer'),
    elem('pre', {}, `dita --install ${first.name}`),
    elem('p', { class: 'small' }, 'DITA-OT 3.0 and older'),
    elem('pre', {}, `dita --install ${first.url}`)
  ])

  const deps = first.deps
  deps.sort((a, b) => a[0].name.localeCompare(b[0].name))
  append(div, [
    elem('h3', {}, 'Dependencies'),
    elem(
      'ul',
      {},
      deps
        .filter(dep => dep.name === 'org.dita.base')
        .map(dep => elem('li', {}, `${dep.name} ${dep.req || ''}`))
    ),
    elem(
      'ul',
      {},
      deps
        .filter(dep => dep.name !== 'org.dita.base')
        .map(dep => elem('li', {}, `${dep.name} ${dep.req || ''}`))
    )
  ])

  append(div, [
    elem('h3', {}, 'Versions'),
    elem('ul', {}, versions.map(version => elem('li', {}, version.vers)))
  ])

  const wrapper = document.getElementById('plugins')
  clear(wrapper)
  append(wrapper, div)
}

function elem(name, attrs, content) {
  const installBlock = document.createElement(name)
  Object.keys(attrs).forEach(key => {
    installBlock.setAttribute(key, attrs[key])
  })
  append(installBlock, content)
  return installBlock
}

function append(parent, content) {
  switch (typeof content) {
    case 'string':
      parent.appendChild(document.createTextNode(content))
      break
    case 'object':
      if (Array.isArray(content)) {
        content.forEach(c => {
          parent.appendChild(c)
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
    console.log(as, bs)
    console.log(zip(as, bs))
    console.log(zip(as, bs).map(pair => compare(pair[0], pair[1])))
    return zip(as, bs)
      .map(pair => compare(pair[0], pair[1]))
      .reduce((acc, curr) => (acc !== 0 ? acc : curr), 0)
  } catch (e) {
    return 0
  }
}
