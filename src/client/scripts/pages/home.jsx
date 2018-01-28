import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Home extends React.Component {
    render () {
        return (
            <div id='home-page'>
                <div id='navigation-panel'>
                    <h1>Slide Gazer</h1>
                    <h2>A light-weight presentation tool for presenting your ideas quickly and with style!</h2>
                    <span>Select 'Present' to present a slide-show or 'Control' to control one that is running.</span>
                    <br />
                    <br />
                    <NavLink to='/present' className='control-button'>Present</NavLink>
                    <NavLink to='/control' className='control-button'>Control</NavLink>
                    <br />
                    <br />
                    <span>Source:</span> <a href='https://github.com/team-fluxion/slide-gazer' className='fa fa-github fa-lg' target='_blank'></a>
                </div>
            </div>
        );
    }
}
