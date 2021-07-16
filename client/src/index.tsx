import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { Home, Host, Listing, Listings, NotFound, User } from "./sections";
import reportWebVitals from './reportWebVitals';
import "./styles/index.css";

const client = new ApolloClient({
    // connectToDevTools: true,
    uri: "/api",
    cache: new InMemoryCache()
});

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/host" component={Host} />
                <Route exact path="/listing/:id" component={Listing} />
                <Route exact path="/listings/:location?" component={Listings} />
                <Route exact path="/user/:id" component={User} />
                <Route component={NotFound} />
            </Switch>
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