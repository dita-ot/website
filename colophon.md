---
layout: default
title: 'Colophon'
---

<p class="lead">How we build and maintain the DITA Open Toolkit project website.
  <a href="https://www.netlify.com" class="align-text-bottom float-right">
    <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"/>
  </a>
</p>

The DITA-OT project website is hosted on [Netlify][1] and deployed to [dita-ot.org][2].

The website is maintained in Git and updated by pushing to the repository at [github.com/dita-ot/website][3].

Source files for the project website are stored in [Markdown][4] and HTML, enriched with [Liquid][5] templating tags and styled with [Sass][6]. The [Bootstrap][7] framework provides the foundation for the site layout. The [Jekyll][8] publishing engine combines these plain text components to the final static website you see here.

The [Documentation][9] section is maintained in DITA using the source files from the DITA Open Toolkit documentation repository at [github.com/dita-ot/docs][10]. The OT docs are transformed to HTML5 using the [org.dita-ot.html][11] plugin, which extends the default `html5` transformation with additional processing specific to the project website.

Site output is built with [Gradle][12] using the settings in the [site][13] build task. The [DITA Open Toolkit Gradle plugin][14] is used with the Gradle dæmon and the `--continuous` build option to automatically regenerate the site output whenever documentation source files change. A staging environment provides a preview of generated site output via the `jekyll serve` command for local testing. The `--livereload` option updates the content in the browser whenever source files change on disk.

A continuous integration process based on [GitHub Actions][15] automatically republishes the latest [development version][9] of the documentation on the project website whenever changes are pushed to the `develop` branch of the [dita-ot/docs][10] repository.

Documentation and website source files are formatted with [Prettier][16]. Git hooks configured with [Husky][17] and [lint-staged][18] ensure that Prettier runs on all staged changes to format content consistently before committing.

The development docs are indexed by [Algolia DocSearch][19], which provides the full text search capabilities available via the search form in the navigation bar.

The pages in the development documentation include **Edit this page** links that open the DITA source file for the topic in [oXygen XML Web Author][20]. The web-based authoring workflow prompts users to log in to GitHub and fork the [dita-ot/docs][10] repository if necessary. Changes saved in the authoring environment are committed to a new branch, and a pull request is created to submit changes for review by the DITA-OT documentation team.

[1]: https://www.netlify.com
[2]: https://www.dita-ot.org
[3]: https://github.com/dita-ot/website
[4]: https://daringfireball.net/projects/markdown/
[5]: https://github.com/Shopify/liquid/wiki
[6]: https://sass-lang.com
[7]: https://getbootstrap.com
[8]: https://jekyllrb.com
[9]: https://www.dita-ot.org/dev/
[10]: https://github.com/dita-ot/docs
[11]: https://github.com/dita-ot/org.dita-ot.html
[12]: https://gradle.org
[13]: https://github.com/dita-ot/docs/blob/develop/build.gradle#L172-L188
[14]: https://github.com/eerohele/dita-ot-gradle
[15]: https://github.com/features/actions
[16]: https://prettier.io
[17]: https://github.com/typicode/husky
[18]: https://github.com/okonet/lint-staged
[19]: https://docsearch.algolia.com
[20]: https://www.oxygenxml.com/webauthor/
