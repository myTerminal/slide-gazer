/* global require, window */

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
    animation: 'scroll-down',
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
            presentationProgress: action.payLoad.presentationProgress
        };
    case presentation.setControllerUrlQrCodeData:
        return {
            ...state,
            controllerUrlQrCodeData: action.payLoad
        };
    case presentation.zoomIn:
        return {
            ...state,
            isZoomedIn: true
        };
    case presentation.zoomOut:
        return {
            ...state,
            isZoomedIn: false
        };
    case presentation.setControlMode:
        return {
            ...state,
            controlMode: action.payLoad
        };
    case presentation.toggleAutoTransition:
        return {
            ...state,
            isAutoTransitionEnabled: !state.isAutoTransitionEnabled
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
    case presentation.setControllerConnectionState:
        return {
            ...state,
            isControllerConnected: action.payLoad
        };
    case presentation.endPresentation:
        if (state.isAutoTransitionEnabled) {
            window.clearTimeout(timers.slideTransitionTimer);
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
            isAutoTransitionEnabled: false
        };
    default:
        return state;
    }
};

export default presentationReducer;
