# Sharerecipes

If you like to cook and you want to share your dishes with other people, You can share your recipes through this web.

## Stack Software

- [Next.JS](https://nextjs.org/): [React](https://reactjs.org/) Framework, oriented to SSR.
- [GraphQL](https://graphql.org/) with [Apollo](https://www.apollographql.com/): API Query language.
- [MongoDB](https://www.mongodb.com/es): NoSQL database system oriented to docs.

## Using this repository

Before use this repository, you need to install [NodeJS](https://nodejs.org/en/download/) with `npm` that is multiplatform (is valid for Windows, MacOS and Linux).

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
cd packages/server
cp example.env variables.env
```

Then go to frontend folder and configure the .env file:

```
cd packages/frontend
cp example.env .env.local
```

Once the .env files are configured, you need to run the backend server:

```
cd packages/server
npm run dev
```

Finally, go to frontend folder and run the server:

```
cd packages/frontend
npm run dev
```

## Notes

To access website: https://sharerecipes.anderb.me/
