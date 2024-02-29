---
layout: default
title: 'Frequently Asked Questions'
---

A set of frequently asked questions and useful links about the **DITA Open Toolkit**.
{: .lead}

## What is DITA?

**DITA** is the Darwin Information Typing Architecture, an **XML standard** for authoring modular documents with an emphasis on reuse, maintained by the [DITA Technical Committee at OASIS][1].

## What is the DITA Open Toolkit?

The **DITA Open Toolkit** (DITA-OT) is a publishing tool used to convert **DITA** content into various output formats.

## How do I use the DITA Open Toolkit?

You can [download][2], [install][3] and [build output][4] from **DITA** content using the command line.

Besides this, there are applications which come with the **DITA Open Toolkit** bundled. For example Oxygen XML Editor usually comes bundled with the latest **DITA Open Toolkit**. Oxygen provides visual means to run the bundled **DITA Open Toolkit** using a concept called [transformation scenarios][5].

## What version of DITA Open Toolkit should I use?

You should try to use the latest **DITA Open Toolkit** release available on the [download][6] page.

## What outputs can I obtain using the DITA Open Toolkit?

The entire set of default available output formats is available here: [https://www.dita-ot.org/dev/topics/output-formats.html][7]. But the **DITA Open Toolkit** can be enhanced by installing plugins to provide additional output formats.

## What is the general architecture of the DITA Open Toolkit?

The **DITA Open Toolkit** is a quite large mixture of [Ant][8] build scripts, Java libraries and [XSLT scripts][9]. It has a [pipeline-based architecture][10] which uses plugins to publish DITA content to various output formats. Most of the **DITA Open Toolkit** customizations that you want to make in order to add new publishing capabilities or to customize existing publishing choices can be made without modifying its internal core.

## What is a DITA Open Toolkit plugin?

A **DITA Open Toolkit** plugin can either provide a [new publishing format][11], [customize an existing publishing stage][12] or provide a DITA [specialization vocabulary][13]. The plugin can use one of the numerous extension points available in the **DITA Open Toolkit**: [https://www.dita-ot.org/dev/extension-points/plugin-extension-points.html][14].

Once you have [created][15] a plugin you can install it in the **DITA Open Toolkit** either by [manual installation][16] or using the new [automated installation procedure][17].

## How do I customize the HTML-based outputs?

There are a number of parameters which can be set to customize the HTML-based outputs: [http://www.dita-ot.org/dev/parameters/parameters-base-html.html][18]. For example you can specify your own **CSS** stylesheet to be used with the generated HTML output.

You can also create a plugin to customize the HTML outputs by adding a custom XSLT stylesheet: [Creating a simple DITA Open Toolkit plugin to customize published HTML and PDF content][19].

## How do I customize the PDF output?

The **DITA Open Toolkit** comes bundled with a free PDF generation plugin which uses XSL-FO. The PDF output is obtained by passing the original **DITA** content to **XSL-FO** and then generating **PDF** using an **XSL-FO** processor. The default bundled and used XSL-FO processor is the [Apache FOP][21] but you can also install separately and use commercial PDF processors like [Antenna House][22] or [RenderX XEP][23].

You can customize the **PDF** output using [PDF Themes][24].

There are a number of other solutions for obtaining **PDF** from **DITA**: [Possibilities to obtain PDF from DITA][25].

[1]: https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=dita
[2]: http://www.dita-ot.org/download
[3]: http://www.dita-ot.org/dev/getting-started/installing-client.html
[4]: https://www.dita-ot.org/dev/topics/first-build-using-dita-command.html#ariaid-title1
[5]: https://www.oxygenxml.com/doc/ug-editor/topics/create-dita-ot-transformation.html
[6]: http://www.dita-ot.org/download
[7]: https://www.dita-ot.org/dev/topics/output-formats.html
[8]: http://ant.apache.org/
[9]: https://www.w3.org/TR/2007/REC-xslt20-20070123/
[10]: https://www.dita-ot.org/dev/reference/architecture.html
[11]: https://www.dita-ot.org/dev/topics/plugin-newtranstype.html
[12]: https://www.dita-ot.org/dev/topics/plugin-applications.html
[13]: https://www.dita-ot.org/dev/topics/plugin-xmlcatalog.html
[14]: https://www.dita-ot.org/dev/extension-points/plugin-extension-points.html
[15]: https://www.dita-ot.org/dev/topics/plugin-newtranstype.html#ariaid-title1
[16]: https://www.oxygenxml.com/doc/ug-editor/topics/dita-ot-install-plugin.html
[17]: https://www.dita-ot.org/dev/topics/plugins-installing.html
[18]: http://www.dita-ot.org/dev/parameters/parameters-base-html.html
[19]: https://blog.oxygenxml.com/topics/creating-simple-dita-open-toolkit.html
[20]: https://www.oxygenxml.com/doc/ug-editor/topics/pdf-css-customization.html
[21]: https://xmlgraphics.apache.org/fop/
[22]: https://www.antennahouse.com/
[23]: http://www.renderx.com/
[24]: https://www.dita-ot.org/4.2/topics/pdf-themes
[25]: https://blog.oxygenxml.com/topics/ditaToPDF.html