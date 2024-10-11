import React from 'react';
import Icon from './Icon';
import Spinner from './Spinner';
import PropTypes from 'prop-types';

class Overlay extends React.Component {
  renderContent() {
    let content;
    if (this.props.error) {
      content = (
        <div className="video-overlay__error">
          <p className="video-overlay__error-text">{this.props.error}</p>
        </div>
      );
    } else if (this.props.loading) {
      content = (
        <div className="video-overlay__loader">
          <Spinner />
        </div>
      );
    } else {
      content = (
        <div>
          <div
            className="video-overlay__pic"
            onClick={() => {
              if (!this.props.paused) {
                this.props.togglePlay();
              } else {
                this.props.togglePlay();
              }
            }}
          >
            {this.props.paused && <Icon name="play-1" />}
          </div>
        </div>
      );
    }
    return content;
  }

  render() {
    return <div className="video-overlay">{this.renderContent()}</div>;
  }
}

Overlay.propTypes = {
  error: PropTypes.bool,
  togglePlay: PropTypes.func,
  paused: PropTypes.bool,
  loading: PropTypes.bool,
};

export default Overlay;
