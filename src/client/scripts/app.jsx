/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route
} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';

import './service-worker-starter.js';

import '../styles/styles.less';

import Home from './components/pages/home.jsx';
import Presentation from './components/pages/presentation.jsx';
import Controller from './components/pages/controller.jsx';

const configs = require('../../../configs.json'),
    isProductionMode = process.env.NODE_ENV === 'production',
    baseUrl = isProductionMode ? configs.origin : '/';

class App extends React.Component {
    render() {
        return (
            <div className="canvas">
                <Route path="/" exact component={Home} />
                <Route path="/present" component={Presentation} />
                <Route path="/control" exact component={Controller} />
                <Route path="/control/:presentationCode" component={Controller} />
            </div>
        );
    }
}

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter basename={baseUrl}>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById('page'));

if (module.hot) {
    module.hot.accept();
}
