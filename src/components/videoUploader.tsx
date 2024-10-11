import React, { useState, useCallback, SetStateAction } from 'react';
import posterImg from '../assets/poster.png';
import Icon from '../icons';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { uploadToS3 } from '../services/aws';

// @ts-ignore
import ThumbnailExtractor from './thumbnailExtractor';

import 'react-circular-progressbar/dist/styles.css';
import { Progress } from 'aws-sdk/lib/request';

interface VideoUploaderProps {
  onUploadedVideo: Function;
  className?: string;
}
const StyledDropzone = styled.div`
  width: 100%;
  svg.a {
    width: 20%;
    min-width: 50px;
  }
  svg.b {
    width: 9%;
    min-width: 50px;
  }
`;

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadedVideo,
  ...rest
}: VideoUploaderProps) => {
  const dispatch = useDispatch();
  const [uploadStatus, setUploadStatus] = useState(0);
  const [acceptedFile, setAcceptedFile] = useState<File>();
  const [acceptedFileURL, setAcceptedFileURL] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [duration, setDuration] = useState(0)

  // const dataURItoBlob = (dataURI: String) => {
  //   var binary = atob(dataURI.split(',')[1]);
  //   var array = [];
  //   for (var i = 0; i < binary.length; i++) {
  //     array.push(binary.charCodeAt(i));
  //   }
  //   return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  // };

  const onExtractedThumbnails = async (images: Array<String>) => {
    console.log(images);
    const videoId = uuid();
    const details: VideoInfo = {
      id: videoId,
      mimeType: acceptedFile?.type || '',
      videoUrl: '',
      thumbs: [],
      thumbsSize: Math.floor(duration!) * 6,
    };

    const fileName = acceptedFile?.name;
    const parts = fileName?.split('.');
    const ext = parts ? parts[1] : '';
    let progressPercentage = 0;

    const onProgressVideo = (progress: Progress) => {
      progressPercentage = Math.round((progress.loaded / progress.total) * 100); // this '90' means the status of completed uploading video.

      setUploadStatus(progressPercentage);
    };

    // const onProgressThumbs = (progress: Progress) => {
    //   tempPercentage += (progress.loaded / progress.total) * 10 / details.thumbsSize
    //   progressPercentage = Math.round(tempPercentage);
    //   setUploadStatus(progressPercentage);
    // };

    setUploading(true);
    await uploadToS3(
      `origin/${videoId}.${ext}`,
      acceptedFile as Blob,
      onProgressVideo
    )
      .then((data: { Location: string }) => {
        details.videoUrl = data.Location.replace(
          `${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${
            import.meta.env.VITE_AWS_BUCKET_REGION
          }.amazonaws.com`,
          import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN
        );
      })
      .catch((err: SetStateAction<null>) => {
        setUploading(false);
        setErrorMessage(err);
        setUploadStatus(0);
      });
    dispatch({
      type: 'THUMBS_URL',
      thumbs_url: images,
    })
    onUploadedVideo(details);
  };
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    getDuration(file);
    setAcceptedFile(file);

    const fileURL = file
      ? (window.URL || window.webkitURL).createObjectURL(file)
      : undefined;
    setAcceptedFileURL(fileURL);
  }, []);

  const getDuration = (file: any) => {
    var video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src);
      setDuration(video.duration)
      if (video.duration < 1) {
        return;
      }
    }
    video.src = URL.createObjectURL(file);
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': [],
    },
    maxFiles: 1,
    multiple: false,
    disabled: uploading,
    onDrop,
  });

  const acceptedFileType = acceptedFile?.type;

  return (
    <StyledDropzone {...rest}>
      <div className="w-full h-full relative">
        <img src={posterImg} className="w-full rounded-md" />
        <div
          {...getRootProps({
            className:
              'dropzone absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center',
          })}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <CircularProgressbar
              className="a"
              value={uploadStatus}
              text={`${uploadStatus}%`}
              strokeWidth={3}
              styles={buildStyles({
                textColor: 'white',
                pathColor: 'white',
                trailColor: '#2e2e2e',
              })}
            />
          ) : (
            <>
              <Icon className={'b'} name={errorMessage ? 'error' : 'upload'} />
              <label>
                {errorMessage
                  ? `${errorMessage}. Upload video again!`
                  : 'Upload Video'}
              </label>
            </>
          )}
        </div>
      </div>
      <div className="h-[115px] relative">
        {duration > 0 && <ThumbnailExtractor
          onComplete={onExtractedThumbnails}
          fileURL={acceptedFileURL}
          fileType={acceptedFileType}
          minWidth={80}
          minHeight={80}
          count={Math.floor(duration) * 6}
        />}
        <div className="h-[35px]"></div>
        <div className="w-full h-[80px] relative">
          <div
            className="absolute border-y-4 border-[#0075FF] top-0 bottom-0"
            style={{ left: '15px', right: '15px' }}
          ></div>
          <div className="start_marker draggable_start left-0">
            <Icon name="startMarker" />
          </div>
          <div className="end_marker draggable_end right-0">
            <Icon name="endMarker" />
          </div>
        </div>
      </div>
    </StyledDropzone>
  );
};

export default VideoUploader;
