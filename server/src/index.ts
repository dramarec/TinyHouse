import express, { Application } from 'express';
import cookieParser from "cookie-parser";
import compression from "compression";
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';

const mount = async (app: Application) => {
    const db = await connectDatabase();

    app.use(express.json({ limit: "2mb" }));

    app.use(cookieParser(process.env.SECRET));

    app.use(compression());

    app.use(express.static(`${__dirname}/client`));

    app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));

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

    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server ready at : http://localhost:${process.env.PORT}/api/`);
    });
};

mount(express());