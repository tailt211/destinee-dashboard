import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { setupInterceptor } from './https';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { store } from './store';

setupInterceptor(store);
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

const theme = extendTheme({
    colors: {
        dTeal: {
            500: "#237268",
            600: "#16525A",
        },
        dGreen: {
            500: "#43B794",
            600: "#43B794",
        },
        dDanger: {
            500: '#E44949',
            600: '#842E40',
        },
        dWarn: {
            500: '#927B66',
            600: '#927B66',
        },
        dGray: {
            500: '#4B4B4B',
            600: '#2B2B2B',
        }
        
    },
});

root.render(
    // <React.StrictMode>
    <>
        <ColorModeScript />
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </ChakraProvider>
    </>,
    // </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
