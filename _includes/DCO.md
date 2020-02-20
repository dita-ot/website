## Signing your work

<p class="lead">Before we can include your contribution in the DITA Open Toolkit, you need to give us your permission.</p>

As the author of any creative work (including source code, or documentation), you control the copyright for that work. The DITA-OT project can't legally use your contribution unless you allow us to.

To manage this process, the DITA-OT project uses a mechanism called a [Developer Certificate of Origin (DCO)](http://developercertificate.org) popularized by _The Linux Foundation_. The DCO is a legally binding statement that asserts that you are the creator of your contribution, and that you license the work under the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

To indicate that you agree to the [terms](http://developercertificate.org) of the DCO, you “sign off” your contribution by adding a line with your name and e-mail address to every Git commit message:

    Signed-off-by: Jane Doe <jane.doe@example.com>

You must use your real name (no pseudonyms or anonymous contributions are allowed.)

Your signature certifies that you are either the author of the contribution or have the right to submit it under the open-source [license](http://www.apache.org/licenses/LICENSE-2.0) used by the DITA Open Toolkit project.

If you set your `user.name` and `user.email` as part of your Git configuration, you can sign your commit automatically with `git commit -s`.

### Adding signoff to earlier commits

To sign off your last commit from the command line, use:

    git commit --amend --signoff

Then force-push to update the branch on your fork with:

    git push --force-with-lease

### Signing off with a Git client

Popular Git clients like [Sourcetree](https://www.sourcetreeapp.com) allow you to sign off commits via a graphical user interface.

While each client handles this differently, the basic process remains the same. Look for commit options in the repository settings or near the field where you enter your commit message:

1. Select the option to _amend_ (change) your last commit.
2. Select the option to _sign off_.
3. You can then push the branch, making sure to select the "force push" option to update the branch in your pull request with the new (signed off) version of your commit.
