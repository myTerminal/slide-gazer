import React from 'react';
import { Redirect } from 'react-router-dom';
import { FilePicker } from 'react-file-picker';
import axios from 'axios';
import showdown from 'showdown';
import qrcode from 'qrcode';
import socketService from '../services/presentation-socket-service.js';

const converter = new showdown.Converter();

export default class Presentation extends React.Component {

    constructor () {
        super();

        this.state = {
            configs: {
                domain: 'slide-gazer.teamfluxion.com'
            },
            redirectToHome: false,
            previousPresentationDataExists: window.localStorage.lastPresentationDOM,
            isPresentationLoaded: false,
            presentationData: '',
            presentationCode: '',
            controllerUrlQRCodeData: '',
            slideCount: 0,
            currentSlideIndex: 0,
            presentationProgress: 0,
            isControllerConnected: false,
            isAutoTransitionEnabled: false,
            animation: 'slide-up'
        };

        this.autoTransitionTimer = null;
    }

    componentDidMount () {
        var context = this,
            stage = document.getElementById('stage');

        stage.ondragover = this.onDragOverOnStage;
        stage.ondrop = this.onDropOnStage.bind(this);
        stage.ondragend = this.onDragEndOnStage;

        document.onkeydown = this.onKeyDownOnPresentation.bind(this);

        axios.get('/configs').then(response => {
            context.setState({
                configs: response.data
            });
        }).catch(() => {
            alert('Failed to fetch domain details.');
        });
    }

    onDragOverOnStage () {
        return false;
    }

    onDropOnStage (e) {
        e.preventDefault();

        this.loadFile(e.dataTransfer.files[0]);

        return false;
    }

    onDragEndOnStage () {
        return false;
    }

    onFilePick (file) {
        this.loadFile(file);
    }

    loadFile (file) {
        var context = this,
            reader = new FileReader();

        reader.onload = function(event) {
            var lastPresentationDOM = converter.makeHtml(event.target.result);

            window.localStorage.lastPresentationDOM = lastPresentationDOM;

            context.startPresentation(lastPresentationDOM);
        };

        reader.readAsText(file);
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

        if (slideIndex) {
            socketService.sendSignal('SLIDE-SHOW', slideIndex)
        }
    }

    autoTransitToNextSlide () {
        this.nextSlide();
    }

    backToHome () {
        this.setState({
            redirectToHome: true
        });
    }

    endPresentation () {
        this.setState({
            isPresentationLoaded: false,
            presentationData: '',
            presentattionCode: '',
            controllerUrlQRCodeData: '',
            slideCount: 0,
            currentSlideIndex: 0,
            presentationProgress: 0,
            isAutoTransitionEnabled: false
        });

        socketService.close();
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
            presentationCode = (new Date()).getTime(),
            title;

        presentation.innerHTML = this.getSlidesDOM(presentationData);

        title = presentation.querySelector('h1').innerText;

        presentation.innerHTML += this.getLastSlide(title);
        presentation.innerHTML += this.getFooter();

        this.setState({
            isPresentationLoaded: true,
            presentationData: presentationData,
            presentationCode: presentationCode,
            slideCount: document.querySelectorAll('#presentation .slide').length
        });

        this.showSlide(0);

        qrcode.toDataURL('http://' + this.state.configs.domain + '/control/' + presentationCode).then(url => {
            this.setState({
                controllerUrlQRCodeData: url
            });
        });

        socketService.open(
            this.state.configs,
            presentationCode,
            presentationData,
            this.onInfo.bind(this),
            this.onCommand.bind(this),
            this.onException.bind(this)
        );
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
               "  Printed from <a href='" + 'http://' + this.state.configs.domain + "'>slide-gazer</a>" +
               "</div>";
    }

    onInfo (info) {
        if (info === 'CONNECTION') {
            this.setState({
                isControllerConnected: true
            });

            socketService.sendSignal('SLIDE-SHOW', this.state.currentSlideIndex);
        } else if (info === 'DISCONNECTION') {
            this.setState({
                isControllerConnected: false
            });
        }
    }

    onCommand (command, param) {
        if (command === 'SLIDE-SHOW') {
            this.showSlide(+param);
        }
    }

    onException (exception) {
        console.error(exception);
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
                        <span id='controller-connection-icon' className={'fa fa-chain' + (!this.state.isControllerConnected ? ' hidden' : '')} title='A controller is connected'></span>
                    </div>
                    <div id='top-panel-body'>
                        <div className={'controls-row' + (!this.state.isPresentationLoaded ? ' hidden' : '')}>
                            <div className='controls-row-header'>
                                Remotely control this presentation at this URL
                            </div>
                            <div id='qr-code-image' style={{backgroundImage:'url(' + this.state.controllerUrlQRCodeData + ')'}}>
                            </div>
                            <a id='controller-url-link' href={'http://' + this.state.configs.domain + '/control/' + this.state.presentationCode} target='_blank'>
                                {'http://' + this.state.configs.domain + '/control/' + this.state.presentationCode}
                            </a>
                        </div>
                        <div className='controls-row'>
                            <div className='controls-row-header'>
                                Presentation
                            </div>
                            <div className={'control-button' + (!this.state.isPresentationLoaded ? ' hidden' : '')} onClick={this.endPresentation.bind(this)}>
                                End
                            </div>
                            <div className={'control-button' + (this.state.isPresentationLoaded ? ' hidden' : '')} onClick={this.backToHome.bind(this)}>
                                Back
                            </div>
                            <div className={'control-button' + (!this.state.isPresentationLoaded ? ' hidden' : '') + (this.state.isAutoTransitionEnabled ? ' active' : '')} onClick={this.toggleAutoTransition.bind(this)}>
                                Auto-Transition
                            </div>
                        </div>
                        <div className={'controls-row' + (!this.state.isPresentationLoaded ? ' hidden' : '')}>
                            <div className='controls-row-header'>
                                Animation
                            </div>
                            {
                                ['fade', 'slide-up', 'unfold-down', 'unfold-up', 'zoom', 'flip'].map(animation => {
                                    return (
                                        <div key={animation} className={'control-button' + (this.state.animation === animation ? ' active' : '')} onClick={() => this.setAnimation.bind(this)(animation)}>
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
                        <h2 className='regular-text'>
                            To start a presentation, do one of the following:
                        </h2>
                        <br />
                        <FilePicker
                            extensions={['md']}
                            onChange={file => this.onFilePick(file)}
                            onError={err => alert(err)}>
                            <div className='control-button'>
                                Pick a markdown file
                            </div>
                        </FilePicker>
                        <br />
                        <span className='regular-text'>
                            OR
                        </span>
                        <br />
                        <br />
                        <span className='regular-text'>
                            Drop a markdown file on this page
                        </span>
                        <br />
                        <br />
                        <span className='regular-text'>
                            OR
                        </span>
                        <br />
                        <br />
                        <div className={'control-button' + (!this.state.previousPresentationDataExists ? ' disabled' : '')} onClick={this.reloadLastPresentation.bind(this)}>
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
