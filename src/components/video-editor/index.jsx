import React, { useEffect, useRef, useState } from 'react';
import { Slider } from 'rsuite';
import { RdxVideo } from './components/Video';
import Controls from './components/Controls';
import Overlay from './components/Overlay';
import store from '../../redux/store';
import SubtitlesOctopus from '../../assets/js/libass/subtitles-octopus';
import './css/custom.css';
import './css/slider.less';

let octopusInstance;
const VideoEditor = ({ info, type, poster, showCaption, ...rest }) => {
  const videoRef = useRef(null);
  const [value, setValue] = useState(0)

  const handleKeyPress = (event) => {
    if (event.key === "I") {
      // Zoom in
      if (value < 100) {
        setValue(value + 20)
      }
    } else if (event.key === "O") {
      // Zoom out
      if (value > 0) {
        setValue(value - 20)
      }
    }
  };

  useEffect(() => {
    if (!info.captions) return;
    if (octopusInstance) {
      octopusInstance.dispose();
      octopusInstance = null;
    }
    if (videoRef.current && showCaption) {
      var options = {
        video: videoRef.current,
        renderMode: 'wasm-blend',
        subUrl: info.subtitles?.url,
        fonts: info.fonts,
        lazyFileLoading: false,
        workerUrl: new URL(
          '../../assets/js/libass/subtitles-octopus-worker.js',
          import.meta.url
        ),
      };
      octopusInstance = new SubtitlesOctopus(options); // You can experiment in console
    }
  }, [videoRef?.current, showCaption, info.subtitles?.url, info.fonts]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [value]);

  return (
    <RdxVideo
      loop
      poster={poster}
      store={store}
      info={info}
      {...rest}
      showcaption="true"
      crossOrigin="anonymous"
      childRef={videoRef}
    >
      <Overlay />
      <Controls showCaption={showCaption} scale={value} />
      <source src={info.videoUrl} type={type || 'video/mp4'} />
      <Slider
        progress
        defaultValue={0}
        value={value}
        onChange={(val) => { 
          setValue(val)
        }}
        step={20}
        className="w-1/4 m-2"
      />
      {/* {showCaption && (
        <track
          label="English"
          kind="subtitles"
          srcLang="en"
          src={info.subtitles?.url || ''}
          mode="showing"
          default
        />
      )} */}
    </RdxVideo>
  );
};

export default VideoEditor;
