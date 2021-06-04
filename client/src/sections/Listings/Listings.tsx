import React, { useState } from "react";
import { server } from "../../api";
import {
    DeleteListingData,
    DeleteListingVariables,
    ListingsData,
    Listing,
} from "./types";

const LISTINGS = `
    query Listings {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
    title: string;

}

export const Listings = ({ title }: Props) => {
    const [listings, setListings] = useState<Listing[] | null>(null);

    const fetchListings = async () => {
        const { data } = await server
            .fetch<ListingsData>({
                query: LISTINGS
            });
        console.log(data); // check the console to see the listings data from our GraphQL Request!
        setListings(data.listings);

    };

    const deleteListing = async (id: string) => {
        const { data } = await server
            .fetch<DeleteListingData, DeleteListingVariables>({
                query: DELETE_LISTING,
                variables: {
                    id // hardcoded id variable,
                }
            });
        console.log(data);
        fetchListings();
        // check the console to see the result of the mutation!
    };

    const listingsList = listings ? (
        <ul>
            {listings.map(listing => {
                return (
                    <li key={listing.id}>
                        {listing.title}
                        <button onClick={() => deleteListing(listing.id)}>Delete</button>
                    </li>
                )
            })}
        </ul>
    ) : null;

    return (
        <div>
            <h2>{title}</h2>
            {listingsList}
            <button onClick={fetchListings}>Query Listings!</button>
        </div>
    );
};
