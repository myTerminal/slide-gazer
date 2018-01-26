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
            slideCount: 0,
            currentSlideIndex: 0,
            presentationProgress: 0,
            isAutoTransitionEnabled: false,
            animation: 'fade'
        };

        this.autoTransitionTimer = null;
    }

    componentDidMount () {
        var stage = document.getElementById('stage');

        stage.ondragover = this.onDragOverOnStage;
        stage.ondrop = this.onDropOnStage.bind(this);
        stage.ondragend = this.onDragEndOnStage;

        document.onkeydown = this.onKeyDownOnPresentation.bind(this);
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

    onKeyDownOnPresentation (e) {
        if (this.state.isPresentationLoaded) {
            if (e.keyCode === 39) {
                this.nextSlide();
            } else if (e.keyCode === 37) {
                this.previousSlide();
            }
        }
    }

    previousSlide () {
        if (!this.state.currentSlideIndex) {
            return;
        }

        this.showSlide(this.state.currentSlideIndex - 1);
    }

    nextSlide () {
        if (this.state.currentSlideIndex + 1 === this.state.slideCount) {
            return;
        }

        this.showSlide(this.state.currentSlideIndex + 1);
    }

    showSlide (slideIndex) {
        var slides = document.querySelectorAll('#presentation .slide');

        this.setState({
            currentSlideIndex: slideIndex,
            presentationProgress: (slideIndex + 1) * 100 / this.state.slideCount
        });

        slides.forEach(s => s.className = s.className.replace(' visible', ''));
        slides[slideIndex].className += ' visible';
    }

    autoTransitToNextSlide () {
        this.nextSlide();
    }

    backToHome () {
        this.setState({
            redirectToHome: true
        });
    }

    toggleAutoTransition () {
        if (this.state.isAutoTransitionEnabled) {
            window.clearInterval(this.autoTransitionTimer);
            this.autoTransitionTimer = null;
        } else {
            this.autoTransitionTimer = window.setInterval(this.autoTransitToNextSlide.bind(this), 5000);
        }

        this.setState({
            isAutoTransitionEnabled: !this.state.isAutoTransitionEnabled
        });
    }

    setAnimation (animation) {
        this.setState({
            animation: animation
        });
    }

    startPresentation (presentationData) {
        var presentation = document.getElementById('presentation'),
            title;

        presentation.innerHTML = this.getSlidesDOM(presentationData);

        title = presentation.querySelector('h1').innerText;

        presentation.innerHTML += this.getLastSlide(title);
        presentation.innerHTML += this.getFooter();

        this.setState({
            isPresentationLoaded: true,
            presentationData: presentationData,
            slideCount: document.querySelectorAll('#presentation .slide').length,
        });

        this.showSlide(0);
    }

    reloadLastPresentation () {
        var lastPresentationDOM = window.localStorage.lastPresentationDOM;

        if (lastPresentationDOM) {
          this.startPresentation(lastPresentationDOM);
        }
    }

    getSlidesDOM (presentationData) {
        return "<div class='slide'>" +
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
                  <div id='top-panel-progress-bar' style={{width:this.state.presentationProgress + '%'}}></div>
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
                <div id='presentation' className={'markdown-body ' + this.state.animation}>
                </div>
              </div>
            </div>
        );
    }
}
