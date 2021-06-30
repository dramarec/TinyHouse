import { render } from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { Listings } from "./sections";
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
    connectToDevTools: true,
    uri: "/api",
    cache,
});

render(
    <ApolloProvider client={client}>
        <Listings title="TinyHouse Listings" />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
