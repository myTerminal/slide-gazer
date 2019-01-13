/* global document alert */

import React from 'react';
import { connect } from 'react-redux';

import getDomain from '../../actions/configs';
import controllerActions from '../../actions/controller';
import {
    getSlidesDom,
    getLastSlide
} from '../../common';

import socketService from '../../services/controller-socket-service.js';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.props.setInitialPresentationCode(this.props.match.params.presentationCode);
    }

    componentDidMount() {
        this.props.getDomain();
    }

    onPresentationCodeChange(e) {
        this.props.changePresentationCode(e.target.value);
    }

    connect() {
        socketService.open(
            this.props.configs,
            this.props.controller.presentationCode,
            this.onInfo.bind(this),
            this.onSignal.bind(this),
            this.onException.bind(this)
        );
    }

    loadPresentation(presentationData) {
        const presentationView = document.getElementById('controller-presentation-view');

        presentationView.innerHTML = getSlidesDom(presentationData);

        const title = presentationView.querySelector('h1').innerText;

        presentationView.innerHTML += getLastSlide(title);

        this.props.startControllingPresentation(presentationView.querySelectorAll('.slide').length);
    }

    highlightSlide(slideIndex) {
        const slides = document.querySelectorAll('#controller-presentation-view .slide');

        slides.forEach(s => {
            s.className = s.className.replace(' active', '');
        });

        slides[slideIndex].className += ' active';
    }

    previousSlide() {
        if (!this.props.controller.currentSlideIndex) {
            return;
        }

        socketService.sendCommand('SLIDE-SHOW', this.props.controller.currentSlideIndex - 1);
    }

    nextSlide() {
        if (this.props.controller.currentSlideIndex + 1 === this.props.controller.slideCount) {
            return;
        }

        socketService.sendCommand('SLIDE-SHOW', this.props.controller.currentSlideIndex + 1);
    }

    zoomInOnCurrentSlide() {
        socketService.sendCommand('SLIDE-ZOOM-IN');
    }

    zoomOutOnCurrentSlide() {
        socketService.sendCommand('SLIDE-ZOOM-OUT');
    }

    onInfo(info, data) {
        if (info === 'DATA') {
            this.loadPresentation(data);
        } else if (info === 'NO-PRESENTATION') {
            alert('The presentation you tried to connect to does not exist!');
        } else if (info === 'DISCONNECTION') {
            alert('The presentation you were controlling has ended');
        } else if (info === 'DUPLICATE') {
            alert('Someone is already controlling the presentation you tried to connect!');
        }
    }

    onSignal(signal, data) {
        if (signal === 'SLIDE-SHOW') {
            this.props.showSlide(data, this.props.controller.slideCount);
            this.highlightSlide(data);
        } else if (signal === 'SLIDE-ZOOM-IN') {
            this.props.zoomIn();
        } else if (signal === 'SLIDE-ZOOM-OUT') {
            this.props.zoomOut();
        }
    }

    onException(exception) {
        alert(exception);
        this.reset();
    }

    disconnect() {
        socketService.close();
        this.reset();
    }

    reset() {
        this.props.reset();
    }

    backToHome() {
        this.props.history.push('/');
    }

    render() {
        return (
            <div id="controller-page">
                <div id="stage" className={this.props.controller.isConnected ? 'hidden' : ''}>
                    <div id="stage-controls">
                        <span id="presentation-code-label" className="regular-text">
                            Enter presentation code to connect
                        </span>
                        <br />
                        <input type="text"
                            id="presentation-code-input"
                            value={this.props.controller.presentationCode}
                            onChange={this.onPresentationCodeChange.bind(this)} />
                        <br />
                        <div id="connect-button"
                            className={'control-button' + (!this.props.controller.presentationCode ? ' disabled' : '')}
                            onClick={this.connect.bind(this)}>
                            Connect
                        </div>
                        <div id="back-button"
                            className="control-button"
                            onClick={this.backToHome.bind(this)}>
                            Back
                        </div>
                    </div>
                </div>
                <div id="controller" className={!this.props.controller.isConnected ? 'hidden' : ''}>
                    <div id="controller-presentation-view" />
                    <div id="controller-screen-container">
                        <div id="presentation-progress-bar-container">
                            <div id="presentation-progress-bar"
                                style={{ width: this.props.controller.presentationProgress + '%' }} />
                        </div>
                        <div id="controller-screen">
                            <span className="presentation-detail">
                                Slide:&nbsp;
                                {this.props.controller.currentSlideIndex + 1}/
                                {this.props.controller.slideCount}
                            </span>
                        </div>
                    </div>
                    <div id="controller-controls">
                        <div className="control-row">
                            <div className="presentation-control-button disabled">
                                <span className="fa fa-3x fa-fast-backward" />
                            </div>
                            <div className={'presentation-control-button' + (!this.props.controller.currentSlideIndex ? ' disabled' : '')} onClick={this.previousSlide.bind(this)}>
                                <span className="fa fa-3x fa-step-backward" />
                            </div>
                            <div className={'presentation-control-button' + (this.props.controller.currentSlideIndex === this.props.controller.slideCount - 1 ? ' disabled' : '')} onClick={this.nextSlide.bind(this)}>
                                <span className="fa fa-3x fa-step-forward" />
                            </div>
                            <div className="presentation-control-button disabled">
                                <span className="fa fa-3x fa-fast-forward" />
                            </div>
                        </div>
                        <div className="control-row">
                            <div className="presentation-control-button" onClick={this.disconnect.bind(this)}>
                                <span className="fa fa-3x fa-power-off" style={{ color: 'red' }} />
                            </div>
                            <div className={'presentation-control-button' + (!this.props.controller.isZoomedIn ? ' active disabled' : '')} onClick={this.zoomOutOnCurrentSlide.bind(this)}>
                                <span className="fa fa-3x fa-search-minus" />
                            </div>
                            <div className={'presentation-control-button' + (this.props.controller.isZoomedIn ? ' active disabled' : '')} onClick={this.zoomInOnCurrentSlide.bind(this)}>
                                <span className="fa fa-3x fa-search-plus" />
                            </div>
                            <div className="presentation-control-button disabled">
                                <span className="fa fa-3x fa-times" />
                            </div>
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
    controller: {
        ...state.controller
    }
});

const mapDispatchToProps = {
    getDomain,
    ...controllerActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
