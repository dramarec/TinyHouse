import { HomeOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Typography } from "antd";
import moment, { Moment } from "moment";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement } from "@stripe/stripe-js";

import {
    displayErrorMessage,
    formatListingPrice,
} from '../../../../lib/utils';

interface Props {
    id: string;
    price: number;
    checkInDate: Moment;
    checkOutDate: Moment;
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
    id,
    price,
    checkInDate,
    checkOutDate,
    modalVisible,
    setModalVisible
}: Props) => {
    const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
    const listingPrice = price * daysBooked;
    const tinyHouseFee = 0.05 * listingPrice;
    const totalPrice = listingPrice + tinyHouseFee;

    const stripe = useStripe();
    const elements = useElements();

    const handleCreateBooking = async () => {
        if (!stripe || !elements) {
            return displayErrorMessage(
                "Sorry! We weren't able to connect with Stripe."
            );
        }
   
        const {  token: stripeToken } = await stripe.createToken(
            elements.getElement(CardElement) as StripeCardElement,
            {}
        );
        console.log(stripeToken);
    };

    return (
        <Modal
            centered
            footer={null}
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
        >
            <div className="listing-booking-modal">
                <div className="listing-booking-modal__intro">
                    <Title className="listing-boooking-modal__intro-title">
                        <HomeOutlined />
                    </Title>
                    <Title level={3} className="listing-boooking-modal__intro-title">
                        Book your trip
                    </Title>
                    <Paragraph>
                        Enter your payment information to book the listing from the dates between{" "}
                        <Text mark strong>
                            {moment(checkInDate).format("MMMM Do YYYY")}
                        </Text>{" "}
                        and{" "}
                        <Text mark strong>
                            {moment(checkOutDate).format("MMMM Do YYYY")}
                        </Text>
                        , inclusive.
                    </Paragraph>
                </div>

                <Divider />

                <div className="listing-booking-modal__charge-summary">
                    <Paragraph>
                        {formatListingPrice(price, false)} * {daysBooked} days ={' '}
                        <Text strong>{formatListingPrice(listingPrice, false)}</Text>
                    </Paragraph>
                    <Paragraph>
                        TinyHouse Fee <sub>~ 5%</sub> ={' '}
                        <Text strong>{formatListingPrice(tinyHouseFee)}</Text>
                    </Paragraph>
                    <Paragraph className="listing-booking-modal__charge-summary-total">
                        Total = <Text mark>{formatListingPrice(totalPrice)}</Text>
                    </Paragraph>
                </div>

                <Divider />

                <div className="listing-booking-modal__stripe-card-section">
                    <CardElement
                        className="listing-booking-modal__stripe-card"
                    />
                    <Button
                        size="large"
                        type="primary"
                        className="listing-booking-modal__cta"
                        onClick={handleCreateBooking}
                    >
                        Book
                    </Button>
                </div>
            </div>
        </Modal>
    )
}