# Project Nebula Security Policy

This security policy documents how to record a security vulnerability in Project
web app and how the Project Nebula maintainers respond to such inquiries.

## Supported Versions

**The current pre-release version of the Nebula Web will have security
bugs fixed on an ad-hoc basis until the first public release.**

Below is a table of what versions of Nebula Web will have security
vulnerabilities patched:
| Version | Supported |
| ----------- | --------- |
| Pre-release | :x: |

## Reporting a Vulnerability

If you notice a service vulnerability detectable in the user-facing portions
of this app, contact the Nebula maintainers at nebula-maintainers@acmutd.co
with the subject line `[nebula]: User-Facing Security Vulnerability`.

If the issue is due to something internal - like a vulnerability in the
library's dependencies, open an [issue](https://github.com/acmutd/nebula-web/issues/new/choose)
and tag it with the `Type: Security Vulnerability` label.

One a maintainer triages the issue and determines it to be an actual vulnerability,
work will immediately begin to resolve it. The fix will be applied to the
`develop` branch as soon as possible and once merged into `master` will be
published to the web app, which will apply changes on page reload.

The maintainers will reply to the issue once it is resolved or once a week until
resolution, whichever is earlier.
