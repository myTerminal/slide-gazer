/* global window document alert FileReader */

import React from 'react';
import { connect } from 'react-redux';
import { FilePicker } from 'react-file-picker';
import showdown from 'showdown';
import localforage from 'localforage';

import getDomain from '../../actions/configs';
import presentationActions from '../../actions/presentation';

import socketService from '../../services/presentation-socket-service.js';

const converter = new showdown.Converter();

class Presentation extends React.Component {
    constructor(props) {
        super(props);

        props.updatePreviousPresentationInfo();

        this.autoTransitionTimer = null;
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

    startPresentation(presentationData) {
        const generatedPresentationCode = (new Date()).getTime();

        this.props.startPresentation(
            presentationData,
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
            this.onException.bind(this)
        );

        this.showSlide(0);

        this.props.setControllerUrlQrCodeData(
            this.props.configs['web-protocol'],
            this.props.configs.domain,
            generatedPresentationCode
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
        this.props.zoomIn();

        socketService.sendSignal('SLIDE-ZOOM-IN');
    }

    zoomOutOnCurrentSlide() {
        this.props.zoomOut();

        socketService.sendSignal('SLIDE-ZOOM-OUT');
    }

    toggleAutoTransition() {
        if (this.props.presentation.isAutoTransitionEnabled) {
            window.clearInterval(this.autoTransitionTimer);
            this.autoTransitionTimer = null;
        } else {
            this.autoTransitionTimer = window.setInterval(
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
    }

    backToHome() {
        this.props.history.push('/');
    }

    render() {
        return (
            <div id="presentation-page">
                <div id="top-panel">
                    <div id="top-panel-head">
                        <span id="top-panel-pulldown-trigger" className="fa fa-angle-double-down" />
                        <div id="top-panel-progress-bar" style={{ width: this.props.presentation.presentationProgress + '%' }} />
                        <span id="top-presentation-title-text">{this.props.presentation.title}</span>
                        <span id="controller-connection-icon" className={'fa fa-chain' + (!this.props.presentation.isControllerConnected ? ' hidden' : '')} title="A controller is connected" />
                    </div>
                    <div id="top-panel-body">
                        <div className={'controls-row' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '')}>
                            <div id="qr-code-image" style={{ backgroundImage: 'url(' + this.props.presentation.controllerUrlQrCodeData + ')' }} />
                            <div className="controls-row-header">
                                Remotely control this presentation
                            </div>
                            <div>
                                <a id="controller-url-link" href={this.props.configs['web-protocol'] + '://' + this.props.configs.domain + '/control/' + this.props.presentation.presentationCode} target="_blank">
                                    {this.props.configs['web-protocol'] + '://' + this.props.configs.domain + '/control/' + this.props.presentation.presentationCode}
                                </a>
                            </div>
                        </div>
                        <div className="controls-row">
                            <div className="controls-row-header">
                                Presentation
                            </div>
                            <div className={'control-button' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '')} onClick={this.endPresentation.bind(this)}>
                                End
                            </div>
                            <div className={'control-button' + (this.props.presentation.isPresentationLoaded ? ' hidden' : '')} onClick={this.backToHome.bind(this)}>
                                Back
                            </div>
                            <div className={'control-button' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '') + (this.props.presentation.isAutoTransitionEnabled ? ' active' : '')} onClick={this.toggleAutoTransition.bind(this)}>
                                Auto-Transition
                            </div>
                        </div>
                        <div className={'controls-row' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '')}>
                            <div className="controls-row-header">
                                Animation
                            </div>
                            {
                                ['none', 'fade', 'scroll-down', 'scroll-right', 'zoom', 'flip', 'carousel'].map(animation =>
                                    (
                                        <div key={animation} className={'control-button' + (this.props.presentation.animation === animation ? ' active' : '')} onClick={() => this.setAnimation.bind(this)(animation)}>
                                            {
                                                animation.slice(0, 1)
                                                    .toUpperCase()
                                                + animation.slice(1)
                                            }
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div>
                <div id="stage-container" className={this.props.presentation.isPresentationLoaded ? 'hidden' : ''}>
                    <div id="stage">
                        <h2 className="regular-text">
                            To start a presentation, do one of the following:
                        </h2>
                        <br />
                        <FilePicker
                            extensions={['md']}
                            onChange={file => this.onFilePick(file)}
                            onError={err => alert(err)}>
                            <div className="control-button">
                                Pick a markdown file
                            </div>
                        </FilePicker>
                        <br />
                        <span className="regular-text">
                            OR
                        </span>
                        <br />
                        <br />
                        <span className="regular-text">
                            Drop a markdown file on this page
                        </span>
                        <br />
                        <br />
                        <span className="regular-text">
                            OR
                        </span>
                        <br />
                        <br />
                        <div className={'control-button' + (!this.props.presentation.previousPresentationDataExists ? ' disabled' : '')} onClick={this.reloadLastPresentation.bind(this)}>
                            Reload the last presentation
                        </div>
                    </div>
                </div>
                <div id="presentation-container" className={!this.props.presentation.isPresentationLoaded ? 'hidden' : ''}>
                    <div id="presentation" className={'markdown-body ' + this.props.presentation.animation + (this.props.presentation.isZoomedIn ? ' zoomed' : '')}>
                        <div id="slides-holder" />
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
