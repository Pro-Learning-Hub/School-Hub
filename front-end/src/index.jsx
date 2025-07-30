import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { store, persistor } from './redux/store';
import Loading from './components/utilityComponents/Loading';

const CLIENT_ID = '967609803723-r2lcuagi67cn9ft4klu6h9mln2ts4t1j.apps.googleusercontent.com'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor} >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  // </React.StrictMode>
);
