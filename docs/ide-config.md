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
  "compounds": [
    {
      "name": "Launch for Dev",
      "configurations": ["Launch Next.js Dev Server", "Launch Dev Browser"]
    }
  ],
  "configurations": [
    {
      "type": "pwa-chrome",
      "request": "launch",
      "name": "Launch Dev Browser",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "outFiles": ["${workspaceFolder}/**/*.js", "!**/node_modules/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Next.js Dev Server",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000,
      "outFiles": ["${workspaceFolder}/**/*.js", "!**/node_modules/**"]
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Launch Next.js Debugger",
      "skipFiles": ["<node_internals>/**"],
      "port": 9229
    }
  ]
}
```

If you want to enable the debugger in VS Code to use breakpoints and other
functionality, run the "Launch Next.js Debugger" configuration. This will attach
the debugger to the actively running dev server.
