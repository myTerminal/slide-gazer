/* global window document */

import qrcode from 'qrcode';
import localforage from 'localforage';

import {
    getSlidesDom,
    getLastSlide,
    getFooter
} from '../common';
import { presentation } from '../constants/action-names';

const getWhetherPreviousPresentationExists = () =>
    (dispatch) => {
        localforage.getItem('lastPresentationDom')
            .then(value => {
                dispatch({
                    type: presentation.receiveWhetherPreviousPresentationExists,
                    payLoad: value
                });
            });
    };

const startPresentation = (presentationDomData, protocol, domain, presentationCode) =>
    dispatch => {
        const presentationContainer = document.getElementById('slides-holder');

        presentationContainer.innerHTML = getSlidesDom(presentationDomData);

        const title = presentationContainer.querySelector('h1').innerText;

        presentationContainer.innerHTML += getLastSlide(title);
        presentationContainer.innerHTML += getFooter(protocol, domain);

        dispatch({
            type: presentation.startPresentation,
            payLoad: {
                presentationCode,
                title: title,
                slideCount: document.querySelectorAll('#presentation .slide').length
            }
        });
    };

const showSlide = (slideIndex, slideCount) =>
    dispatch => {
        dispatch({
            type: presentation.showSlide,
            payLoad: {
                currentSlideIndex: slideIndex,
                presentationProgress: ((slideIndex + 1) * 100) / slideCount
            }
        });
    };

const setControllerUrlQrCodeData = (protocol, domain, presentationCode) =>
    dispatch => {
        qrcode.toDataURL(protocol + '://' + domain + '/control/' + presentationCode)
            .then(url => {
                dispatch({
                    type: presentation.setControllerUrlQrCodeData,
                    payLoad: url
                });
            });
    };

const nextSlide = showSlideCallback =>
    (dispatch, getState) => {
        const state = getState().presentation;

        if (state.currentSlideIndex + 1 === state.slideCount) {
            return;
        }

        showSlideCallback(state.currentSlideIndex + 1);
    };

const previousSlide = showSlideCallback =>
    (dispatch, getState) => {
        const state = getState().presentation;

        if (!state.currentSlideIndex) {
            return;
        }

        showSlideCallback(state.currentSlideIndex - 1);
    };

const zoomIn = () =>
    dispatch => {
        dispatch({
            type: presentation.zoomIn
        });
    };

const zoomOut = () =>
    dispatch => {
        dispatch({
            type: presentation.zoomOut
        });
    };

const toggleAutoTransition = () =>
    dispatch => {
        dispatch({
            type: presentation.toggleAutoTransition
        });
    };

const setAnimation = animationName =>
    dispatch => {
        dispatch({
            type: presentation.setAnimation,
            payLoad: animationName
        });
    };

const setControllerConnectionState = connectionState =>
    dispatch => {
        dispatch({
            type: presentation.setControllerConnectionState,
            payLoad: connectionState
        });
    };

const endPresentation = () =>
    dispatch => {
        dispatch({
            type: presentation.endPresentation
        });
    };

export default {
    getWhetherPreviousPresentationExists,
    startPresentation,
    showSlide,
    setControllerUrlQrCodeData,
    nextSlide,
    previousSlide,
    zoomIn,
    zoomOut,
    toggleAutoTransition,
    setAnimation,
    setControllerConnectionState,
    endPresentation
};
