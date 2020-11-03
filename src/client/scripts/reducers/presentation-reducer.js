/* global require, window, document */

import { alert } from 'ample-alerts';

import { presentation } from '../constants/action-names';
import { timers } from '../common';

const packageDetails = require('../../../../package.json');

const initialState = {
    isLoading: false,
    previousPresentationDataExists: false,
    isPresentationLoaded: false,
    presentationCode: '',
    controllerUrlQRCodeData: '',
    title: `Slide Gazer v${packageDetails.version}`,
    slideCount: 0,
    currentSlideIndex: 0,
    isZoomedIn: false,
    presentationProgress: 0,
    controlMode: null,
    isAutoTransitionEnabled: false,
    autoTransitionDelay: 1,
    animation: 'scroll-down',
    isIndexMode: false,
    isFullscreen: false,
    isControllerConnected: false
};

const presentationReducer = (state = initialState, action) => {
    switch (action.type) {
    case presentation.setPreviousPresentationInfo:
        return {
            ...state,
            previousPresentationDataExists: action.payLoad
        };
    case presentation.startPresentation:
        return {
            ...state,
            isPresentationLoaded: true,
            presentationCode: action.payLoad.presentationCode,
            title: action.payLoad.title,
            slideCount: action.payLoad.slideCount
        };
    case presentation.setLoading:
        return {
            ...state,
            isLoading: action.payLoad
        };
    case presentation.showSlide:
        return {
            ...state,
            currentSlideIndex: action.payLoad.currentSlideIndex,
            isZoomedIn: false,
            presentationProgress: action.payLoad.presentationProgress,
            isIndexMode: false
        };
    case presentation.setControllerUrlQrCodeData:
        return {
            ...state,
            controllerUrlQrCodeData: action.payLoad
        };
    case presentation.zoomIn:
        return {
            ...state,
            isZoomedIn: true,
            isIndexMode: false
        };
    case presentation.zoomOut:
        return {
            ...state,
            isZoomedIn: false,
            isIndexMode: false
        };
    case presentation.setControlMode:
        // TODO: Temporary message for broken websocket connectivity
        if (action.payLoad === 'control') {
            alert(
                [
                    'This feature is broken!',
                    'Due to recent updates, Slide Gazer is not able to connect to web socket server. This means that remotely controlling a running presentation will not be possible until this issue is resolved. Effort is planned for this activity and hopefully it will start working again.'
                ]
            );
        }

        return {
            ...state,
            controlMode: action.payLoad,
            isIndexMode: false
        };
    case presentation.toggleAutoTransition:
        return {
            ...state,
            isAutoTransitionEnabled: !state.isAutoTransitionEnabled
        };
    case presentation.setAutoTransitionDelay:
        return {
            ...state,
            autoTransitionDelay: action.payLoad
        };
    case presentation.setAnimation:
        return {
            ...state,
            animation: action.payLoad
        };
    case presentation.getAnimation:
        return {
            ...state,
            animation: action.payLoad || state.animation
        };
    case presentation.toggleIndex:
        return {
            ...state,
            controlMode: null,
            isIndexMode: !state.isIndexMode
        };
    case presentation.setFullscreenMode:
        return {
            ...state,
            isFullscreen: action.payLoad
        };
    case presentation.setControllerConnectionState:
        return {
            ...state,
            isControllerConnected: action.payLoad
        };
    case presentation.endPresentation:
        if (state.isAutoTransitionEnabled) {
            window.clearTimeout(timers.slideTransitionTimer);
        }

        if (state.isFullscreen) {
            document.exitFullscreen();
        }

        return {
            ...state,
            isPresentationLoaded: false,
            presentationCode: '',
            title: initialState.title,
            controllerUrlQRCodeData: '',
            slideCount: 0,
            currentSlideIndex: 0,
            presentationProgress: 0,
            controlMode: null,
            isIndexMode: false,
            isFullscreen: false,
            isAutoTransitionEnabled: false
        };
    default:
        return state;
    }
};

export default presentationReducer;
