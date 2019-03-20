import { controller } from '../constants/action-names';

export const setInitialPresentationCode = presentationCode =>
    dispatch => {
        dispatch({
            type: controller.setInitialPresentationCode,
            payLoad: presentationCode
        });
    };

export const changePresentationCode = presentationCode =>
    dispatch => {
        dispatch({
            type: controller.changePresentationCode,
            payLoad: presentationCode
        });
    };

export const startControllingPresentation = slideCount =>
    dispatch => {
        dispatch({
            type: controller.startControllingPresentation,
            payLoad: slideCount
        });
    };

export const showSlide = (slideIndex, slideCount) =>
    dispatch => {
        dispatch({
            type: controller.showSlide,
            payLoad: {
                slideIndex,
                presentationProgress: (slideIndex * 100) / (slideCount - 1)
            }
        });
    };

export const zoomIn = () =>
    dispatch => {
        dispatch({
            type: controller.zoomIn
        });
    };

export const zoomOut = () =>
    dispatch => {
        dispatch({
            type: controller.zoomOut
        });
    };

export const toggleReadingMode = () =>
    dispatch => {
        dispatch({
            type: controller.toggleReadingMode
        });
    };

export const reset = () =>
    dispatch => {
        dispatch({
            type: controller.reset
        });
    };

export default {
    setInitialPresentationCode,
    changePresentationCode,
    startControllingPresentation,
    showSlide,
    zoomIn,
    zoomOut,
    toggleReadingMode,
    reset
};
