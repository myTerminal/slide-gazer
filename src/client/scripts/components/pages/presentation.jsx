/* global window document FileReader Blob */

import React from 'react';
import { connect } from 'react-redux';
import { FilePicker } from 'react-file-picker';
import showdown from 'showdown';
import localforage from 'localforage';
import FileSaver from 'file-saver';
import Hammer from 'hammerjs';

import { fetchSampleMarkdownFile, timers } from '../../common';
import getDomain from '../../actions/configs';
import presentationActions from '../../actions/presentation';

import socketService from '../../services/presentation-socket-service.js';

const converter = new showdown.Converter();

class Presentation extends React.Component {
    constructor(props) {
        super(props);

        props.updatePreviousPresentationInfo();

        this.touchGestures = new Hammer(document.body);
        this.touchGestures.get('swipe').set({
            direction: Hammer.DIRECTION_HORIZONTAL
        });
    }

    componentDidMount() {
        const stage = document.getElementById('stage');

        stage.ondragover = this.onDragOverOnStage;
        stage.ondrop = this.onDropOnStage.bind(this);
        stage.ondragend = this.onDragEndOnStage;

        document.onkeydown = this.onKeyDownOnPresentation.bind(this);

        this.props.getDomain();
    }

    onDragOverOnStage() {
        return false;
    }

    onDropOnStage(e) {
        e.preventDefault();

        this.loadFile(e.dataTransfer.files[0]);

        return false;
    }

    onDragEndOnStage() {
        return false;
    }

    onFilePick(file) {
        this.loadFile(file);
    }

    loadFile(file) {
        const context = this,
            reader = new FileReader();

        reader.onload = event => {
            const presentationDom = converter.makeHtml(event.target.result);

            localforage.setItem('lastPresentationDom', presentationDom)
                .then(() => {
                    context.startPresentation(presentationDom);
                });
        };

        reader.readAsText(file);
    }

    reloadLastPresentation() {
        localforage.getItem('lastPresentationDom')
            .then(value => {
                if (value) {
                    this.startPresentation(value);
                }
            });
    }

    loadSamplePresentation() {
        fetchSampleMarkdownFile()
            .then(response => {
                const presentationDom = converter.makeHtml(response.data);

                this.startPresentation(presentationDom);
            });
    }

    downloadSamplePresentation() {
        fetchSampleMarkdownFile()
            .then(response => {
                const blob = new Blob(
                    [response.data],
                    { type: 'text/markdown;charset=utf-8' }
                );

                FileSaver.saveAs(blob, 'sample-presentation.md');
            });
    }

    startPresentation(presentationData) {
        const generatedPresentationCode = (new Date()).getTime();

        this.props.startPresentation(
            presentationData,
            this.props.configs['web-protocol'],
            this.props.configs.domain,
            generatedPresentationCode
        );

        this.props.setControllerUrlQrCodeData(
            this.props.configs['web-protocol'],
            this.props.configs.domain,
            generatedPresentationCode
        );

        socketService.open(
            this.props.configs,
            generatedPresentationCode,
            presentationData,
            this.onInfo.bind(this),
            this.onCommand.bind(this),
            this.onException.bind(this),
            () => {
                this.showSlide(0);
            }
        );

        this.touchGestures.on(
            'swipe',
            (function (evt) {
                switch (evt.offsetDirection) {
                case 2:
                    // Swipe left = move to next slide
                    this.props.nextSlide(this.showSlide.bind(this));
                    break;
                case 4:
                    // Swipe right = move to previous slide
                    this.props.previousSlide(this.showSlide.bind(this));
                    break;
                default:
                    // Do nothing
                }
            }).bind(this)
        );
    }

    showSlide(slideIndex) {
        const slides = document.querySelectorAll('#presentation .slide');

        this.props.showSlide(slideIndex, slides.length);

        slides.forEach((s, i) => {
            s.className = s.className
                .replace(' visible', '')
                .replace(' previous', '')
                .replace(' next', '');

            if (i < slideIndex) {
                s.className += ' previous';
            } else if (i > slideIndex) {
                s.className += ' next';
            } else {
                s.className += ' visible';
            }
        });

        if (slideIndex !== undefined && slideIndex !== null) {
            socketService.sendSignal('SLIDE-SHOW', slideIndex);
            socketService.sendSignal('SLIDE-ZOOM-OUT');
        }
    }

    onKeyDownOnPresentation(e) {
        if (this.props.presentation.isPresentationLoaded) {
            if (e.keyCode === 39) {
                this.props.nextSlide(this.showSlide.bind(this));
            } else if (e.keyCode === 37) {
                this.props.previousSlide(this.showSlide.bind(this));
            } else if (e.keyCode === 38) {
                this.zoomInOnCurrentSlide();
            } else if (e.keyCode === 40) {
                this.zoomOutOnCurrentSlide();
            }
        }
    }

    zoomInOnCurrentSlide() {
        if (document.querySelectorAll('.slide.visible strong').length) {
            this.props.zoomIn();

            socketService.sendSignal('SLIDE-ZOOM-IN');
        }
    }

    zoomOutOnCurrentSlide() {
        if (document.querySelectorAll('.slide.visible strong').length) {
            this.props.zoomOut();

            socketService.sendSignal('SLIDE-ZOOM-OUT');
        }
    }

    toggleAutoTransition() {
        if (this.props.presentation.isAutoTransitionEnabled) {
            window.clearInterval(timers.slideTransitionTimer);
            timers.slideTransitionTimer = null;
        } else {
            timers.slideTransitionTimer = window.setInterval(
                this.autoTransitToNextSlide.bind(this),
                5000
            );
        }

        this.props.toggleAutoTransition();
    }

    autoTransitToNextSlide() {
        this.props.nextSlide(this.showSlide.bind(this));
    }

    setAnimation(animationName) {
        this.props.setAnimation(animationName);
    }

    onInfo(info) {
        if (info === 'CONNECTION') {
            this.props.setControllerConnectionState(true);

            socketService.sendSignal('SLIDE-SHOW', this.props.presentation.currentSlideIndex);

            if (this.props.presentation.isZoomedIn) {
                socketService.sendSignal('SLIDE-ZOOM-IN');
            }
        } else if (info === 'DISCONNECTION') {
            this.props.setControllerConnectionState(false);
        }
    }

    onCommand(command, param) {
        if (command === 'SLIDE-SHOW') {
            this.showSlide(+param);
        } else if (command === 'SLIDE-ZOOM-IN') {
            this.zoomInOnCurrentSlide();
        } else if (command === 'SLIDE-ZOOM-OUT') {
            this.zoomOutOnCurrentSlide();
        }
    }

    onException(exception) {
        console.error(exception);
        this.props.setControllerConnectionState(false);
    }

    endPresentation() {
        this.props.endPresentation();

        socketService.close();

        this.touchGestures.off('swipe');
    }

    backToHome() {
        this.props.history.push('/');
    }

    render() {
        return (
            <div id="presentation-page">
                <div id="top-panel" className="horizontal-panel">
                    <div id="top-panel-head" className="panel-head">
                        <div id="top-panel-progress-bar" style={{ width: this.props.presentation.presentationProgress + '%' }} />
                        <span id="top-presentation-title-text">{this.props.presentation.title}</span>
                        <div className="panel-controls-group panel-controls-group-right">
                            <div className={'control-button smaller fa fa-close red' + (!this.props.presentation.isPresentationLoaded || !this.props.presentation.controlMode ? ' offsetted' : '') + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '')} onClick={() => this.props.setControlMode(null)} title="Close" />
                            <div className={'control-button smaller fa fa-gear' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '')} onClick={() => this.props.setControlMode('presentation')} title="Set presentation preferences" />
                            <div className={'control-button smaller fa fa-chain' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '') + (this.props.presentation.isControllerConnected ? ' active' : '')} onClick={() => this.props.setControlMode('control')} title={this.props.presentation.isControllerConnected ? 'A controller is connected' : 'Connect a controller'} />
                            <div className={'control-button smaller fa fa-stop' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '')} onClick={() => this.endPresentation()} title="End presentation" />
                            <div className={'control-button smaller' + (this.props.presentation.isPresentationLoaded ? ' hidden' : '')} onClick={() => this.backToHome()}>
                                Go Back
                            </div>
                        </div>
                    </div>
                    <div id="top-panel-body" className={'panel-body' + (this.props.presentation.controlMode ? ' active' : '')}>
                        <div className={'top-panel-body-content' + (this.props.presentation.controlMode === 'presentation' ? ' visible' : '')}>
                            <div className="controls-header">
                                Presentation
                            </div>
                            <div className={'control-button' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '') + (this.props.presentation.isAutoTransitionEnabled ? ' active' : '')} onClick={() => this.toggleAutoTransition()}>
                                Auto-Transition
                            </div>
                            <div className="controls-header">
                                Slide-transition Animation
                            </div>
                            {
                                ['none', 'fade', 'scroll-down', 'scroll-right', 'zoom', 'flip', 'cube', 'cube-inverse', 'carousel'].map(animation =>
                                    (
                                        <div key={animation} className={'control-button' + (this.props.presentation.animation === animation ? ' active' : '')} onClick={() => this.setAnimation(animation)}>
                                            {
                                                animation.slice(0, 1)
                                                    .toUpperCase()
                                                + animation.slice(1)
                                            }
                                        </div>
                                    ))
                            }
                        </div>
                        <div className={'top-panel-body-content' + (this.props.presentation.controlMode === 'control' ? ' visible' : '')}>
                            <div className="controls-header">
                                Remotely control this presentation
                            </div>
                            <div id="qr-code-image" style={{ backgroundImage: 'url(' + this.props.presentation.controllerUrlQrCodeData + ')' }} />
                            <div>
                                <a id="controller-url-link" href={this.props.configs['web-protocol'] + '://' + this.props.configs.domain + '/control/' + this.props.presentation.presentationCode} target="_blank">
                                    {this.props.configs['web-protocol'] + '://' + this.props.configs.domain + '/control/' + this.props.presentation.presentationCode}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="stage-container" className={this.props.presentation.isPresentationLoaded ? 'hidden' : ''}>
                    <div id="stage">
                        <h2 className="regular-text">
                            To start a presentation:
                        </h2>
                        <span className="regular-text">
                            Drop a markdown file here
                        </span>
                        <br />
                        <br />
                        <FilePicker
                            extensions={['md']}
                            onChange={file => this.onFilePick(file)}
                            onError={err => document.alert(err)}>
                            <div className="control-button">
                                Pick a markdown file
                            </div>
                        </FilePicker>
                        <br />
                        <div className={'control-button' + (!this.props.presentation.previousPresentationDataExists ? ' disabled' : '')} onClick={() => this.reloadLastPresentation()}>
                            Reload the last presentation
                        </div>
                        <br />
                        <br />
                        <div className="control-button" onClick={() => this.loadSamplePresentation()}>
                            Load a sample presentation
                        </div>
                        <br />
                        <br />
                        <h2 className="regular-text">
                            To see what a markdown file looks like:
                        </h2>
                        <div className="control-button" onClick={() => this.downloadSamplePresentation()}>
                            Download a sample
                        </div>
                    </div>
                </div>
                <div id="presentation-container" className={!this.props.presentation.isPresentationLoaded ? 'hidden' : ''}>
                    <div id="presentation" className={'markdown-body ' + this.props.presentation.animation + (this.props.presentation.isZoomedIn ? ' zoomed' : '')}>
                        <div id="slides-holder" />
                    </div>
                </div>
                <div id="bottom-panel" className="horizontal-panel">
                    <div id="bottom-panel-head" className="panel-head">
                        <div className="panel-controls-group panel-controls-group-left">
                            <div className={'control-button smaller fa fa-search-minus' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '') + (!this.props.presentation.isZoomedIn ? ' active' : '')} onClick={() => this.zoomOutOnCurrentSlide(null)} title="Zoom out" />
                        </div>
                        <div id="gestures-help-text" className={(!this.props.presentation.isPresentationLoaded ? ' hidden' : '')}>
                            Swipe here to change slide
                        </div>
                        <div className="panel-controls-group panel-controls-group-right">
                            <div className={'control-button smaller fa fa-search-plus' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '') + (this.props.presentation.isZoomedIn ? ' active' : '')} onClick={() => this.zoomInOnCurrentSlide(null)} title="Zoom in" />
                        </div>
                    </div>
                </div>
                <div id="presentation-loading" className={this.props.presentation.isLoading ? 'loading' : ''}>
                    <div id="presentation-loading-content">
                        <div id="presentation-loading-animation">
                            <div className="sheet sheet-one" />
                            <div className="sheet sheet-two" />
                            <div className="sheet sheet-three" />
                            <div className="sheet sheet-four" />
                        </div>
                        <div id="presentation-loading-text">
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    configs: {
        ...state.configs
    },
    presentation: {
        ...state.presentation
    }
});

const mapDispatchToProps = {
    getDomain,
    ...presentationActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
