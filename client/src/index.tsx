import React, { useState } from "react";
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Layout } from 'antd'

import { Viewer } from "./lib/types";
import { Home, Host, Listing, Listings, Login, NotFound, User } from "./sections";
import reportWebVitals from './reportWebVitals';
import "./styles/index.css";

const client = new ApolloClient({
    // connectToDevTools: true,
    uri: "/api",
    cache: new InMemoryCache()
});

const initialViewer: Viewer = {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false
};

const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);
    console.log("🔥🚀 ===> App ===> viewer", viewer);
    console.log(viewer); // check the console to see viewer details after logging in

    return (
        <Router>
            <Layout id='app'>

                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/host" component={Host} />
                    <Route exact path="/listing/:id" component={Listing} />
                    <Route exact path="/listings/:location?" component={Listings} />
                    <Route
                        exact
                        path="/login"
                        render={props => <Login {...props} setViewer={setViewer} />}
                    />
                    <Route exact path="/user/:id" component={User} />
                    <Route component={NotFound} />

                </Switch>

            </Layout>
        </Router>
    );
};

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);


reportWebVitals();

// https://www.apollographql.com/docs/react/networking/basic-http-networking/#including-credentials-in-requests