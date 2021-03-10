# IDE Configuration
We recommend using Visual Studio Code, but any code editor will do.

## VS Code Defaults
If you are using Visual Studio Code and want some sensible defaults, you can use
these to populate your `.vscode` directory. Additional suggestions for
launch configurations are welcome.

The following file will add a configuration to launch Chrome in debug mode.

`.vscode/launch.json`:
```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug app with Chrome DevTools",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "webpack:///./*": "${webRoot}/*",
        "webpack:///src/*": "${webRoot}/src/*",
        "webpack:///*": "*",
        "webpack:///./~/*": "${webRoot}/node_modules/*",
        "meteor://💻app/*": "${webRoot}/*"
      },
    }
  ]
}
```