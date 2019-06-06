import React from 'react';
import { NavLink } from 'react-router-dom';

import packageDetails from '../../../../../package.json';

export default class Home extends React.Component {
    render() {
        return (
            <div id="home-page">
                <div id="center-panel">
                    <h1 className="regular-text">
                        Slide Gazer
                    </h1>
                    <div className="regular-text">
                        v
                        {packageDetails.version}
                    </div>
                    <h2 className="regular-text">
                        A light-weight presentation tool for presenting your
                        ideas quickly and with style!
                    </h2>
                    <span className="regular-text">
                        Select 'Present' to present a slide-show or 'Control' to
                        control one that is running.
                    </span>
                    <br />
                    <br />
                    <NavLink to="/present" className="control-button">
                        Present
                    </NavLink>
                    <NavLink to="/control" className="control-button">
                        Control
                    </NavLink>
                    <br />
                    <br />
                    <span className="regular-text" id="pwa-install" style={{ display: 'none' }}>
                        Click&nbsp;
                        <span className="emphasized">here</span>
                        &nbsp;to install as an app.
                    </span>
                    <br />
                    <br />
                    <span className="regular-text">Source:</span>
                    <a href="https://github.com/team-fluxion/slide-gazer"
                        className="regular-text fa fa-github fa-lg"
                        target="_blank">
                        &nbsp;
                    </a>
                </div>
            </div>
        );
    }
}
