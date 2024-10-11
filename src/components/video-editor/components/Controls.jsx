import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import VideoEditingTimeline from "video-editing-timeline-react";
// import Time from './Time';
// import Play from './Play';
import Seek from "./Seek";

const Controls = function (props) {
  const children = [<Seek />];
  const [config, setConfig] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)

  const [videoCurrentTime, videoDuration, thumbs] =
    useSelector((state) => [
      state.video_currenttime,
      state.video_duration,
      state.thumbs_url,
    ]);
  
  useEffect(() => {
    if (videoDuration != 0) {
      setConfig({
        mode: "stander",
        canvasWidth: 60 * videoDuration * (props.scale / 20 + 1),
        canvasHeight: 45,
        minimumScale: 5 * (props.scale / 20 + 1),
        minimumScaleTime: 0.1
      });
    }
  }, [videoDuration, props.scale]);

  useEffect(() => {
    const widthScale = 50 * (props.scale / 20 + 1)
    const interval = document.getElementById("controlBox").offsetWidth * 0.8 / widthScale

    if (videoCurrentTime == videoDuration || videoCurrentTime == 0) {
      setCurrentTime(0)
      document.getElementById("controlBox").scrollLeft = 0;
    }
    if (videoCurrentTime - currentTime > interval) {
      setCurrentTime(videoCurrentTime)
      document.getElementById("controlBox").scrollLeft += widthScale * interval;
    }
  }, [videoCurrentTime])

  return (
    <div className="overflow-x-scroll" id="controlBox">
      {config && <VideoEditingTimeline config={config} id="timeline" />}
      {config && <div className="video-controls video__controls" style={{width: 50 * videoDuration}}> 
        {children.map((child, i) => {
          return React.cloneElement(child, { ...props, key: i, scale: 5 * (props.scale / 20 + 1), thumbs: thumbs });
        })}
      </div>}
    </div>
  );
};

export default Controls;
