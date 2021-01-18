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

```shell script
git clone https://github.com/acmutd/comet-planning
cd comet-planning
git checkout dev
npm install
npm start
```

### Using Storybook
Storybook is a tool for building UI components. More information [here](https://storybook.js.org/).

```shell script
npm run storybook
```

### Setting up Firebase
Create a `.env.local` file at the root of the repository. It should contain the
following environment variables copied from their respective names in the
Firebase developer console.

```env
REACT_APP_FIREBASE_API_KEY=<apiKey>
REACT_APP_FIREBASE_AUTH_DOMAIN=<authDomain>
REACT_APP_FIREBASE_DATABASE_URL=<databaseURL>
REACT_APP_FIREBASE_PROJECT_ID=<projectId>
REACT_APP_FIREBASE_STORAGE_BUCKET=<storageBucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
REACT_APP_FIREBASE_APP_ID=<appId>
```

Note: If you update the Firebase environment variables while the development
server is running, you will have to restart it to apply the changes. 


## How to Contribute
Contributors to the project are welcome! See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more information.

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
