import React from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Avatar, Button, Menu } from "antd";
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { displaySuccessNotification, displayErrorMessage } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted: data => {
            if (data.logOut) {
                setViewer(data.logOut);
                sessionStorage.removeItem("token");
                displaySuccessNotification("You've successfully logged out!");
            }
        },
        onError: () => {
            displayErrorMessage(
                "Sorry! We weren't able to log you out. Please try again later!"
            );
        }
    });

    const handleLogOut = () => {
        logOut();
    };

    const subMenuLogin =
        viewer.id && viewer.avatar ? (
            <>
                <SubMenu key="sub1" icon={<Avatar src={viewer.avatar} />}>

                    <Menu.Item key="/user">
                        <Link to={`/user/${viewer.id}`}>
                            <HomeOutlined />
                            {' '}
                            Profile
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/logout">
                        <div onClick={handleLogOut}>
                            <LogoutOutlined />
                            {' '}
                            Log out
                        </div>
                    </Menu.Item>

                </SubMenu>
            </>
        ) : (
            <Item>
                <Link to="/login">
                    <Button type="primary">Sign In</Button>
                </Link>
            </Item>
        );

    return (
        <Menu mode="horizontal" selectable={false} className="menu" >

            <Menu.Item key="/host">
                <Link to="/host">
                    <HomeOutlined /> {' '}
                    Host
                </Link>
            </Menu.Item>

            {subMenuLogin}
        </Menu>
    );
};
