# Dev Workflow and Deployment

The structure of Planner workflows and its deployment from top to bottom.

## Workflows and Previews

In development, a personal Neon DB and local instance of the validator should be used.
When a pull request is opened, the preview workflow will trigger the creation of a [Neon branch](https://neon.tech/docs/introduction/branching)
(TLDR: a copy-on-write clone of the prod DB) and trigger a Vercel preview for said PR.

When a PR is merged/closed, the preview's Neon branch is deleted.

> **Note** <br />
> It is possible to trigger a branch deletion before the creation is complete (a branch is opened then merged/close immediately). In this case, the branch might need to be manually deleted.

Workflow files: [`.github/workflows/deploy-preview.yml`](https://github.com/UTDNebula/planner/blob/develop/.github/workflows/deploy-preview.yml), [`.github/workflows/deploy-preview.yml`](https://github.com/UTDNebula/planner/blob/develop/.github/workflows/delete-neon-branch.yml).

## Deployments

The staging deployment, https://dev.planner.utdnebula.com, deploys off the `develop` branch, and the production deployment deploys off of `main`.

All deployment/external service:

- Web server: Vercel
- TRPC Routes: Vercel Edge Functions
- Planner Postgres: Neon
- Sentry (Crash analytics)
- Auth Providers: Discord, Google, Facebook
- Mailtrap (Email "magic link" auth)
