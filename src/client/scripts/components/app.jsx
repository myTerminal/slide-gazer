import React from 'react';
import { withRouter, Route } from 'react-router-dom';

import Home from './pages/home.jsx';
import Presentation from './pages/presentation.jsx';
import Controller from './pages/controller.jsx';

class App extends React.Component {
    componentDidMount() {
        this.props.history.listen(location => {
            if (location.pathname === '/') {
                this.props.resetPresentation();
            }
        });
    }

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

export default withRouter(App);
