import React from 'react';
import ProgressBar from './ProgressBar';
import CropMarker from './CropMarker';
import { cropChanged } from '../../../redux/actions/actionCreators';
import CaptionBox from '../../../components/captionBox';
import TransThumbnail from '../../../assets/empty-thumbnail.png';
import PropTypes from 'prop-types';
import AudioTrack from '../components/AudioTrack'

class Seek extends React.Component {
  constructor(props) {
    super(props);
    this.rangebar = React.createRef();

    this.state = {
      focused: false,
      rangeWidth: 0,
    };
  }

  seek = (e) => {
    this.props.seek((e.target.value * this.props.duration) / 100);
  };

  onFocus = () => {
    this.setState({
      focused: true,
    });
  };

  cropsChanged = (where, position) => {
    this.props.store.dispatch(cropChanged(where, position));
    return position;
  };

  handleResize = () => {
    this.setState({ rangeWidth: this.rangebar.current.offsetWidth });
  };

  componentDidMount() {
    this.setState({ rangeWidth: this.rangebar.current.offsetWidth });
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <div
        className={
          'video-seek video__control' +
          (this.state.focused ? ' video__control--focused' : '')
        }
      >
        <div>
          {this.props.showCaption && (
            <CaptionBox
              duration={this.props.duration}
              captions={this.props.info.captions || []}
            />
          )}
        </div>

        <div className="video-seek__container">
          <div>
            <div className="flex h-full">
              {[...Array(this.props.info.thumbsSize)]
                .filter((_, index) => index % (30 / this.props.scale) == 0)
                .map((_, key) => {
                if (this.props.thumbs[key]) {
                  return (
                    <img
                      className="h-full"
                      key={`thumbnail_image_${key}`}
                      src={this.props.thumbs[key * (30 / this.props.scale)]}
                      style={{ width: `${100 / Math.floor(this.props.duration)}%`, height: "50px"}}
                    />
                  );
                }
                return (
                  <img
                    key={`thumbnail_image_${key}`}
                    src={TransThumbnail}
                    style={{ width: `${100 / Math.ceil(this.props.duration)}%`, height: "50px"}}
                  />
                );
              })}
            </div>
            <div
              className="video-seek__buffer-bar"
              ref={this.rangebar}
            >
              <div
                className={`absolute bg-[#00000099] top-[4px] bottom-[4px]`}
                style={{
                  left: `15px`,
                  right: `calc(100% - ${
                    (this.props.crop_start * (this.state.rangeWidth - 30)) / 100 +
                    15
                  }px)`,
                }}
              />
              <div
                className={`absolute border-y-4 border-[#0075FF] top-0 bottom-0`}
                style={{
                  left: `${
                    (this.props.crop_start * (this.state.rangeWidth - 30)) / 100 +
                    15
                  }px`,
                  right: `calc(100% - ${
                    (this.props.crop_end * (this.state.rangeWidth - 30) * this.props.scale / 5) / 100 + 15
                  }px)`,
                }}
              />
              <div
                className={`absolute bg-[#00000099] top-[4px] bottom-[4px]`}
                style={{
                  left: `${
                    (this.props.crop_end * (this.state.rangeWidth - 30) * this.props.scale / 5) / 100 + 15
                  }px`,
                  right: `15px`,
                }}
              />
              <CropMarker
                parentWidth={this.state.rangeWidth - 30}
                position={
                  (this.props.crop_start * (this.state.rangeWidth - 30)) / 100
                }
                isStart={true}
                cropsChanged={this.cropsChanged}
              />
              <CropMarker
                parentWidth={this.state.rangeWidth - 30}
                position={
                  (this.props.crop_end * (this.state.rangeWidth - 30) * this.props.scale / 5) / 100 + 15
                }
                isStart={false}
                cropsChanged={this.cropsChanged}
              />
            </div>
            <ProgressBar
              onFocus={this.onFocus}
              onChange={this.seek}
              progress={this.props.percentagePlayed * this.props.scale / 5}
            />
          </div>
          <AudioTrack scale={this.props.scale} />
        </div>
      </div>
    );
  }
}

Seek.propTypes = {
  seek: PropTypes.func,
  percentageBuffered: PropTypes.number,
  percentagePlayed: PropTypes.number,
  duration: PropTypes.number,
};

Seek.defaultProps = {
  percentageBuffered: 0,
  percentagePlayed: 0,
};

export default Seek;
