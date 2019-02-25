import React from 'react';

export default class Loading extends React.Component {
    render() {
        return (
            <div
                id="presentation-loading"
                className={this.props.isLoading ? 'loading' : ''}>
                <div id="presentation-loading-content">
                    <div id="presentation-loading-animation">
                        <div className="sheet sheet-one" />
                        <div className="sheet sheet-two" />
                        <div className="sheet sheet-three" />
                        <div className="sheet sheet-four" />
                    </div>
                    <div id="presentation-loading-text">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }
}
