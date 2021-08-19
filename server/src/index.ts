import dotenv from "dotenv"
dotenv.config();

import express, { Application } from 'express';
import cookieParser from "cookie-parser";
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';

const envChecks = () => {
    if (!process.env.DB_HOST) {
        throw new Error('[APP]: DB_HOST must be defined');
    }

    if (!process.env.PORT) {
        throw new Error('[APP]: PORT must be defined');
    }

    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('[APP]: GOOGLE_API_KEY must be defined');
    }

    if (!process.env.G_CLIENT_ID) {
        throw new Error('[APP]: G_CLIENT_ID must be defined');
    }

    if (!process.env.G_CLIENT_SECRET) {
        throw new Error('[APP]: G_CLIENT_SECRET must be defined');
    }

    if (!process.env.SECRET) {
        throw new Error('[APP]: SECRET must be defined');
    }

    if (!process.env.NODE_ENV) {
        throw new Error('[APP]: NODE_ENV must be defined');
    }

    if (!process.env.GOOGLE_GEOCODE_KEY) {
        throw new Error('[APP]: GOOGLE_GEOCODE_KEY must be defined');
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('[APP]: STRIPE_SECRET_KEY must be defined');
    }
};

envChecks();

const mount = async (app: Application) => {
    const db = await connectDatabase();

    app.use(express.json({ limit: "2mb" }));

    app.use(cookieParser(process.env.SECRET));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({
            db, req, res
        }),
        formatError: (error) => {
            return {
                message: error.message
            };
        }
    });

    server.applyMiddleware({ app, path: '/api' });

    // app.listen(process.env.PORT);
    // console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/api`);
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server ready at : http://localhost:${process.env.PORT}/api/`);
    });
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