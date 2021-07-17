### [client]

-   yarn
-   yarn start

```shell
-   npx create-react-app my-app --template typescript
-   npm install / yarn add @apollo/client graphql
-   npm install antd /  yarn add antd
-   yarn add react-router-dom @types/react-router-dom

```

-   [Apollo CLI](https://github.com/apollographql/apollo-tooling)
    > can help generate client-side types for many different languages like
    > TypeScript, Swift, Java, C#, etc.

```json
{
    // ...
    "scripts": {
        // ...
        "codegen:schema": "npx apollo client:download-schema --endpoint=http://localhost:9000/api",
        "codegen:generate": "npx apollo client:codegen --localSchemaFile=schema.json --includes=src/**/*.tsx --target=typescript"
    }
    // ...
}
```

```shell
    yarn codegen:schema
    yarn codegen:generate
```

```json
{
    // ...
    "scripts": {
        // ...
        "codegen:schema": "npx apollo client:download-schema --endpoint=http://localhost:9000/api",
        "codegen:generate": "npx apollo client:codegen --localSchemaFile=schema.json --includes=src/**/*.ts --globalTypesFile=./src/lib/graphql/globalTypes.ts --target=typescript"
    }
    // ...
}
```
