# Project Nebula Contributor's Guide
*Information on how to contribute to this project.*

## Non-code Contributions
If you want to make a non-code contribution to this project like design, writing,
or other types of additions/modifications, contact
[nebula-maintainers@acmutd.co](mailto:nebula-maintainers@acmutd.co)
with the subject line [nebula-web] and your proposed set of changes. If
applicable, make sure to link specifically where in the project the changes
should be made. More detail is better.

## Code
This is the process for contributing code to the repository:
1. Choose an issue.
   - Find an issue from the existing list OR
   - Open a new issue
2. Understand the requirements.
   - Ask in response to issue
3. Start programming.
   - For non-maintainers:
      - Fork the repository
      - Clone the fork
   - For all contributors:
      - Make a feature branch
      - Make your changes
4. Make a pull request.
5. Work with maintainers to resolve any requested changes to your contribution.
6. Wait until code gets merged into `develop`.
7. Celebrate after code gets merged into `master` for release!

### Opening an Issue
Project Nebula uses the following issue labels to designate between type:
- `Type: Feature Request` for user-facing or API feature requests
- `Type: Security Vulnerability` for security vulnerability reports
- `Type: Bug Report` for non-security-related bug reports
- `Type: Internal` for general chore work that needs to get done, like
refactoring or dev ops

Each issue must have exactly one type, one category, and one status.
Special-purpose indicators are optional.

Project components are also:
- `Category: User Experience` - user-facing functionality
- `Category: Database` - back-end logic for data handling
- `Category: Domain Logic` - non-UI app/service-specific logic
- `Category: Authentication` - authorization and authentication

We also use the following issue labels to designate status:
- `Status: Awaiting Triage` - requires a determination on how to proceed
- `Status: Won't Fix` - will not be implemented
- `Status: In Progress` - has begun implementation
- `Status: On Hold` - has been delayed for a future sprint or release
- `Status: Done`: has been resolved by code that has been merged into the
default branch

We also have the following special-purpose indicators:
- `Special: Good First Issue` - simple to resolve for
people new to the project and don't require detailed knowledge about a component
to fix
- `Special: Help Needed` - may either be urgent to fix or stale (has been open
for multiple sprints)

By default, Project Nebula repositories have four default issue templates to
make the process easier, each corresponding to one issue type:
- Feature Request
- Bug Report
- Security Vulnerability
- Internal

### Making a Branch
#### Forking the Repository
**If you are a project maintainer, skip this.**
Non-maintainers contributing to the codebase should fork the project repository
to create their own copy of the codebase. Your forked codebase should be the one
you commit to. 

Instead of doing this:
```shell script
git clone https://github.com/acmutd/nebula-web.git
```

You would do this:
```shell script
git clone https://github.com/<your-username>/nebula-web.git
```

### Branching Strategy
Project Nebula uses the following naming convention for branching:
- `master` for production-ready code
   - Default branch for basing pull requests
   - Requires one other maintainer to review 
- `develop` for generally stable, functioning builds
   - Requires one other maintainer to review before merge
- `feature/<feature-name>` for specific feature development
   - May only be merged into `develop`
- `bugfix/<bugfix-name>` for urgent fixes 
   - May be applied directly to `master` and `develop`
- `chore/<chore-name>` for foundational work that may not have any user-facing
functionality.
   - May only be merged into `develop`.

To create a branch, check out the `develop` branch and create a new one from the
head:

```shell script
git checkout develop
git checkout -b <branchname>
```

Now you should be set up to start implementing your changes!

### Making a Commit
Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification. Using Conventional Commits allows us to automatically generate
changelogs that abide by semantic versioning. Individual project codebases will
reject commits that are not properly formatted.

Project Nebula uses the following commit types:
- chore: Default commit type for functional code changes or new implementations
for features that are in progress or incomplete
- feat: For only when a new user-facing feature is complete
- fix: For general, security, or regression bugfixes
- docs: For improving code documentation.
- config: For modifying project configuration or settings
- refactor: For revisions to structure and organization of the codebase
- test: For updates to testing functionality
- revert: For undoing commits related to implemented features

Given the nature of development, most commits will generally be `chore` commits.
However, make sure to commit early, and commit often. Once you finish a small
part of your issue that works, commit it:

```
git commit
```

Here is an example of a good commit message:
```
feat(auth): Implement user sign in

This commit implements basic user authentication and

TODO: Handle user password reset
```

Here is an example of a not-so-good commit message:
```
updated images 
```

Strongly avoid commits similar to "Update files" or "Create thing". Good commit
messages are useful when finding where bugs were introduced into code.

### Making a Pull Request
Once you've committed to your branch, you can make a pull request at any part of
the development process. Just mark is as a draft until 

Pull requests inform maintainers of your contribution and help them prepare it
for integration into the project's codebase. When making your pull request, fill
out the template to the best of your ability. More detail is better - not just
for the current maintainers but also contributors who may want to contribute in
the future!

Non-bugfix pull requests should be applied to the `develop` branch.

While you are working on your contribution, you'll likely have questions about
specific parts of your code. Project maintainers will try their best to address
them and help you as you finish your pull request. As much as possible, try to
keep questions about code embedded within the pull request itself. For anything
else, post them in the relevant Project Nebula channel in the [ACM Discord](https://acmutd.co/discord).

All pull requests must pass all status checks and must be approved by one
maintainer before being merged into the default `develop` branch. Once a pull
request is merged into the default branch, the branch used to create the pull
request should be deleted.

### (For Maintainers) Preparing for Release and Deployment
Deployment is handled on the `master` branch. Any code pushed to `master` will
be automatically deployed to live servers, so don't do this unless you're
certain you're ready to release. The process goes like this:
1. Determine a commit on the `develop` branch that is worthy for release
2. Merge branch into `master`

And that's it. The release GitHub Action will take care of the rest. Semantic
Release will automatically version the project.

Releases names use Semantic Versioning (SemVer), following the `MAJOR.MINOR.FIX`
version format. In the case of projects that have largely symbolic "major"
versions, it is up to the maintainers to determine what meets the qualification
as a "breaking change" and label commits accordingly when merging into `master

For more information, see the [FAQ](https://www.conventionalcommits.org/en/v1.0.0/#how-does-this-relate-to-semver):
> `fix` type commits should be translated to PATCH releases. `feat` type commits
should be translated to MINOR releases. Commits with `BREAKING CHANGE` in the
commits, regardless of type, should be translated to MAJOR releases.

Deployment and hosting for this project is handled by ACM Development. Project
maintainers (not contributors) are responsible for service upkeep and responding
to issues in hosting and database management.
