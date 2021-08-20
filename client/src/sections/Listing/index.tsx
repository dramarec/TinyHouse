import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";
import { Moment } from "moment";

import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries";
import {
    Listing as ListingData,
    ListingVariables
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { ListingCreateBooking, ListingBookings, ListingDetails } from "./components";
import { Viewer } from "../../lib/types";

interface MatchParams {
    id: string;
}

interface Props {
    viewer: Viewer;
}

const { Content } = Layout;

const PAGE_LIMIT = 3;

export const Listing = ({ viewer, match }: Props & RouteComponentProps<MatchParams>) => {
    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

    const { loading, data, error } = useQuery<ListingData, ListingVariables>(LISTING, {
        variables: {
            id: match.params.id,
            bookingsPage,
            limit: PAGE_LIMIT
        }
    });

    if (loading) {
        return (
            <Content className="listings">
                <PageSkeleton />
            </Content>
        );
    }

    if (error) {
        return (
            <Content className="listing">
                <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon." />
                <PageSkeleton />
            </Content>
        );
    }

    const listing = data?.listing;
    const listingBookings = listing?.bookings;

    const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;

    const listingBookingsElement = listingBookings ? (
        <ListingBookings
            listingBookings={listingBookings}
            bookingsPage={bookingsPage}
            limit={PAGE_LIMIT}
            setBookingsPage={setBookingsPage}
        />
    ) : null;

    const ListingCreateBookingElement = listing ? (
        <ListingCreateBooking
            viewer={viewer}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            host={listing.host}
            price={listing.price}
            bookingsIndex={listing.bookingsIndex}
        />
    ) : null

    return (
        <Content className="listings">
            <Row gutter={24} justify="space-around" >
                <Col xs={24} lg={14}>
                    {listingDetailsElement}
                    {listingBookingsElement}
                </Col>
                <Col xs={24} lg={10}>
                    {ListingCreateBookingElement}
                </Col>
            </Row>
        </Content >
    )
};