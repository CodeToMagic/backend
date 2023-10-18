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

- GitLens
- Prettier \*
- Prisma

## Installation

Backend requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd backend
npm i
```

## DB

Check the [DB design](https://dbdocs.io/navajava1998/CS-6314-Hospital-Management?view=relationships) and to modify the design clone [DB design code](https://dbdiagram.io/d/hospital-management-6529de64ffbf5169f0a976dd)

create .env file and add the code given below

```sh
DATABASE_URL="mysql://nxb210086:demo123@localhost:3306/hospitalManagement"
```

Change nxb210086 to your local user name, demo 123 to your local password and hospitalManagement to your schema.

once you are done with the env setup, execute the below command

```sh
npx prisma db push
```

## Development

Want to contribute? Great!

Create a branch with develop/name eg: develop/navaneeth

```sh
1. git clone url
2. cd backend
3. git checkout develop/name or git checkout -b develop/name
4. npm i
5. npx prisma db push
6. npm start
7. Do the Dev
8. git add [All the files you have worked]
9. git commit -m "BE/DB : Message" [DB for only DB changes, BE for all other Back end changes]
10. git push
11. Don't merge to main, get the peer review
```

## License

MIT

**Thank you!**
