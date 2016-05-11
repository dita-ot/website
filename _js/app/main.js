'use strict'

define([
  'TocController',
  'SearchController',
  'HelpController',
  'EditController',
  'jquery'
], function (
  TocController,
  SearchController,
  HelpController,
  EditController,
  $
) {
  const indexAttr = $("link[rel=index]").attr('href')
  if (indexAttr && window.history) {
    var index = new URI(indexAttr).absoluteTo(window.location.href).href()
    $.ajax({
      url: index,
      success: (data) => {
        const $toc = $("<body>").append($.parseHTML(data)).find('nav')
        TocController($toc, index)
        SearchController($toc, index)
        HelpController()
        EditController()
      }
    })
  }
});
