# Sharerecipes

If you like to cook and you want to share your dishes with other people, You can share your recipes through this web.

## Stack Software

- [Next.JS](https://nextjs.org/): [React](https://reactjs.org/) Framework, oriented to SSR.
- [TypeScript](https://www.typescriptlang.org/): Strongly typed programming language that builds on JavaScript.
- [GraphQL](https://graphql.org/) (API Query language) with [Apollo](https://www.apollographql.com/): Apollo is a platform for building a unified graph, a communication layer that helps you manage the flow of data between your app clients and your back-end services.
- [MongoDB](https://www.mongodb.com/es): NoSQL database system oriented to docs.
- [Jest](https://jestjs.io/): JavaScript testing framework.

## Using this repository

Before use this repository, you need to install [NodeJS](https://nodejs.org/en/download/) with `npm` that is multiplatform (is valid for Windows, MacOS and Linux).

It is a requisite to install npm in his 7.x.x version because you will need to use [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to set up the dependencies of the project.

## To Install

You need to clone the following repository:

```
https://github.com/AnderBuendia/sharerecipes.git
```

Go to the root project folder and initialize projects:

```
cd sharerecipes
npm install
```

Configure .env files:

```
cd server
cp example.env variables.env
```

Then go to frontend folder and configure the .env file:

```
cd frontend
cp example.env .env.local
```

Once the .env files are configured, you need to run the backend and frontend server from the root folder:

```
npm run dev:server

npm run dev:frontend
```

## Notes

To access website: https://sharerecipes.anderb.me/
