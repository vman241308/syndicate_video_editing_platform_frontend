import React from 'react';
// @ts-ignore
import Html5VideoEditor from './video-editor';
import styled from 'styled-components';
import posterImg from '../assets/poster.png';

interface VideoEditorProps {
  info: VideoInfo;
  poster?: String;
  showCaption: boolean;
  // showSubTitle: string;
}

const StyledVideoEditor = styled.div``;

const VideoEditor: React.FC<VideoEditorProps> = (props: VideoEditorProps) => {
  return (
    <StyledVideoEditor className="w-full relative pb-[115px]">
      <img src={posterImg}></img>
      <Html5VideoEditor
        info={props.info}
        poster={posterImg}
        showCaption={props.showCaption}
      />
    </StyledVideoEditor>
  );
};

export default VideoEditor;
