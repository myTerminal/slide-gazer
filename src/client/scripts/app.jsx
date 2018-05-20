/* global document */

// Import library scripts

import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route
} from 'react-router-dom';

// Start service worker
import './service-worker-starter.js';

// Import styles

import '../styles/styles.less';

// Import pages

import Home from './pages/home.jsx';
import Presentation from './pages/presentation.jsx';
import Controller from './pages/controller.jsx';

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
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('page'));
