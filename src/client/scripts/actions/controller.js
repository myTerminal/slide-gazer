import { controller } from '../constants/action-names';

const setInitialPresentationCode = presentationCode =>
    dispatch => {
        dispatch({
            type: controller.setInitialPresentationCode,
            payLoad: presentationCode
        });
    };

const changePresentationCode = presentationCode =>
    dispatch => {
        dispatch({
            type: controller.changePresentationCode,
            payLoad: presentationCode
        });
    };

const startControllingPresentation = slideCount =>
    dispatch => {
        dispatch({
            type: controller.startControllingPresentation,
            payLoad: slideCount
        });
    };

const showSlide = (slideIndex, slideCount) =>
    dispatch => {
        dispatch({
            type: controller.showSlide,
            payLoad: {
                slideIndex,
                presentationProgress: (slideIndex * 100) / (slideCount - 1)
            }
        });
    };

const zoomIn = () =>
    dispatch => {
        dispatch({
            type: controller.zoomIn
        });
    };

const zoomOut = () =>
    dispatch => {
        dispatch({
            type: controller.zoomOut
        });
    };

const toggleReadingMode = () =>
    dispatch => {
        dispatch({
            type: controller.toggleReadingMode
        });
    };

const reset = () =>
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
