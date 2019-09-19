import React from 'react';

export default class BottomPanel extends React.Component {
    render() {
        return (
            <div id="bottom-panel" className="horizontal-panel">
                <div id="bottom-panel-head" className="panel-head">
                    <div
                        id="bottom-panel-progress-bar"
                        style={{
                            width: this.props.presentation.presentationProgress + '%'
                        }}
                    />
                    <div
                        id="gestures-help-text"
                        className={(!this.props.presentation.isPresentationLoaded ? ' hidden' : '')}>
                        Swipe here to change slide
                    </div>
                    <div className="panel-controls-group panel-controls-group-left">
                        <div
                            className={'control-button smaller fas fa-search-minus' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '') + (!this.props.presentation.isZoomedIn ? ' active' : '')}
                            onClick={() => this.props.zoomOutOnCurrentSlide()}
                            title="Zoom out"
                        />
                    </div>
                    <div className="panel-controls-group panel-controls-group-right">
                        <div
                            className={'control-button smaller fas fa-search-plus' + (!this.props.presentation.isPresentationLoaded ? ' hidden' : '') + (this.props.presentation.isZoomedIn ? ' active' : '')}
                            onClick={() => this.props.zoomInOnCurrentSlide()}
                            title="Zoom in"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
