import dotenv from "dotenv"
dotenv.config();

import { MongoClient } from "mongodb";
import { Booking, Database, Listing, User } from "../lib/types";

const user = process.env.DB_USER;
const userPassword = process.env.DB_USER_PASSWORD;
const cluster = process.env.DB_CLUSTER;

const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net`;

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = client.db("main");       

    return {
        // listings: db.collection("test_listings")
        listings: db.collection<Listing>("listings"),
        bookings: db.collection<Booking>("bookings"),
        users: db.collection<User>("users")
    };
};
