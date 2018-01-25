// Import styles

import '../styles/styles.less';

// Import library scripts

import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    NavLink
} from 'react-router-dom';

// Import pages

import Home from './pages/home.jsx';

class App extends React.Component {

    constructor () {
        super();

        this.state = {};
    }

    render () {
        return (
            <div>
              <span className='fa fa-thumbs-o-up fa-lg'></span>
              <NavLink to='/' exact activeClassName='active'>Home</NavLink>
              <NavLink to='/about' activeClassName='active'>About</NavLink>
              <Route path='/' exact component={Home} />
            </div>
        );
    }
}

ReactDOM.render((
    <BrowserRouter>
      <App/>
    </BrowserRouter>
), document.getElementById('page'));
