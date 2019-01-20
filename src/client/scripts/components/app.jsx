import React from 'react';
import { Route } from 'react-router-dom';

import Home from './pages/home.jsx';
import Presentation from './pages/presentation.jsx';
import Controller from './pages/controller.jsx';

export default class App extends React.Component {
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
