import React from "react";
import { server } from "../../api";
import {
    DeleteListingData,
    DeleteListingVariables,
    ListingsData
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
    const fetchListings = async () => {
        const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
        console.log(data); // check the console to see the listings data from our GraphQL Request!
    };

    const deleteListing = async () => {
        const { data } = await server
            .fetch<DeleteListingData, DeleteListingVariables>({
                query: DELETE_LISTING,
                variables: {
                    id: "607a5a5377e71852e274623d" // hardcoded id variable,
                }
            });
        console.log(data); // check the console to see the result of the mutation!
    };

    return (
        <div>
            <h2>{title}</h2>
            <button onClick={fetchListings}>Query Listings!</button>
            <button onClick={deleteListing}>Delete a listing!</button>
        </div>
    );
};
