---
layout: default
title: 'Frequently Asked Questions'
---

A few things people often ask about _DITA_ and _DITA Open Toolkit_.
{: .lead}

## What is DITA?

DITA is the _Darwin Information Typing Architecture_, an XML standard for authoring modular documents with an emphasis on reuse, maintained by the [DITA Technical Committee at OASIS][1].

## What is DITA Open Toolkit?

DITA Open Toolkit _(DITA-OT)_ is an open-source publishing tool used to convert DITA content from XML into various [output formats][2].

## How do I use DITA-OT?

You can [download][3], [install][4] and [build output][5] on the command line for free using the `dita` command.

If you prefer a graphical user interface, many of the best-known [XML editors, enterprise authoring solutions and commercial content management systems][6] rely on DITA-OT to publish XML content.

For example, _Oxygen XML Editor_ provides a visual means to run the bundled DITA-OT using a concept called [transformation scenarios][7].

## What version should I use?

In most cases, you should [download the latest release][8]: **DITA-OT {{ site.version }}**.

If you’re using other software that hasn’t yet been updated for the latest version, earlier versions are also available on the [Download][3] page.

## What output formats does DITA-OT support?

The [default transformations][2] include several HTML-based formats, PDF, and Markdown.

The toolkit’s extensible plug-in mechanism allows you to add your own transformations and install additional formats from the plug-in registry at [dita-ot.org/plugins][9].

## How does DITA-OT work?

DITA Open Toolkit uses [Ant][10], [XSLT][11], and Java libraries to transform DITA maps and topics into different deliverable formats. The modular [pipeline-based architecture][12] allows processing to be extended via plug-ins.

All of the [default output formats][2] are implemented as plug-ins, and you can create new plug-ins to add new publishing capabilities or customize processing without modifying the core code.

## What are plug-ins for?

Plug-ins allow you to extend the toolkit in a way that is consistent, easy to share, and safe to upgrade. Plug-ins can [customize publishing stages][13], [add new formats][14], or [extend an XML catalog][15] to support new specializations and document-type shells. A wide range of [extension points][16] allow you to integrate your changes into the core code.

Once you have [created][17] a plug-in, you can install it using the [automated installation procedure][18].

## How do I customize the HTML output?

For simple branded HTML pages, you can adjust the look and feel of the default output to match your company style by [setting parameters][19] to include [custom CSS][20], [header and footer branding][21], or [table-of-contents navigation][22]. _(These changes do not require a custom plug-in.)_

In addition to the basic modifications that can be made with parameter settings alone, you can create [custom HTML plug-ins][23] that bundle custom fonts, JavaScript, and stylesheets; modify the HTML markup, or override other aspects of HTML processing.

## How do I customize the PDF output?

DITA-OT includes a free PDF plug-in that converts the original DITA content to XSL-FO and generates a PDF file using [Apache FOP][24]. You can also install and use commercial PDF processors like [Antenna House][25] or [RenderX XEP][26].

You can [adjust various aspects of the default PDF output][27] by changing parameter settings.

As of DITA-OT 4.0, you can easily customize PDF output using [theme files][28]. The `--theme` option takes a path to a theme file and changes the styling of the PDF output without requiring changes to XSLT stylesheets.

For more complex customizations, you can create [custom PDF plug-ins][29].

[1]: https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=dita
[2]: https://www.dita-ot.org/#output-formats
[3]: https://www.dita-ot.org/download
[4]: https://www.dita-ot.org/dev/topics/installing-client
[5]: https://www.dita-ot.org/dev/topics/first-build-using-dita-command
[6]: https://www.dita-ot.org/#dita-ot-powers-these-tools
[7]: https://www.oxygenxml.com/doc/ug-editor/topics/create-dita-ot-transformation.html

[8]: https://github.com/dita-ot/dita-ot/releases/download/{{ site.version }}/dita-ot-{{ site.version }}.zip
[9]: https://www.dita-ot.org/plugins
[10]: https://ant.apache.org/
[11]: https://www.w3.org/TR/xslt20/
[12]: https://www.dita-ot.org/dev/reference/architecture
[13]: https://www.dita-ot.org/dev/topics/plugin-use-cases
[14]: https://www.dita-ot.org/dev/topics/plugin-newtranstype
[15]: https://www.dita-ot.org/dev/topics/plugin-xmlcatalog
[16]: https://www.dita-ot.org/dev/extension-points/plugin-extension-points
[17]: https://www.dita-ot.org/dev/topics/custom-plugins
[18]: https://www.dita-ot.org/dev/topics/plugins-installing
[19]: https://www.dita-ot.org/dev/parameters/parameters-base-html
[20]: https://www.dita-ot.org/dev/topics/html-customization-css
[21]: https://www.dita-ot.org/dev/topics/html-customization-header
[22]: https://www.dita-ot.org/dev/topics/html-customization-navigation
[23]: https://www.dita-ot.org/dev/topics/html-customization-plugins
[24]: https://xmlgraphics.apache.org/fop/
[25]: https://www.antennahouse.com/
[26]: https://www.renderx.com/
[27]: https://www.dita-ot.org/dev/topics/pdf-customization
[28]: https://www.dita-ot.org/dev/topics/pdf-themes
[29]: https://www.dita-ot.org/dev/topics/pdf-customization-plugins
