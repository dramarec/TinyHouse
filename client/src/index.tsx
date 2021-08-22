import { useState, useEffect, useRef } from "react";
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HttpLink, ApolloClient, ApolloProvider, InMemoryCache, useMutation } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Affix, Spin, Layout } from 'antd'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { LOG_IN } from "./lib/graphql/mutations";
import {
    LogIn as LogInData,
    LogInVariables
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";
import {
    AppHeader, Home, Host, Listing, Listings, Login, NotFound, User,
    Stripe,
} from "./sections";
import reportWebVitals from './reportWebVitals';
import "./styles/index.css";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";

const httpLink = new HttpLink({
    uri: "/api"
});

const authLink = setContext(async (_, { headers }) => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            ...headers,
            "X-CSRF-TOKEN": token || ""
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
    // console.log("🔥🚀 ===> App ===> viewer", viewer);

    const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: data => {
            if (data?.logIn) {
                setViewer(data.logIn);
            }

            if (data.logIn.token) {
                sessionStorage.setItem("token", data.logIn.token);
            } else {
                sessionStorage.removeItem("token");
            }
        }
    });

    const logInRef = useRef(logIn);

    useEffect(() => {
        logInRef.current();
    }, []);

    if (!viewer.didRequest && !error) {
        return (
            <Layout className="app-skeleton">
                <AppHeaderSkeleton />
                <div className="app-skeleton__spin-section">
                    <Spin size="large" tip="Launching Tinyhouse" />
                </div>
            </Layout>
        );
    }

    const logInErrorBannerElement = error ? (
        <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
    ) : null;

    const stripePromise = loadStripe(process.env.REACT_APP_S_PUBLISHABLE_KEY as string)

    return (
        <Elements stripe={stripePromise}>
            <Router>
                <Layout id='app'>
                    {logInErrorBannerElement}

                    <Affix offsetTop={0} className="app__affix-header">
                        <AppHeader viewer={viewer} setViewer={setViewer} />
                    </Affix>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route
                            exact
                            path="/host"
                            render={props => <Host {...props} viewer={viewer} />}
                        />
                        <Route
                            exact
                            path="/listing/:id"
                            render={props => <Listing {...props} viewer={viewer} />}
                        />
                        <Route exact path="/listings/:location?" component={Listings} />
                        <Route
                            exact
                            path="/login"
                            render={props => <Login {...props} setViewer={setViewer} />}
                        />
                        <Route
                            exact
                            path="/user/:id"
                            render={props => <User {...props} viewer={viewer} setViewer={setViewer} />}
                        />
                        <Route
                            exact
                            path="/stripe"
                            render={props => <Stripe {...props} viewer={viewer} setViewer={setViewer} />}
                        />
                        <Route component={NotFound} />

                    </Switch>

                </Layout>
            </Router>
        </Elements>
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