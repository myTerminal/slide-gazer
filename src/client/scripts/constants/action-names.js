export const configs = {
    domain: {
        fetched: 'DOMAIN_FETCHED'
    }
};

export const presentation = {
    receiveWhetherPreviousPresentationExists: 'RECEIVE_WHETHER_PREVIOUS_PRESENTATION_EXISTS',
    startPresentation: 'START_PRESENTATION',
    showSlide: 'SHOW_SLIDE',
    setControllerUrlQrCodeData: 'SET_CONTROLLER_URL_QR_CODE_DATA',
    nextSlide: 'NEXT_SLIDE',
    previousSlide: 'PREVIOUS_SLIDE',
    zoomIn: 'ZOOM_IN',
    zoomOut: 'ZOOM_OUT',
    toggleAutoTransition: 'TOGGLE_AUTO_TRANSITION',
    setAnimation: 'SET_ANIMATION',
    setControllerConnectionState: 'SET_CONTROLLER_CONNECTION_STATE',
    endPresentation: 'END_PRESENTATION'
};

export const controller = {
    setInitialPresentationCode: 'SET_INITIAL_PRESENTATION_CODE',
    changePresentationCode: 'CHANGE_PRESENTATION_CODE',
    startControllingPresentation: 'START_CONTROLLING_PRESENTATION',
    showSlide: 'SLIDE_SHOW',
    zoomIn: 'ZOOM_IN',
    zoomOut: 'ZOOM_OUT',
    reset: 'RESET'
};
