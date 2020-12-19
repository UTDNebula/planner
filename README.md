# Comet Planning
*Comet Planning is a tool for planning out students' college experience*

![Deploy to Firebase Hosting on merge](https://github.com/acmutd/comet-planning/workflows/Deploy%20to%20Firebase%20Hosting%20on%20merge/badge.svg?branch=chore%2Ffront-rewrite)

## Overview
Comet Planning allows students to plan out including coursework, co-curricular activities
like studying abroad and research, and extracurricular involvement in student organizations.
It does this with an intuitive drag-and-drop interface that represents various college activities
as blocks and displays them in semester groups.

### Inspiration
Planning coursework poses a challenge for many.

From choosing the right professors to knowing when to take a class, schedule planning is the bane
of any college student.

UTD students have access to tools like [UTD Grades](https://utdgrades.com) and Rate My Professors 
to help them pick classes for a specific semeester, but there hasn't been a solution that allows
a student to say, "I want to major in CS, minor in psychology, and do a few internships before
grad school. Generate a plan lets me do all of that with the professors I want."

Until now, that is.

Comet Planning is an integrated solution designed to help students plan out their entire
undergraduate experience in one place. It allows students to focus on ensuring their college
experience holistically suits their desires and optimize for long-term success.

### Features
- Drag-and-drop interface for planning coursework by semester for any degree plan
- Sign in to save data across planning sessions
- Export to file to share your custom plan with someone else

## Getting Started
This project requires a working [Node.js](https://nodejs.org/en/) and NPM installation.
To start, clone the repository, and then run `npm start` to launch a local development server
at [`localhost:3000`](https://localhost:3000) by default.

```bash
git clone https://github.com/acmutd/comet-planning
cd comet-planning
git checkout dev
npm start
```

### Initializing Firebase
To set up Firebase, go to the Firebase console and download the credientials. Paste the
body of the config into `src/firebase.config.js` in the exported block.

For example, `src/firebase-config.js` should look something like this:
```js
export default {
  // Config goes here
  apiKey: 'some_api_key',
  authDomain: 'cometplanning.firebaseapp.com',
  databaseURL: 'https://cometplanning.firebaseio.com',
  projectId: 'cometplanning',
  storageBucket: 'cometplanning.appspot.com',
  messagingSenderId: 'some_messaging_sender_id',
  appId: 'some_app_id',
};
```

Note: Changes to `src/firebase-config.js` should not be checked into source
control. To prevent accidents, the project `.gitignore` automatically ignores
changes to the file.

## How to Contribute

This project loosely uses the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model.
There are three types of branches: `master`, which always contains complete, production-ready copies of project code, `dev`, which is guaranteed to at least be runnable on any machine (generally free of bugs), and feature branches, which are children of `dev` that are primarily used to create new features.
Here is the process to make changes to the project:

1. From `dev`, create a new feature branch. For example, `auth-signin`
2. Make commits to the feature branch.
3. When enough of the feature is complete, open a pull request to merge changes from your feature branch to `dev`. For larger features or changes to code, open a draft pull request to track changes until completion.
4. Request a review from a project contributor, and add the pull request to a project board and milestone (if applicable)
5. When a review is complete, a contributor will squash merge the feature branch into `dev`. The feature branch can then be deleted.

### Contributors
**Current:**
- [Willie Chalmers III](https://www.linkedin.com/in/willie-chalmers-iii/)
- [Sunny Guan](https://www.linkedin.com/in/sunny-guan)
- [Saloni Shivdasani](https://www.linkedin.com/in/saloni-s/)

**Past:**
- [Aliah Shaira De Guzman](https://www.linkedin.com/in/aliahdg/)
- [Aishani De Sirkar](https://www.linkedin.com/in/aishani-de-sirkar-9222a7170/)
- [Medha Aiyah](https://www.linkedin.com/in/medha-aiyah/)

## Questions

Sometimes you may have questions regarding the development of this product. If the answer was not found in this readme please feel free to reach out to the development officers at [development@acmutd.co](mailto:development@acmutd.co).

We request that you be as detailed as possible in your questions, doubts or concerns to ensure that we can be of maximum assistance. Thank you!

![ACM Development](https://www.acmutd.co/brand/Development/Banners/light_dark_background.png)
