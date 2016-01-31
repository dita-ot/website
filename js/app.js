---
layout: javascript
---
'use strict'

requirejs.config({
  baseUrl: '{{ site.baseurl }}/js/lib',
  paths: {
    app: '../app',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min',
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min',
    bootstrap: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min'
  },
  shim: {
    bootstrap: ["jquery"]
  }
})

requirejs(['app/main'])
