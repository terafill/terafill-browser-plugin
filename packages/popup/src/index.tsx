import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';

import App from './App';
import './global.css';

const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);

    // Create a client
    const queryClient = new QueryClient();
    
    root.render(
        <QueryClientProvider client={queryClient}>
            <App />
            {/*    <React.StrictMode>
        </React.StrictMode>*/}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>,
    );
} else {
    console.error("Couldn't find the root element.");
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
