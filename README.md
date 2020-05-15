# comet_planning
A tool for the UTD community to plan out their coursework. 

## Development
To set up, go to the Firebase console and download the credientials. Paste the
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