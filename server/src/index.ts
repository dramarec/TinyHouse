import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';
import dotenv from "dotenv"
dotenv.config();

const mount = async (app: Application) => {
    const db = await connectDatabase();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ db }),
    });

    server.applyMiddleware({ app, path: '/api' });
    app.listen(process.env.PORT);

    console.log(`[app] : http://localhost:${process.env.PORT}`);

    const listings = await db.listings.find({}).toArray(); // listings is type any[]
    console.log(listings);
};

mount(express());
