import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Home extends React.Component {
    render () {
        return (
            <div>
                <NavLink to='/present' activeClassName='active'>Present</NavLink>
                <NavLink to='/control' activeClassName='active'>Control</NavLink>
                <div>This is Home</div>
            </div>
        );
    }
}
