import { gql, useQuery, useMutation } from '@apollo/client'
import { Alert, Avatar, Button, List, Spin } from "antd";

import { Listings as ListingsData } from "./__generated__/Listings";
import { DeleteListing as DeleteListingData, DeleteListingVariables } from "./__generated__/DeleteListing";
import { ListingsSkeleton } from "./components";
import "./styles/Listings.css";

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
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
    const { data, loading, error, refetch } =
        useQuery<ListingsData>(LISTINGS);

    const [deleteListing, { loading: deleteListingLoading, error: deleteListingError }] =
        useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

    const handleDeleteListing = async (id: string) => {
        await deleteListing({ variables: { id } });
        refetch();
    };

    const listings = data ? data.listings : null;

    const listingsList = listings ? (
        <List
            itemLayout="horizontal"
            dataSource={listings}
            renderItem={listing => (
                <List.Item
                    actions={[
                        <Button
                            type="primary"
                            onClick={() => handleDeleteListing(listing.id)}
                        >
                            Delete
                        </Button>
                    ]}
                >
                    <List.Item.Meta
                        title={listing.title}
                        description={listing.address}
                        avatar={
                            <Avatar src={listing.image} shape="square" size={48} />
                        }
                    />
                </List.Item>
            )}
        />
    ) : null;

    // const listingsList = listings ? (
    //     <ul>
    //         {listings.map(listing => {
    //             return (
    //                 <li key={listing.id}>
    //                     {listing.title}
    //                     <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
    //                 </li>
    //             )
    //         })}
    //     </ul>
    // ) : null;

    // if (!loading) {
    //     return <h2>Loading....</h2>
    // }

    if (loading) {
        return (
            <div className="listings">
                <ListingsSkeleton title={title} />
            </div>
        );
    }
    // if (error) {
    //     return <h2>Uh oh! Something went wrong - please try again later! </h2>;
    // }
    if (error) {
        return (
            <div className="listings">
                <ListingsSkeleton title={title} error />
            </div>
        );
    }

    // const deleteListingLoadingMessage = deleteListingLoading ? (
    //     <h4>
    //         Deletion in progress...
    //     </h4>
    // ) : null;

    // const deleteListingErrorMessage = deleteListingError ? (
    //     <h4>
    //         Uh oh! Something went wrong with deleting. Please try again soon.
    //     </h4>
    // ) : null;

    const deleteListingErrorAlert = deleteListingError ? (
        <Alert
            type="error"
            message="Uh oh! Something went wrong :(. Please try again later."
            className="listings__alert"
        />
    ) : null;

    return (
        <div className="listings">
            {deleteListingErrorAlert}
            <Spin spinning={deleteListingLoading}>
                <h2>{title}</h2>
                {listingsList}
            </Spin>
        </div>
        // <div className='listings'>
        //     <h2>{title}</h2>
        //     {listingsList}
        //     {deleteListingLoadingMessage}
        //     {deleteListingErrorMessage}
        // </div>
    );
};
