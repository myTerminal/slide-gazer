/* global window document */

import React from 'react';
import { connect } from 'react-redux';
import { alert, confirm } from 'ample-alerts';
import Hammer from 'hammerjs';

import TopPanel from '../panel-top.jsx';
import Stage from '../stage.jsx';
import BottomPanel from '../panel-bottom.jsx';
import Loading from '../loading.jsx';

import { timers } from '../../common';
import { getDomain } from '../../actions/configs';
import presentationActions from '../../actions/presentation';

import socketService from '../../services/presentation-socket-service.js';

const minimumSlideTransitionDelay = 5000;

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
        document.onkeydown = this.onKeyDownOnPresentation.bind(this);

        this.props.getDomain();

        document.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this), false);
        document.addEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this), false);
        document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this), false);
        document.addEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this), false);
        document.removeEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this), false);
        document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this), false);
        document.removeEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this), false);
    }

    onFullscreenChange() {
        if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
            this.props.setFullscreenMode(true);
        } else {
            this.props.setFullscreenMode(false);
        }
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
                this.bindNavigationEvents();
            }
        );

        this.touchGestures.on(
            'swipe',
            (function (evt) {
                if (evt.offsetDirection === 2) {
                    this.props.nextSlide(this.showSlide.bind(this));
                } else if (evt.offsetDirection === 4) {
                    this.props.previousSlide(this.showSlide.bind(this));
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

    bindNavigationEvents() {
        const context = this;

        Array.prototype.forEach.call(
            document.querySelectorAll(
                '#presentation .slide h1, #presentation .slide h2'
            ),
            (s, i) => {
                s.onclick = () => {
                    context.showSlide(i);
                };
            }
        );
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

    disconnectController() {
        socketService.sendInfo('DISCONNECT-CONTROLLER');
    }

    toggleAutoTransition() {
        if (this.props.presentation.isAutoTransitionEnabled) {
            window.clearInterval(timers.slideTransitionTimer);
            timers.slideTransitionTimer = null;
        } else {
            this.setTimerToTransitionSlides(
                this.props.presentation.autoTransitionDelay * minimumSlideTransitionDelay
            );
        }

        this.props.toggleAutoTransition();
    }

    onAutoTransitionDelayChange(event) {
        const value = event.target.value;
        const newDelay = value * minimumSlideTransitionDelay;

        window.clearInterval(timers.slideTransitionTimer);
        this.setTimerToTransitionSlides(newDelay);

        this.props.setAutoTransitionDelay(value);
    }

    setTimerToTransitionSlides(actualDelay) {
        timers.slideTransitionTimer = window.setInterval(
            this.autoTransitToNextSlide.bind(this),
            actualDelay
        );
    }

    autoTransitToNextSlide() {
        this.props.nextSlide(this.showSlide.bind(this));
    }

    onInfo(info) {
        if (info === 'CONNECTION-REQUEST') {
            confirm(
                [
                    'A controller is trying to connect...',
                    'Do you want to accept this connection?'
                ],
                {
                    onAction: response => {
                        if (response) {
                            alert(
                                'Controller connected!',
                                {
                                    autoClose: 3000
                                }
                            );

                            socketService.sendInfo('CONNECTION-ACCEPTED');
                        } else {
                            socketService.sendInfo('CONNECTION-DECLINED');
                        }
                    }
                }
            );
        } else if (info === 'CONNECTION') {
            this.props.setControllerConnectionState(true);

            socketService.sendSignal('SLIDE-SHOW', this.props.presentation.currentSlideIndex);

            if (this.props.presentation.isZoomedIn) {
                socketService.sendSignal('SLIDE-ZOOM-IN');
            }

            this.props.setControlMode(null);
        } else if (info === 'DISCONNECTION') {
            this.props.setControllerConnectionState(false);

            alert(
                'Controller has been disconnected',
                {
                    autoClose: 3000
                }
            );
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
        this.unbindNavigationEvents();
    }

    unbindNavigationEvents() {
        Array.prototype.forEach.call(
            document.querySelectorAll(
                '#presentation .slide h1, #presentation .slide h2'
            ),
            s => { s.onclick = null; }
        );
    }

    backToHome() {
        this.props.history.push('/');
    }

    render() {
        return (
            <div id="presentation-page">
                <TopPanel
                    configs={this.props.configs}
                    presentation={this.props.presentation}
                    setControlMode={this.props.setControlMode}
                    disconnectController={() => this.disconnectController()}
                    toggleAutoTransition={() => this.toggleAutoTransition()}
                    setAnimation={(n) => this.props.setAnimation(n)}
                    onAutoTransitionDelayChange={(e) => this.onAutoTransitionDelayChange(e)}
                    toggleIndex={this.props.toggleIndex}
                    backToHome={() => this.backToHome()}
                    endPresentation={() => this.endPresentation()}
                />
                <Stage
                    presentation={this.props.presentation}
                    startPresentation={(d) => this.startPresentation(d)}
                />
                <div
                    id="presentation-container"
                    className={!this.props.presentation.isPresentationLoaded ? 'hidden' : ''}>
                    <div
                        id="presentation"
                        className={'markdown-body ' + this.props.presentation.animation + (this.props.presentation.isZoomedIn ? ' zoomed' : '') + (this.props.presentation.isIndexMode ? ' index-mode' : '')}>
                        <div id="slides-holder" />
                    </div>
                </div>
                <BottomPanel
                    presentation={this.props.presentation}
                    zoomInOnCurrentSlide={() => this.zoomInOnCurrentSlide()}
                    zoomOutOnCurrentSlide={() => this.zoomOutOnCurrentSlide()}
                />
                <Loading isLoading={this.props.presentation.isLoading} />
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
