document.addEventListener('DOMContentLoaded', event => {
  fetch('https://plugins.dita-ot.org/_all.json')
    .then(response => response.json())
    .then(json => {
      const ul = document.createElement('ul')
      Object.values(json)
        .filter(plugin => !!plugin)
        .forEach(plugin => {
          const li = document.createElement('li')
          li.appendChild(document.createTextNode(plugin[0].name))
          ul.appendChild(li)
        })
      document.getElementById('plugins').appendChild(ul)
    })
    .catch(err => {
      console.error('Failed to fetch plugins: ' + err)
    })
})
