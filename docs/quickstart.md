# Quickstart

## Setting up Your Workspace

Prerequisites:

- A working [Node.js](https://nodejs.org/en/) LTS installation (at least
  v14.x.x)
- NPM (not Yarn, sorry), which comes with Node.js by default
- [Git](https://git-scm.com/)
- A code editor you feel comfortable using (perferably [Visual Studio Code](https://code.visualstudio.com/))

First, clone the repository.

If you use SSH for cloning Git repositories, the URL is
`git@github.com:UTDNebula/planner.git`.

If you use GitHub Desktop or some other GUI-based Git tool, consult your
solution's documentation.

Otherwise, on the command line, clone the repo:

```
git clone https://github.com/UTDNebula/planner.git
```

Now install the dependencies:

```
npm install
```

If you use VS Code, you're recommended to use the easy [IDE Configuration](./ide-config.md)
for this project.

## Setting Up the Project

This project uses some Firebase APIs. To set up the project, you must append
the following to your `.env.local`, replacing each of the ellipses with the
actual values from the [Firebase Console](https://console.firebase.google.com):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AI...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Now the dev server will be using the proper environment variables and use the
correct project resources.

**Note: Project Nebula Maintainers should use the `cometplanning` project
environment variables unless testing.** Contact the project lead if you need
access to project resources.

Now start the dev server to make sure everything works:

```
npm run dev
```

By default, you should be able to access the app in your browser at
`http://localhost:3000`. If you can do that with no errors, then you have
successfully set up the project!

## Making Commits

This project uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
spec to make contributions uniform. Each commit has a type, an optional scope,
a subject, and a description. An example:

```
feat(planner): Add ability to copy degree plans

The planner UI now allows a user to copy a degree plan by using the option that appears in the
options menu.

BREAKING CHANGE: The DegreePlanListItem how has an additional required field.
```

Commit subjects (like "Add ability to copy degree plans") should be high-level,
especially for new features or bugfixes. They should also be written in the
imparative mood (think of saying a command like "Change something" or "Add
something" instead of the past tense like "Moved something"). For example,
instead of the following commit message:

```
Updated profile
```

write:

```
feat(profile): Allow users to change their preferred names in their profile
```

This repository has Git hooks installed that will reject improperly-formatted
commits, so please take the time to describe what you change. This will help
everyone on the team keep track of features/bug fixes and make generating
changelogs much easier and more readable for end-users.

Make sure to follow the contribution [guide](../CONTRIBUTING.md) to use the
proper commit types and scopes.

Commit types include:

- chore: Default commit type for functional code changes or new implementations
  for features that are in progress or incomplete
- feat: For when a new user-facing feature is completed
- fix: For general, security, or regression bugfixes
- docs: For improving code documentatio
- refactor: For revisions to structure and organization of the codebase
- test: For updates to testing functionality
- revert: For undoing committed changes

Some scopes include:

- config: Project configuration or settings for build tools, linters, etc.
- deps: Changes to project dependencies (version updates)
- auth: User authentication and identity
- home: The home page
- profile: Relating to a student's profile, more about UX and front-end
  components
- landing: The home page for unauthenticated users
- planner: Components related to degree planning
- project: Project-wide code, docs, or configuration

A key note for scopes: consistency is most important. If you decide to create a
new scope, it needs to be documented in the contributing guidelines and have
the same meaning across commits.

The easiest way to make properly-formatted commits is to use Commitizen, which
is installed in the repo. Simply run `git commit`, and your command line will
guide you through the process of making a commit.
