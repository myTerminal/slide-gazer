import React from 'react';
import {
    NavLink,
    Redirect
} from 'react-router-dom';

export default class Presentation extends React.Component {

    constructor () {
        super();

        this.state = {
            redirectToHome: false,
            isPresentationLoaded: false,
            presentationData: '',
            isAutoTransitionEnabled: false,
            animation: 'fade'
        };
    }

    backToHome () {
        this.setState({
            redirectToHome: true
        });
    }

    render () {
        if (this.state.redirectToHome) {
            return <Redirect to='/' />;
        }

        return (
            <div id='presentation-page'>
              <div id='top-panel'>
                <div id='top-panel-head'>
                  <span id='top-panel-pulldown-trigger' className='fa fa-angle-double-down'></span>
                  <div id='top-panel-progress-bar'></div>
                </div>
                <div id='top-panel-body'>
                  <div id='presentation-controls'>
                    <div className='controls-button' id='auto-progress' onClick={this.backToHome.bind(this)}>
                      Auto
                    </div>
                    <div className='controls-separator'></div>
                    <div className='controls-button animation-control' data-animation='fade'>
                      Fade
                    </div>
                    <div className='controls-button animation-control' data-animation='slide-up'>
                      Slide-up
                    </div>
                    <div className='controls-button animation-control' data-animation='unfold-down'>
                      Unfold-down
                    </div>
                    <div className='controls-button animation-control' data-animation='unfold-up'>
                      Unfold-up
                    </div>
                    <div className='controls-button animation-control' data-animation='zoom'>
                      Zoom
                    </div>
                    <div className='controls-button animation-control' data-animation='flip'>
                      Flip
                    </div>
                  </div>
                </div>
              </div>
              <div id='stage-container'>
                <div id='stage'>
                  Drop a markdown file here to present or click here to reload the last one
                </div>
              </div>
              <div id='presentation-container'>
                <div id='presentation'>

                </div>
              </div>
            </div>
        );
    }
}
