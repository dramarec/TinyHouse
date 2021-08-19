import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import {
    BankOutlined,
    HomeOutlined,
    LoadingOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    Button,
    Form, Input, InputNumber, Layout, Radio, Typography, Upload
} from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { Viewer } from "../../lib/types";
import { ListingType } from "../../lib/graphql/globalTypes";
import { iconColor, displayErrorMessage, displaySuccessNotification } from "../../lib/utils";
import { HOST_LISTING } from "../../lib/graphql/mutations";
import {
    HostListing as HostListingData,
    HostListingVariables
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";
interface Props {
    viewer: Viewer;
}

// const { Item } = Form;
const { Content } = Layout;
const { Text, Title } = Typography;

export const Host = ({ viewer }: Props) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

    const [form] = Form.useForm();

    const [hostListing, { loading, data }] = useMutation<
        HostListingData,
        HostListingVariables
    >(HOST_LISTING, {
        onCompleted: () => {
            displaySuccessNotification("You've successfully created your listing!");
        },
        onError: () => {
            displayErrorMessage(
                "Sorry! We weren't able to create your listing. Please try again later"
            );
        },
    });

    const handleImageUpload = (info: UploadChangeParam) => {
        const { file } = info;

        if (file.status === "uploading") {
            setImageLoading(true);
            return;
        }

        if (file.status === "error") {
            displayErrorMessage(
                "Sorry! We weren't upload your image. Please try again later"
            );
            setImageLoading(false);
            return;
        }

        if (file.status === "done" && file.originFileObj) {
            getBase64Value(file.originFileObj, imageBase64Value => {
                setImageBase64Value(imageBase64Value);
                setImageLoading(false);
            });
        }
    };

    const validateMessages = {
        required: 'Please complete all required form fields!',
    };

    const handleHostListing = (values: any) => {
        const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;

        const input = {
            ...values,
            address: fullAddress,
            image: imageBase64Value,
            price: values.price * 100,
        };

        delete input.city;
        delete input.state;
        delete input.postalCode;

        hostListing({
            variables: {
                input,
            },
        });
    };

    if (!viewer.id || !viewer.hasWallet) {
        return (
            <Content className="host-content">
                <div className="host__form-header">
                    <Title level={4} className="host__form-title">
                        You'll have to be signed in and connected with Stripe to host a listing!
                    </Title>
                    <Text type="secondary">
                        We only allow users who've signed in to our application and have connected
                        with Stripe to host new listings. You can sign in at the{" "}
                        <Link to="/login">/login</Link> page and connect with Stripe shortly after.
                    </Text>
                </div>
            </Content>
        );
    }

    if (loading) {
        return (
            <Content className="host-content">
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Please wait!
                    </Title>
                    <Text type="secondary">We're creating your listing now.</Text>
                </div>
            </Content>
        );
    }

    if (data && data.hostListing) {
        return <Redirect to={`/listing/${data.hostListing.id}`} />;
    }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <Content className="host-content">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleHostListing}
                validateMessages={validateMessages}
            >
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Hi! Let's get started listing your place.
                    </Title>
                    <Text type="secondary">
                        In this form, we'll collect some basic and additional information
                        about your listing.
                    </Text>
                </div>

                <Form.Item
                    label="Home Type"
                    name="type"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a home type!',
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio.Button value={ListingType.APARTMENT}>
                            <BankOutlined style={{ color: iconColor }} />
                            {' '}
                            <span>Apartment</span>
                        </Radio.Button>
                        <Radio.Button value={ListingType.HOUSE}>
                            <HomeOutlined style={{ color: iconColor }} />
                            {' '}
                            <span>House</span>
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Max # of Guests"
                    name="numOfGuests"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a max number of guests!',
                        },
                    ]}
                >
                    <InputNumber min={1} placeholder="4" />
                </Form.Item>

                <Form.Item
                    label="Title"
                    name="title"
                    extra="Max character count of 45"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a title for your listing!',
                        },
                    ]}
                >
                    <Input
                        maxLength={45}
                        placeholder="The iconic and luxurious Bel-Air mansion"
                    />
                </Form.Item>

                <Form.Item
                    label="Description of listing"
                    name="description"
                    extra="Max character count of 400"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a description for your listing!',
                        },
                    ]}
                >
                    <Input.TextArea
                        rows={3}
                        maxLength={400}
                        placeholder="Moder, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles"
                    />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a address for your listing!',
                        },
                    ]}
                >
                    <Input placeholder="251 North Briston Avenue" />
                </Form.Item>

                <Form.Item
                    label="City/Town"
                    name="city"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a city (or region) for your listing!',
                        },
                    ]}
                >
                    <Input placeholder="Los Angeles" />
                </Form.Item>

                <Form.Item
                    label="State/Province"
                    name="state"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a state (or province) for your listing!',
                        },
                    ]}
                >
                    <Input placeholder="California" />
                </Form.Item>

                <Form.Item
                    label="Zip/Postal Code"
                    name="postalCode"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a zip (or postal) code for your listing!',
                        },
                    ]}
                >
                    <Input placeholder="Please enter a zip code for your listing!" />
                </Form.Item>

                <Form.Item
                    label="Image"
                    name="image"
                    extra="Images have to be under 1MB in size and of type JPG or PNG"
                    rules={[
                        {
                            required: true,
                            message: 'Please provide an image for your listing!',
                        },
                    ]}
                >
                    <div className="host__form-image-upload">
                        <Upload
                            accept="image/*"
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            customRequest={dummyRequest}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeImageUpload}
                            onChange={handleImageUpload}
                        >
                            {imageBase64Value ? (
                                <img src={imageBase64Value} alt="Listing" />
                            ) : (
                                <div>
                                    {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div className="ant-upload-text">Upload</div>
                                </div>
                            )}
                        </Upload>
                    </div>
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    extra="All prices in $USD/day"
                    rules={[
                        {
                            required: true,
                            message: 'Please provide an image for your listing!',
                        },
                    ]}
                >
                    <InputNumber min={0} placeholder="120" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        </Content >
    );
};

const beforeImageUpload = (file: File) => {
    const fileIsValidImage = file.type === "image/jpeg" || file.type === "image/png";
    const fileIsValidSize = file.size / 1024 / 1024 < 1;

    if (!fileIsValidImage) {
        displayErrorMessage("You're only able to upload valid JPG or PNG files!");
        return false;
    }

    if (!fileIsValidSize) {
        displayErrorMessage(
            "You're only able to upload valid image files of under 1MB in size!"
        );
        return false;
    }

    return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
    img: File | Blob,
    callback: (imageBase64Value: string) => void
) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
        callback(reader.result as string);
    };
};


//////////////////////////////////////

    // const uploadImage = async (options: any) => {
    //     const { onSuccess, onError, file, onProgress } = options;

    //     const fmData = new FormData();
    //     const config = {
    //         headers: {
    //             // "content-type": "multipart/form-data",
    //             // "Access-Control-Allow-Origin": "*",
    //             // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",

    //             // 'Access-Control-Allow-Origin': '你的项目地址，用*将会带来安全问题',
    //             'Access-Control-Allow-Origin': '*',
    //             // 'Access-Control-Allow-Headers': '*',
    //             // 'Access-Control-Allow-Methods': '*',
    //             // 'Content-Type': 'application/json;charset=utf-8',
    //         },
    //         // onUploadProgress: event => {
    //         //     const percent = Math.floor((event.loaded / event.total) * 100);
    //         //     setProgress(percent);
    //         //     if (percent === 100) {
    //         //         setTimeout(() => setProgress(0), 1000);
    //         //     }
    //         //     onProgress({ percent: (event.loaded / event.total) * 100 });
    //         // }
    //     };
    //     fmData.append("image", file);
    //     try {
    //         const res = await axios.post(
    //             "https://jsonplaceholder.typicode.com/posts",
    //             // "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    //             fmData,
    //             config
    //         );

    //         onSuccess("Ok");
    //         console.log("server res: ", res);
    //     } catch (err) {
    //         console.log("Eroor: ", err);
    //         const error = new Error("Some error");
    //         console.log("🔥🚀 ===> uploadImage ===> error", error);
    //         onError({ err });
    //     }
    // };
    // @ts-nocheck
    // !https://github.com/ant-design/ant-design/issues/11616
    // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it/51519603#51519603
    // https://dejanvasic.wordpress.com/2020/09/10/ant-design-upload-to-s3-bucket-and-graphql/
    // https://stackoverflow.com/questions/58128062/using-customrequest-in-ant-design-file-upload