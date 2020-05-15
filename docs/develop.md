# Directory Structure

Features are broken up into directories.

src
├── lib - Scripts common to multiple features
│   └── api - Functions to modify database data
│       ├── index.js -
│       └── schedules.js - Functions to modify schedule data
├── courses
│   └── reducers.js
├── schedules
│   ├── actions.js
│   └── reducers.js
├── onboarding
│   └── reducers.js
├── user
│   ├── actions.js
│   └── reducers.js
├── App.js - Root app instance
└── index.js - App initialization functions