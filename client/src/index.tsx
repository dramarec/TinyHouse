import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { Home, Host, Listing, Listings, NotFound, User } from "./sections";
import reportWebVitals from './reportWebVitals';
import "./styles/index.css";

const cache = new InMemoryCache({
    // typePolicies: {
    //     Listings: {
    //         fields: {
    //             listings: {
    //                 merge(existing = [], incoming: any[]) {
    //                     return [...existing, ...incoming];
    //                 },
    //             }
    //         }
    //     }
    // }
    // typePolicies: {
    //     Query: {
    //         fields: {
    //             Listings: {
    //                 merge(existing = [], incoming: any) {
    //                     return { ...existing, ...incoming };
    //                     // this part of code is depends what you actually need to do, in my 
    //                     // case i had to save my incoming data as single object in cache
    //                 }
    //             }
    //         }
    //     }
    // }
    // typePolicies: {
    //     Query: {
    //         Part: {
    //             parts: {
    //                 fields: {
    //                     merge(existing, incoming) {
    //                         return incoming;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
})

const client = new ApolloClient({
    // connectToDevTools: true,
    uri: "/api",
    cache,
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
