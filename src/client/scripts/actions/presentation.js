/* global document setTimeout */

import qrcode from 'qrcode';
import localforage from 'localforage';

import {
    getFirstSlide,
    getSlidesDom,
    getLastSlide,
    getFooter,
    mutateImageSources,
    unmutateImageSources,
    allImagesLoaded
} from '../common';
import { presentation } from '../constants/action-names';

const updatePreviousPresentationInfo = () =>
    dispatch => {
        localforage.getItem('lastPresentationDom')
            .then(value => {
                dispatch({
                    type: presentation.setPreviousPresentationInfo,
                    payLoad: value
                });
            });
    };

const startPresentation = (presentationDomData, protocol, domain, presentationCode) =>
    dispatch => {
        dispatch(setLoading(true));

        const presentationContainer = document.getElementById('slides-holder');

        presentationContainer.innerHTML = getSlidesDom(mutateImageSources(presentationDomData));

        const title = presentationContainer.querySelector('h1').innerText,
            images = document.getElementsByTagName('img');

        presentationContainer.innerHTML = getFirstSlide(title) + presentationContainer.innerHTML;
        presentationContainer.innerHTML += getLastSlide(title);
        presentationContainer.innerHTML += getFooter(protocol, domain);

        setTimeout(() => {
            allImagesLoaded(images).then(() => {
                dispatch(setLoading(false));
            });

            unmutateImageSources(images);

            dispatch({
                type: presentation.startPresentation,
                payLoad: {
                    presentationCode,
                    title: title,
                    slideCount: document.querySelectorAll('#presentation .slide').length
                }
            });

            dispatch(updatePreviousPresentationInfo());

            dispatch(getAnimation());
        }, 1000);
    };

const setLoading = value =>
    dispatch => {
        dispatch({
            type: presentation.setLoading,
            payLoad: value
        });
    };

const showSlide = (slideIndex, slideCount) =>
    dispatch => {
        dispatch({
            type: presentation.showSlide,
            payLoad: {
                currentSlideIndex: slideIndex,
                presentationProgress: (slideIndex * 100) / (slideCount - 1)
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

const setControlMode = mode =>
    dispatch => {
        dispatch({
            type: presentation.setControlMode,
            payLoad: mode
        });
    };

const toggleAutoTransition = () =>
    dispatch => {
        dispatch({
            type: presentation.toggleAutoTransition
        });
    };

const setAutoTransitionDelay = delay =>
    dispatch => {
        dispatch({
            type: presentation.setAutoTransitionDelay,
            payLoad: delay
        });
    };

const setAnimation = animationName =>
    dispatch => {
        localforage.setItem('animationName', animationName)
            .then(() => {
                dispatch({
                    type: presentation.setAnimation,
                    payLoad: animationName
                });
            });
    };

const getAnimation = () =>
    dispatch => {
        localforage.getItem('animationName')
            .then(value => {
                dispatch({
                    type: presentation.getAnimation,
                    payLoad: value
                });
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
    updatePreviousPresentationInfo,
    startPresentation,
    setLoading,
    showSlide,
    setControllerUrlQrCodeData,
    nextSlide,
    previousSlide,
    zoomIn,
    zoomOut,
    setControlMode,
    toggleAutoTransition,
    setAutoTransitionDelay,
    setAnimation,
    getAnimation,
    setControllerConnectionState,
    endPresentation
};
