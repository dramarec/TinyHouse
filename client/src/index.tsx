import { render } from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { Listings } from "./sections";
import reportWebVitals from './reportWebVitals';

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
