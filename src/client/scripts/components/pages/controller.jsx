/* global document alert */

import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import socketService from '../../services/controller-socket-service.js';

export default class Controller extends React.Component {
    constructor(props) {
        super();

        this.state = {
            configs: {
                domain: 'slide-gazer.teamfluxion.com'
            },
            redirectToHome: false,
            isConnected: false,
            presentationCode: props.match.params.presentationCode || '',
            slideCount: 0,
            currentSlideIndex: 0,
            isZoomedIn: false,
            presentationProgress: 0
        };
    }

    componentDidMount() {
        var context = this;

        axios.get('/configs').then(response => {
            context.setState({
                configs: response.data
            });
        }).catch(() => {
            alert('Failed to fetch domain details.');
        });
    }

    onPresentationCodeChange(e) {
        this.setState({
            presentationCode: e.target.value
        });
    }

    backToHome() {
        this.setState({
            redirectToHome: true
        });
    }

    disconnect() {
        socketService.close();
        this.reset();
    }

    reset() {
        this.setState({
            isConnected: false,
            presentationCode: '',
            slideCount: 0,
            currentSlideIndex: 0,
            presentationProgress: 0
        });
    }

    connect() {
        socketService.open(
            this.state.configs,
            this.state.presentationCode,
            this.onInfo.bind(this),
            this.onSignal.bind(this),
            this.onException.bind(this)
        );
    }

    loadPresentation(presentationData) {
        var presentationView = document.getElementById('controller-presentation-view'),
            title;

        presentationView.innerHTML = this.getSlidesDOM(presentationData);

        title = presentationView.querySelector('h1').innerText;

        presentationView.innerHTML += this.getLastSlide(title);

        this.setState({
            isConnected: true,
            slideCount: presentationView.querySelectorAll('.slide').length,
            currentSlideIndex: 0,
            presentationProgress: 0
        });
    }

    highlightSlide(slideIndex) {
        var slides = document.querySelectorAll('#controller-presentation-view .slide');

        slides.forEach(s => {
            s.className = s.className.replace(' active', '');
        });

        slides[slideIndex].className += ' active';
    }

    previousSlide() {
        if (!this.state.currentSlideIndex) {
            return;
        }

        socketService.sendCommand('SLIDE-SHOW', this.state.currentSlideIndex - 1);
    }

    nextSlide() {
        if (this.state.currentSlideIndex + 1 === this.state.slideCount) {
            return;
        }

        socketService.sendCommand('SLIDE-SHOW', this.state.currentSlideIndex + 1);
    }

    zoomInOnCurrentSlide() {
        socketService.sendCommand('SLIDE-ZOOM-IN');
    }

    zoomOutOnCurrentSlide() {
        socketService.sendCommand('SLIDE-ZOOM-OUT');
    }

    getSlidesDOM(presentationData) {
        return '<div class="slide">' +
            presentationData.replace(/<h2/g,
                '</div><div class="slide"><h2') +
            '</div>';
    }

    getLastSlide(title) {
        return '<div class="slide last-slide">' +
               '  <h1>' + title + '</h1>' +
               '  Thanks for attending the session. Questions please...' +
               '</div>';
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
            this.setState({
                currentSlideIndex: data,
                presentationProgress: ((data + 1) * 100) / this.state.slideCount
            });

            this.highlightSlide(data);
        } else if (signal === 'SLIDE-ZOOM-IN') {
            this.setState({
                isZoomedIn: true
            });
        } else if (signal === 'SLIDE-ZOOM-OUT') {
            this.setState({
                isZoomedIn: false
            });
        }
    }

    onException(exception) {
        alert(exception);
        this.reset();
    }

    render() {
        if (this.state.redirectToHome) {
            return <Redirect to="/" />;
        }

        return (
            <div id="controller-page">
                <div id="stage" className={this.state.isConnected ? 'hidden' : ''}>
                    <div id="stage-controls">
                        <span id="presentation-code-label" className="regular-text">
                            Enter presentation code to connect
                        </span>
                        <br />
                        <input type="text"
                            id="presentation-code-input"
                            value={this.state.presentationCode}
                            onChange={this.onPresentationCodeChange.bind(this)} />
                        <br />
                        <div id="connect-button"
                            className={'control-button' + (!this.state.presentationCode ? ' disabled' : '')}
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
                <div id="controller" className={!this.state.isConnected ? 'hidden' : ''}>
                    <div id="controller-presentation-view" />
                    <div id="controller-screen-container">
                        <div id="presentation-progress-bar-container">
                            <div id="presentation-progress-bar"
                                style={{ width: this.state.presentationProgress + '%' }} />
                        </div>
                        <div id="controller-screen">
                            <span className="presentation-detail">
                                Slide: {this.state.currentSlideIndex + 1} / {this.state.slideCount}
                            </span>
                        </div>
                    </div>
                    <div id="controller-controls">
                        <div className="control-row">
                            <div className="presentation-control-button disabled">
                                <span className="fa fa-3x fa-fast-backward" />
                            </div>
                            <div className={'presentation-control-button' + (!this.state.currentSlideIndex ? ' disabled' : '')} onClick={this.previousSlide.bind(this)}>
                                <span className="fa fa-3x fa-step-backward" />
                            </div>
                            <div className={'presentation-control-button' + (this.state.currentSlideIndex === this.state.slideCount - 1 ? ' disabled' : '')} onClick={this.nextSlide.bind(this)}>
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
                            <div className={'presentation-control-button' + (!this.state.isZoomedIn ? ' active disabled' : '')} onClick={this.zoomOutOnCurrentSlide.bind(this)}>
                                <span className="fa fa-3x fa-search-minus" />
                            </div>
                            <div className={'presentation-control-button' + (this.state.isZoomedIn ? ' active disabled' : '')} onClick={this.zoomInOnCurrentSlide.bind(this)}>
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
