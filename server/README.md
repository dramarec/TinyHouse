# [server]

-   `npm install` to install package dependencies
-   `npm run start` to run Node:Express server
-   `npm run seed` load files to db

```shell
node -v
npm -v

```

```json
  "scripts": {
    "start": "nodemon src/index.ts",
    "build": "tsc -p ./"
  }
```

```shell
npm install express
npm install nodemon typescript ts-node -D
npm install -D @types/node @types/express
### .eslintrc
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install body-parser
npm install -D @types/body-parser
### Apollo
npm install apollo-server-express
npm install graphql
npm install -D @types/graphql
### MongoDB
npm install mongodb
npm install -D @types/mongodb

npm install -D dotenv @types/dotenv

npm install lodash.merge
npm install -D @types/lodash.merge
### Google
npm install googleapis
[google.cloud.platform](https://console.cloud.google.com/)
[Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
[googlescopes](https://developers.google.com/identity/protocols/googlescopes)
[google.people](https://developers.google.com/people/api/rest/v1/people/get)
```

> graphQL

-   **`obj`** - the object returned from the resolver on the parent field. For
    root `Query` and `Mutation` object types, this argument is often not used
    and undefined.
-   **`args`** - the arguments provided to the field.
-   **`context`** - a value provided to _every_ resolver and which usually holds
    important context information (e.g. state of currently logged in user).
-   **`info`** - used usually only in advanced cases but contains information
    about the _execution_ state of the query - such as the `fieldName`,
    `schema`, `rootValue`, etc.

> Cookie

[Local Storage vs. Session Storage vs. Cookie](https://ru.hexlet.io/blog/posts/lokalnoe-hranilische-vs-sessionnoe-hranilische-vs-cookie)

[`cookie-parser`](https://github.com/expressjs/cookie-parser)

```shell
npm install cookie-parser
npm install -D @types/cookie-parser

npm i stripe
npm i -D @types/stripe

```