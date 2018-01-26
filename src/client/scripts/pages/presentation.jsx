import React from 'react';
import { Redirect } from 'react-router-dom';
import showdown from 'showdown';

const converter = new showdown.Converter();

export default class Presentation extends React.Component {

    constructor () {
        super();

        this.state = {
            redirectToHome: false,
            previousPresentationDataExists: window.localStorage.lastPresentationDOM,
            isPresentationLoaded: false,
            presentationData: '',
            isAutoTransitionEnabled: false,
            animation: 'fade'
        };
    }

    componentDidMount () {
        var stage = document.getElementById('stage');

        stage.ondragover = this.onDragOverOnStage;
        stage.ondrop = this.onDropOnStage.bind(this);
        stage.ondragend = this.onDragEndOnStage;
    }

    onDragOverOnStage () {
        return false;
    }

    onDropOnStage (e) {
        e.preventDefault();

        var context = this,
            file = e.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function(event) {
            var lastPresentationDOM = converter.makeHtml(event.target.result);

            window.localStorage.lastPresentationDOM = lastPresentationDOM;

            context.startPresentation(lastPresentationDOM);
        };

        reader.readAsText(file);
        return false;
    }

    onDragEndOnStage () {
        return false;
    }

    backToHome () {
        this.setState({
            redirectToHome: true
        });
    }

    startPresentation (presentationData) {
        var presentation = document.getElementById('presentation'),
            title;

        this.setState({
            isPresentationLoaded: true,
            presentationData: presentationData
        });

        presentation.innerHTML = this.getSlidesDOM(presentationData);

        title = presentation.querySelector('h1').innerText;

        presentation.innerHTML += this.getLastSlide(title);
        presentation.innerHTML += this.getFooter();
    }

    reloadLastPresentation () {
        var lastPresentationDOM = window.localStorage.lastPresentationDOM;

        if (lastPresentationDOM) {
          this.startPresentation(lastPresentationDOM);
        }
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

    getSlidesDOM (presentationData) {
        return "<div class='slide visible'>" +
                presentationData.replace(/\<h2/g,
                                 "</div><div class='slide'><h2") +
                "</div>";
    }

    getLastSlide (title) {
        return "<div class='slide last-slide'>" +
               "  <h1>" + title + "</h1>" +
               "  Thanks for attending the session. Questions please..." +
               "</div>";
    }

    getFooter () {
        return "<div class='footer'>" +
               "  Printed from <a href='http://slide-gazer.teamfluxion.com'>slide-gazer</a>" +
               "</div>"
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
                  <div className={'control-button ' + (!this.state.previousPresentationDataExists ? 'disabled' : '')} onClick={this.reloadLastPresentation.bind(this)}>
                    Reload the last presentation
                  </div>
                </div>
              </div>
              <div id='presentation-container' className={!this.state.isPresentationLoaded ? 'hidden' : ''}>
                <div id='presentation' className='markdown-body'>

                </div>
              </div>
            </div>
        );
    }
}
