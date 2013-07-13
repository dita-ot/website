---
layout: default
title: "Features of the DITA Open Toolkit"
---

The DITA Open Toolkit is primarily a publishing tool – it is intended to convert DITA content into various output formats. This topic describes which versions of DITA are supported as input; it also describes the output formats available in a default installation.

Supported versions of DITA
--------------------------

The toolkit supports all standard versions of DITA, including 1.0, 1.1, and 1.2. In addition, it will still process documents that were written according to the pre-OASIS version of DITA, often called "dita132".

Supported transformation types
------------------------------

The following transformation types are supported out of the box with any toolkit installation:

* **PDF** -
         PDF output is based on a plug-in that produces XSL-FO
         output. The XSL-FO output may be converted to PDF using
         an open source tools (Apache FOP) or using commercial
         tools such as RenderX or Antenna House Formatter. This
         transformation type replaced an older demo PDF
         transform, and is often called "PDF2".

* **XHTML** -
         XHTML output is supported together with a variety of
         XHTML-based navigation types. Navigation is not
         required. The XHTML output contains class values based
         on the DITA elements so CSS files may be used to
         customize the output style.

* **Eclipse Help** -
         Eclipse output is an XHTML based format that also
         produces navigation and index files for use with Eclipse
         information centers.

* **TocJS**
         The TocJS transformation type includes XHTML output
         along with JavaScript based frames for navigation,
         including TOC sections that expand and collapse.

* **HTML Help** -
         Microsoft Compiled HTML Help output produces a compiled
         help (.chm) file with the XHTML topics, table of
         contents, and index.

* **Java Help** -
         Java Help includes a table of contents and index for use
         with the Java Help platform.

* **OpenDocument** -
         ODT is a document format based on the ODF standard, for
         use with tools like Open Office. Support for ODT was
         added in DITA-OT 1.5.2.

* **Rich Text Format** -
         RTF output is supported for basic content, but complex
         markup and some advanced features of DITA may not be
         supported.

* **troff** -
         troff based man pages are supported; one man page is
         generated for each input topic. Note that tables are not
         supported by this transformation type.

The toolkit’s plug-in mechanism allows new transformation types to be added. Note that both TocJS and PDF2 were originally separately installable plug-ins, which became widespread enough that they are now bundled together with the default toolkit installation.