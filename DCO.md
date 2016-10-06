---
layout: default
title: "Signing your work"
---

<p class="lead">Before we can include your contribution in the DITA Open Toolkit, you need to give us your permission.</p>

As the author of any creative work (including source code, or documentation), you automatically own the copyright for that work. The DITA-OT project can't legally use your contribution unless you allow us to.

To manage this process, the DITA-OT project uses a mechanism called a [Developer Certificate of Origin (DCO)][1] popularized by _The Linux Foundation_. The DCO is a legally binding statement that asserts that you are the creator of your contribution, and that you wish to allow the DITA-OT to use your work.

To indicate that you agree to the [terms][1] of the DCO, you “sign off” your contribution by adding a line with your name and e-mail address to every Git commit message:

    Signed-off-by: Jane Doe <jane.doe@example.com>

You must use your real name (no pseudonyms or anonymous contributions are allowed.)

Your signature certifies that you are either the author of the contribution or  have the right to submit it under the open-source license used by the DITA Open Toolkit project.

If you set your `user.name` and `user.email` as part of your Git configuration, you can sign your commit automatically with `git commit -s`.


[1]: http://developercertificate.org/
