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
                slideCount
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
    reset
};
