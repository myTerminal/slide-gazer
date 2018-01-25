import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Presentation extends React.Component {
    render () {
        return (
            <div>
                <NavLink to='/' activeClassName='active'>Back to Home</NavLink>
                <div>This is Presentation</div>
            </div>
        );
    }
}
