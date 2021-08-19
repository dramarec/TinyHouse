import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { Stripe } from "../../../lib/api";
import { Database, Listing, Booking } from "../../../lib/types";
import { CreateBookingArgs } from "./types";
import { ObjectId } from 'mongodb';
import { authorize } from "../../../lib/utils";

export const bookingResolvers: IResolvers = {
    Mutation: {
        createBooking: async (
            _root: undefined,
            { input }: CreateBookingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Booking> => {
            try {
                const { id, source, checkIn, checkOut } = input;

                let viewer = await authorize(db, req);
                if (!viewer) {
                    throw new Error("viewer cannot be found");
                }

                const listing = await db.listings.findOne({
                    _id: new ObjectId(id)
                });
                if (!listing) {
                    throw new Error("listing can't be found");
                }

                if (listing.host === viewer._id) {
                    throw new Error("viewer can't book own listing");
                }

                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);

                if (checkOutDate < checkInDate) {
                    throw new Error("check out date can't be before check in date");
                }

                const totalPrice =
                    listing.price * ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);
                const host = await db.users.findOne({
                    _id: listing.host
                });

                if (!host || !host.walletId) {
                    throw new Error(
                        "the host either can't be found or is not connected with Stripe"
                    );
                }

                await Stripe.charge(totalPrice, source, host.walletId);

                const insertRes = await db.bookings.insertOne({
                    _id: new ObjectId(),
                    listing: listing._id,
                    tenant: viewer._id,
                    checkIn,
                    checkOut
                });

                const insertedBooking: Booking = insertRes.ops[0];

                await db.users.updateOne(
                    {
                        _id: host._id
                    },
                    {
                        $inc: { income: totalPrice }
                    }
                );

                await db.users.updateOne(
                    {
                        _id: viewer._id
                    },
                    {
                        $push: { bookings: insertedBooking._id }
                    }
                );

                await db.listings.updateOne(
                    {
                        _id: listing._id
                    },
                    {
                        $push: { bookings: insertedBooking._id }
                    }
                );

                return insertedBooking;
            } catch (error) {
                throw new Error(`Failed to create a booking: ${error}`);
            }
        },
        Booking: {
            id: (booking: Booking): string => {
                return booking._id.toString();
            },
            listing: (
                booking: Booking,
                _args: {},
                { db }: { db: Database }
            ): Promise<Listing | null> => {
                return db.listings.findOne({ _id: booking.listing });
            }
        }
    },
};
