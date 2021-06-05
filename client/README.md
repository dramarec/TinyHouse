### [client]

-   yarn
-   yarn start

```shell
npx create-react-app my-app --template typescript
npm install / yarn add @apollo/client graphql


```

-   [Apollo CLI](https://github.com/apollographql/apollo-tooling) 
> can help generate client-side types for many different languages like TypeScript, Swift, Java, C#, etc.

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
![](public/assets/apollo-client-codegen-schema.png)

```shell
    yarn codegen:schema
    yarn codegen:generate
```
