import React from 'react';
import { Redirect } from 'react-router-dom';

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

    reloadLastPresentation () {
        this.setState({
            isPresentationLoaded: true
        });
    }

    toggleAutoTransition () {
        this.setState({
            isAutoTransitionEnabled: !this.state.isAutoTransitionEnabled
        });
    }

    setAnimation (animation) {
        this.setState({
            animation: animation
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
                  <div className='controls-row'>
                    <div className='controls-row-header'>
                      Misc
                    </div>
                    <div className={'control-button ' + (!this.state.isPresentationLoaded ? 'hidden' : '')} onClick={this.backToHome.bind(this)}>
                      End Presentation
                    </div>
                    <div className={'control-button ' + (this.state.isPresentationLoaded ? 'hidden' : '')} onClick={this.backToHome.bind(this)}>
                      Back
                    </div>
                  </div>
                  <div className='controls-row'>
                    <div className='controls-row-header'>
                      Transition
                    </div>
                    <div className={'control-button ' + (this.state.isAutoTransitionEnabled ? 'active' : '')} onClick={this.toggleAutoTransition.bind(this)}>
                      Auto
                    </div>
                  </div>
                  <div className='controls-row'>
                    <div className='controls-row-header'>
                      Animation
                    </div>
                    {
                      ['fade', 'slide-up', 'unfold-down', 'unfold-up', 'zoom', 'flip'].map(animation => {
                        return (
                          <div key={animation} className={'control-button ' + (this.state.animation === animation ? 'active' : '')} onClick={() => this.setAnimation.bind(this)(animation)}>
                            { animation.slice(0, 1).toUpperCase() + animation.slice(1) }
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
              <div id='stage-container' className={this.state.isPresentationLoaded ? 'hidden' : ''}>
                <div id='stage'>
                  <span>Drop a markdown file here to start a presentation</span>
                  <br />
                  <span>OR</span>
                  <br />
                  <div className='control-button' onClick={this.reloadLastPresentation.bind(this)}>
                    Reload the last presentation
                  </div>
                </div>
              </div>
              <div id='presentation-container' className={!this.state.isPresentationLoaded ? 'hidden' : ''}>
                <div id='presentation'>

                </div>
              </div>
            </div>
        );
    }
}
