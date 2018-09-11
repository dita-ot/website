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
  const h2 = document.createElement('h2')
  h2.appendChild(document.createTextNode(first.name))
  div.appendChild(h2)
  if (!!first.description) {
    const desc = document.createElement('p')
    desc.appendChild(document.createTextNode(first.description))
    div.appendChild(desc)
  }
  if (!!first.keywords && first.keywords.length !== 0) {
    const keywordTitle = document.createElement('h3')
    keywordTitle.appendChild(document.createTextNode('Keywords'))
    div.appendChild(keywordTitle)
    const desc = document.createElement('p')
    desc.appendChild(document.createTextNode(first.keywords.join(', ')))
    div.appendChild(desc)
  }
  if (!!first.homepage) {
    const title = document.createElement('h3')
    title.appendChild(document.createTextNode('Homepage'))
    div.appendChild(title)
    const desc = document.createElement('p')
    const link = document.createElement('a')
    link.setAttribute('href', first.homepage)
    link.appendChild(document.createTextNode(getDomain(first.homepage)))
    desc.appendChild(link)
    div.appendChild(desc)
  }
  const installTitle = document.createElement('h3')
  installTitle.appendChild(document.createTextNode('Install'))
  div.appendChild(installTitle)
  const installBlock = document.createElement('pre')
  installBlock.appendChild(document.createTextNode(`dita --install ${first.name}`))
  div.appendChild(installBlock)
  const versionTitle = document.createElement('h3')
  versionTitle.appendChild(document.createTextNode('Versions'))
  div.appendChild(versionTitle)
  const versionWrapper = document.createElement('ul')
  versions.forEach(version => {
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(version.vers))
    versionWrapper.appendChild(li)
  })
  div.appendChild(versionWrapper)

  const wrapper = document.getElementById('plugins')
  clear(wrapper)
  wrapper.appendChild(div)
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
