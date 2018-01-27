import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Home extends React.Component {
    render () {
        return (
            <div id='home-page'>
                <div id='navigation-panel'>
                    <NavLink to='/present' className='control-button'>Present</NavLink>
                    <NavLink to='/control' className='control-button'>Control</NavLink>
                </div>
            </div>
        );
    }
}
