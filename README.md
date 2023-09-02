# BackEnd

## VS Code Configuration

Replace your `VScode` local settings.json

```sh
{
  "workbench.colorTheme": "Default Light Modern",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "git.autofetch": true
}
```

#### VS Code Plugins

- GitLens \*
- Prettier \*

## Installation

Backend requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd backend
npm i
npm start
```

## Development

Want to contribute? Great!

Create a branch with develop/name eg: develop/navaneeth

```sh
1. git clone url
2. cd backend
3. git checkout develop/name or git checkout -b develop/name
4. npm i
5. npm start
6. Do the Dev
7. git add .
8. git commit -m "BE-number : Message"
9. git push
```

## License

MIT

**Thank you!**
