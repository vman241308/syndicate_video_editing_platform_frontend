import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const VIDEO_EVENTS = [
  'onAbort',
  'onCanPlay',
  'onCanPlayThrough',
  'onDurationChange',
  'onEmptied',
  'onEncrypted',
  'onEnded',
  'onError',
  'onLoadedData',
  'onLoadedMetadata',
  'onLoadStart',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onSeeked',
  'onSeeking',
  'onStalled',
  'onSuspend',
  'onTimeUpdate',
  'onVolumeChange',
  'onWaiting',
];

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkState: 0,
      paused: !props.autoPlay,
      muted: !!props.muted,
      volume: 1,
      error: false,
      loading: false,
    };

    this.videoProps = Object.assign(
      {},
      ...Object.keys(props)
        .filter(
          (p) =>
            ![
              'store',
              'crops',
              'dispatch',
              'children',
              'onTimeUpdate',
              'childRef',
            ].includes(p)
        )
        .map((k) => ({ [k]: props[k] }))
    );

    // this.props.childRef = React.createRef();
  }

  componentWillMount() {
    this.mediaEventProps = VIDEO_EVENTS.reduce((mediaProps, eventName) => {
      mediaProps[eventName] = (event) => {
        if (
          eventName in this.props &&
          typeof this.props[eventName] === 'function'
        ) {
          this.props[eventName](event);
        }
        this.updateStateFromVideo();
        this.props.dispatch({
          type: 'VIDEO',
          name: event.type,
        });
      };
      return mediaProps;
    }, {});
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.dispatch({
      type: 'VIDEO_CURRENTTIME',
      currentTime: this.state.currentTime,
    });
    this.props.dispatch({
      type: 'VIDEO_DURATION',
      videoDuration: this.state.duration,
    });
    return null;
  }

  togglePlay = () => {
    console.log('Toggle Play');
    if (this.state.paused) {
      this.props.childRef.current.play();
    } else {
      this.props.childRef.current.pause();
    }
  };

  toggleMute() {
    this.props.childRef.current.muted = !this.state.muted;
  }

  load() {
    this.props.childRef.current.load();
  }

  seek = (time) => {
    this.props.childRef.current.currentTime = time;
  };

  setVolume(volume) {
    this.props.childRef.current.volume = volume;
  }

  updateStateFromVideo() {
    if (
      (this.props.childRef.current.currentTime /
        this.props.childRef.current.duration) *
        100 >
      this.props.crop_end
    ) {
      this.props.childRef.current.currentTime =
        (this.props.crop_start / 100) * this.props.childRef.current.duration;
    }
    if (
      Number(
        (
          (this.props.childRef.current.currentTime /
            this.props.childRef.current.duration) *
          100
        ).toFixed(5)
      ) < Number(this.props.crop_start.toFixed(5))
    ) {
      this.props.childRef.current.currentTime =
        Number(
          (
            (this.props.crop_start / 100) *
            this.props.childRef.current.duration
          ).toFixed(5)
        ) + 0.00001;
    }
    this.setState({
      // Standard video properties
      duration: this.props.childRef.current.duration,
      currentTime: this.props.childRef.current.currentTime,
      buffered: this.props.childRef.current.buffered,
      paused: this.props.childRef.current.paused,
      muted: this.props.childRef.current.muted,
      volume: this.props.childRef.current.volume,
      readyState: this.props.childRef.current.readyState,

      // Non-standard state computed from properties
      percentageBuffered:
        this.props.childRef.current.buffered &&
        this.props.childRef.current.buffered.length &&
        (this.props.childRef.current.buffered.end(
          this.props.childRef.current.buffered.length - 1
        ) /
          this.props.childRef.current.duration) *
          100,
      percentagePlayed: this.props.childRef.current.currentTime
        ? (this.props.childRef.current.currentTime /
            this.props.childRef.current.duration) *
          100
        : 0,
      error:
        this.props.childRef.current.networkState ===
        this.props.childRef.current.NETWORK_NO_SOURCE,
      loading:
        this.props.childRef.current.readyState <
        this.props.childRef.current.HAVE_FUTURE_DATA, // 0: HAVE_NOTHING, 1: HAVE_METADATA, 2: HAVE_CURRENT_DATA, 3: HAVE_FUTURE_DATA, 4: HAVE_ENOUGH_DATA
    });
  }

  renderControls() {
    const extendedProps = Object.assign(
      {
        // The public methods that all controls should be able to use.
        togglePlay: this.togglePlay,
        toggleMute: this.toggleMute,
        play: this.play,
        pause: this.pause,
        seek: this.seek,
        fullscreen: this.fullscreen,
        setVolume: this.setVolume,
      },
      this.state,
      this.props
    );

    return React.Children.map(this.props.children, (child, i) => {
      if (!child) return;
      if (child.type === 'source' || child.type === 'track') {
        return;
      }
      return React.cloneElement(child, extendedProps);
    });
  }

  renderSources() {
    return React.Children.map(this.props.children, (child, i) => {
      if (!child) return;
      if (child.type !== 'source' && child.type !== 'track') {
        return;
      }
      return child;
    });
  }

  getVideoClassName() {
    let classString = 'video';

    if (this.state.error) {
      classString += ' video--error';
    } else if (this.state.loading) {
      classString += ' video--loading';
    } else if (this.state.paused) {
      classString += ' video--paused';
    } else {
      classString += ' video--playing';
    }

    if (this.state.focused) {
      classString += ' video--focused';
    }
    return classString;
  }

  onFocus = () => {
    this.setState({
      focused: true,
    });
  };

  render() {
    return (
      <div
        className={this.getVideoClassName()}
        tabIndex="0"
        onFocus={this.onFocus}
      >
        <video
          preload={'metadata'}
          className={'video__el'}
          {...this.videoProps}
          {...this.mediaEventProps}
          ref={this.props.childRef}
        >
          {this.renderSources()}
        </video>
        {this.renderControls()}
      </div>
    );
  }
}

Video.propTypes = {
  children: PropTypes.node,
  autoPlay: PropTypes.bool,
  muted: PropTypes.bool,
  controls: PropTypes.bool,
  onTimeUpdate: PropTypes.func,
};

Video.defaultProps = {
  onTimeUpdate: (e) => {
    // console.log(e);
    // console.log(this.props.childRef);
  },
};

export default Video;

function mapStateToProps(state) {
  return {
    crop_start: state.crop_start,
    crop_end: state.crop_end,
  };
}
export const RdxVideo = connect(mapStateToProps)(Video);
