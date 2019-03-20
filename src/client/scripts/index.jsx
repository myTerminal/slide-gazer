/* global document */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import localforage from 'localforage';

import store from './store';
import { endPresentation } from './actions/presentation';

import './service-worker-starter.js';

import '../styles/styles.less';

import App from './components/app.jsx';

const configs = require('../../../configs.json'),
    isProductionMode = process.env.NODE_ENV === 'production',
    baseUrl = isProductionMode ? configs.origin : '/';

localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'slide-gazer'
});

render(
    <Provider store={store}>
        <BrowserRouter basename={baseUrl}>
            <App resetPresentation={() => store.dispatch(endPresentation())} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('page')
);

if (module.hot) {
    module.hot.accept();
}
