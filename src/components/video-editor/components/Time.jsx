import React from 'react';
import PropTypes from 'prop-types';

class Time extends React.Component {
  /**
   * As controls receive all props for extensibility, we do a quick
   * check and make sure only the props we care about have changed.
   * @param  {object} nextProps The next props from parent
   * @return {boolean}          Whether we re-render or not
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.currentTime !== nextProps.currentTime ||
      this.props.duration !== nextProps.duration
    );
  }

  /**
   * Formats time into a friendlier format
   * @param  {number} seconds Time in seconds
   * @return {string}         Timestamp in the format of HH:MM:SS
   */
  formatTime(seconds) {
    var date = new Date(null);
    seconds = isNaN(seconds) ? 0 : Math.floor(seconds);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  render() {
    return (
      <div className="video-time video__control">
        <span className="video-time__current">
          {this.formatTime(this.props.currentTime)}
        </span>
        /
        <span className="video-time__duration">
          {this.formatTime(this.props.duration)}
        </span>
      </div>
    );
  }
}

Time.propTypes = {
  currentTime: PropTypes.number,
  duration: PropTypes.number,
};

export default Time;
