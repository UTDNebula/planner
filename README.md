# Nebula Planner

_Nebula Planner is a tool for planning out students' college experience_

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## About

### Overview

Nebula Web allows students to plan out including coursework, co-curricular
activities like studying abroad and research, and extracurricular involvement in
student organizations. It does this with an intuitive drag-and-drop interface
that represents various college activities as blocks and displays them in semester
groups.

### Inspiration

Planning coursework poses a challenge for many.

From choosing the right professors to knowing when to take a class, schedule
planning is the bane of any college student.

UTD students have access to tools like [UTD Grades](https://utdgrades.com) and
Rate My Professors to help them pick classes for a specific semester, but
there hasn't been a solution that allows a student to say, "I want to major in
CS, minor in psychology, and do a few internships before grad school. Generating a
plan lets me do all of that with the professors I want."

Until now, that is.

Nebula Web is an integrated solution designed to help students plan out
their entire undergraduate experience in one place. It allows students to focus
on ensuring their college experience holistically suits their desires and
optimize for long-term success.

### Features

- Drag-and-drop interface for planning coursework by semester for any degree plan
- Sign in to save data across planning sessions
- Export to file to share your custom plan with someone else

## Contributing

Contributions are welcome!

This project uses the MIT License.

### Process

To get started, see the [contribution guide](./CONTRIBUTING.md). It'll tell you
everything you need to know.

Additionally, see the Project Nebula-wide contributors [guide](https://about.utdnebula.com/)
for more info.

Once you're ready to make some changes, see the
[issues](https://github.com/UTDNebula/planner/issues) for the repository.

If you want to brainstorm, share ideas or ask questions, start a discussion in
the [Discussions](https://github.com/UTDNebula/planner/discussions) section.

### Set-up

This project requires a working [Node.js](https://nodejs.org/en/) and NPM
installation. It also requires local environmental variables since it uses Firebase.

Create a file called .env.local in the root directory and add your personal Firebase env keys

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=REPLACE_ME 
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=REPLACE_ME 
NEXT_PUBLIC_FIREBASE_PROJECT_ID=REPLACE_ME 
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=REPLACE_ME 
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=REPLACE_ME 
NEXT_PUBLIC_FIREBASE_APP_ID=REPLACE_ME 
```

To start, clone the repository, and then run `npm start` to launch
a local development server at [`localhost:3000`](https://localhost:3000) by default.

```bash
git clone https://github.com/UTDNebula/planner.git
cd planner
npm run dev
```

Check out this [document](https://docs.google.com/document/d/1GLCdm314WjbUAgFMB_dFU6aQhgmwzXOn-ywWCr9A0Jg/edit?usp=sharing) for more information.

### Contact

This project is maintained by Nebula Labs, which is an open-source initiative to build projects that improve student life at UTD. If you have
any questions about this project or Project Nebula, join the Nebula Labs [discord](https://discord.gg/9Mefvj72).

For more formal inquiries, send us a message at core-maintainers@utdnebula.com
with "[nebula-web]" in the title. Please be as detailed as possible so we can
best assist you.
