# How to Contribute to Comet Planning
Hi there! Thank you for considering contributing to this project. You do not
have to be a CS major or even know how to program to help this project. This file
outlines the general process for contributing.

## TL;DR
- Create an issue on GitHub
- Discuss with maintainers about ways to fulfill reuirements of issue
- Create a pull request
- Implement requested changes (if any) for the pull request
- Wait until pull request is merged into upstream branch
- Celebrate!

## Making a Code Contribution
This project loosely uses the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model.
There are three types of branches: `master`, which always contains complete,
production-ready copies of project code, `dev`, which is guaranteed to at least
be runnable on any machine (generally free of bugs), and feature branches,
which are children of `dev` that are primarily used to create new features. Here
is the process to make changes to the project:

1. From `dev`, create a new feature branch. For example, `auth-signin`
2. Make commits to the feature branch.
3. When enough of the feature is complete, open a pull request to merge changes from your feature branch to `dev`. For larger features or changes to code, open a draft pull request to track changes until completion.
4. Request a review from a project contributor, and add the pull request to a project board and milestone (if applicable)
5. When a review is complete, a contributor will squash merge the feature branch into `dev`. The feature branch can then be deleted.


## Governance Model
For now, ACM Development ultimately maintains executive control over the
project. The Comet Planning Maintainers are responsible for code quality and
are the only individuals allowed to merge to the `dev` and `master` branches.

A contributor is anyone who meaningfully interacts with the repo in some way,
whether by creating a feature request, filing a bug report, or leaving a
comment on an issue.

More formally speaking, any code you contribute to the repository becomes the
intellectual property of the Comet Planning Maintainers.

## Notes About Deployment
The `master` branch contains code for the live, production version of the app.
Commits applied to the master branch will trigger an rebuild that will be
automatically deployed to the app actually used by users. For this reason, the
`master` branch is considered protected and requires multiple checks to allow
code to be merged into it.

The `dev` branch is the default and contains generally stable code. Pushes to
this branch automatically build new demo versions. It is also considered the
staging branch to test functionality before deployment to `master`. Only commits
made on the `dev` branch are allowed to be merged into `master`.
