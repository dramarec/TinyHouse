import dotenv from "dotenv"
dotenv.config();

import express, { Application } from 'express';
import cookieParser from "cookie-parser";
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';

const mount = async (app: Application) => {
    const db = await connectDatabase();

    app.use(cookieParser(process.env.SECRET));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ db, req, res })
    });

    server.applyMiddleware({ app, path: '/api' });

    app.listen(process.env.PORT);

    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/api`);
};

mount(express());


// const mount = async () => {
//     const db = await connectDatabase();
//     const server = new ApolloServer({
//         typeDefs,
//         resolvers,
//         context: () => ({ db }),
//     });

//     await server.start();

//     const app = express();

//     server.applyMiddleware({ app, path: '/api' });

//     app.listen(process.env.PORT);

//     console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/api`);
// };

// mount();