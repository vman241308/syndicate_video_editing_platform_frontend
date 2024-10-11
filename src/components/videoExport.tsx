import React, { useEffect, useRef, useState } from 'react';
import Icon from '../icons';
import styled from 'styled-components';
import posterImg from '../assets/poster.png';
import { useSelector } from 'react-redux';
import ShareModal from './shareModal';
// @ts-ignore
import SubtitlesOctopus from '../assets/js/libass/subtitles-octopus';
import { uploadToS3 } from '../services/aws';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AssTime } from '../services/ass-builder';
import uuid from 'react-uuid';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

let streamCapture: any;
let keepAliveInterval: number;
let octopusInstance: SubtitlesOctopus;
const drawCanvasWorker = new Worker(
  new URL('./videoExportWorker.js', import.meta.url),
  { type: 'module' }
);

const StyledVideoEditor = styled.div`
  width: 100%;
  background: var(--light-navy);
  border-radius: 12px;

  button {
    padding: 10px;
  }

  svg:not(.a) {
    width: 20px;
    height: 20px;
    color: white;

    &:hover {
      backround: var(--lightest-navy);
    }
  }

  svg.a {
    width: 20%;
    min-width: 50px;
  }
`;

interface VideoExportProps {
  sourceInfo?: VideoInfo;
  captionStyle: CaptionStyle;
  onGenerateAssContent: Function;
}

const VideoExport = ({
  sourceInfo,
  captionStyle,
  onGenerateAssContent,
}: // onShowSmCaption,
VideoExportProps) => {
  const [videoCurrentTime, showCaption, cropStart, cropEnd, videoDuration] =
    useSelector((state: any) => [
      state.video_currenttime,
      state.caption_visible,
      state.crop_start,
      state.crop_end,
      state.video_duration,
    ]);
  const [laptop, setLaptop] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [publishMediaURL, setPublishMediaURL] = useState<string>('');
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [sharing, setSharing] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [subtitle, setSubtitle] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLCanvasElement>(null);
  const [process, setProcess] = useState<string>('');

  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket<{
    event: string;
    key: string;
  }>(
    import.meta.env.VITE_WEBSOCKET_ENDPOINT,
    {
      // console.log(sendJsonMessage);
      // shouldReconnect: () => true,
      // onOpen: console.log,
      // onClose: console.log,
      // onError: (evt) => {
      //   console.log(evt);
      //   setExporting(false);
      // },
      // retryOnError: true,
      // onMessage: console.log,
    },
    exporting
  );

  const initCanvas = () => {
    if (!canvasRef.current) return;
    try {
      // if (videoWidth > videoHeight) {
      //   // @ts-ignore
      //   canvsetDownloadingasRef.current.width = videoWidth;
      //   // @ts-ignore
      //   canvasRef.current.height = (videoWidth * 9) / 16;
      // } else {
      //   // @ts-ignore
      //   canvasRef.current.width = (videoHeight * 16) / 9;
      //   // @ts-ignore
      //   canvasRef.current.height = videoHeight;
      // }
      canvasRef.current.width = 1920;
      canvasRef.current.height = 1080;
    } catch (e) {}
  };

  const drawCanvas = () => {
    streamCapture
      .grabFrame()
      .then((imageBitmap: ImageBitmap) => {
        drawCanvasWorker.postMessage({ imageBitmap }, [imageBitmap]);
      })
      .catch((e: Error) => {});

    requestAnimationFrame(drawCanvas);
  };

  const initCaptureStream = () => {
    const videoElem = document.getElementsByClassName(
      'video__el'
    )[0] as HTMLVideoElement & {
      captureStream(frameRate?: number): MediaStream;
    };
    if (videoElem) {
      videoElem.onloadstart = () => {
        setVideoLoaded(false);
      };

      videoElem.onloadedmetadata = () => {
        setVideoLoaded(true);
        console.log('Initializing capture stream');

        const stream = videoElem.captureStream();
        const [track] = stream.getVideoTracks();
        //@ts-ignore
        streamCapture = new ImageCapture(track);
        setVideoWidth(videoElem.videoWidth);
        setVideoHeight(videoElem.videoHeight);
      };

      videoElem.onplay = () => {
        try {
          if (canvasRef && canvasRef.current) {
            const offscreen = canvasRef.current.transferControlToOffscreen();
            drawCanvasWorker.postMessage({ offscreen }, [offscreen]);
            requestAnimationFrame(drawCanvas);
          }
        } catch (e) {}
      };
    } else {
      window.setTimeout(initCaptureStream, 0);
    }
  };

  // const handleGenSMCaption = () => {
  //   let start = Number(((videoDuration / 100) * cropStart).toFixed(3));
  //   let end = Number(((videoDuration / 100) * cropEnd).toFixed(3));
  //   onShowSmCaption(start, end);
  // };

  const handleExport = () => {
    if (keepAliveInterval !== undefined) {
      window.clearInterval(keepAliveInterval);
    }
    setExporting(true);
    keepAliveInterval = window.setInterval(() => {
      sendJsonMessage({ action: 'refresh' });
    }, 28000);
  };

  const handleDownload = (key: string | undefined = undefined) => {
    setProcess('0');
    if (key) {
      setDownloading(false);
      const link = document.createElement('a');
      link.href = `https://${
        import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN
      }/${key}`;
      link.setAttribute('download', `${key.replace('/', '-')}`);
      // Start download
      link.click();
    } else if (videoLoaded === true) {
      setDownloading(true);
      handleExport();
    }
  };

  const handlePublish = (key: string | undefined = undefined) => {
    setProcess('0');
    if (key) {
      const mediaLink = `https://${
        import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN
      }/${key}`;
      setPublishMediaURL(mediaLink);
      setShowModal(true);
    } else if (videoLoaded === true) {
      setPublishing(true);
      handleExport();
    }
  };

  const handleProgress = (FfmpegProcess: string | undefined = undefined) => {
    if (FfmpegProcess) {
      setProcess(FfmpegProcess);
      console.log('process ---->', process);
    }
  };

  const onClose = () => {
    setShowModal(!showModal);
    setPublishing(false);
  };

  useEffect(() => {
    console.log(readyState);
    if (readyState == ReadyState.OPEN) {
      const start = Number(((videoDuration / 100) * cropStart).toFixed(3));
      const end = Number(((videoDuration / 100) * cropEnd).toFixed(3));
      const content = onGenerateAssContent(start, end);
      const resultId = uuid();
      uploadToS3(`subtitles/${resultId}.ass`, content).then(() => {
        sendJsonMessage({
          action: 'exportVideo',
          video_key: sourceInfo?.videoUrl?.replace(
            `https://${import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN}/`,
            ''
          ),
          ass_key: `subtitles/${resultId}.ass`,
          start_time: new AssTime(start * 1000).toString(),
          end_time: new AssTime(end * 1000).toString(),
          iw: '' + videoWidth,
          ih: '' + videoHeight,
          sw: '' + captionRef.current?.width || 1920,
          sh: '' + captionRef.current?.height || 1080,
        });
      });
    }
  }, [readyState]);

  useEffect(() => {
    console.log(lastJsonMessage);
    if (lastJsonMessage?.event === 'EXPORTED_VIDEO') {
      if (keepAliveInterval !== undefined) {
        window.clearInterval(keepAliveInterval);
      }
      setExporting(false);
      if (downloading) {
        handleDownload(lastJsonMessage.key);
      }
      if (publishing) {
        handlePublish(lastJsonMessage.key);
      }
    } else if (lastJsonMessage?.event === 'Running FFmpeg') {
      if (downloading) {
        handleProgress(lastJsonMessage.key);
      }
      if (publishing) {
        handleProgress(lastJsonMessage.key);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    initCanvas();
  }, [canvasRef.current, videoWidth, videoHeight]);

  useEffect(() => {
    if (sourceInfo) {
      initCaptureStream();
    }
  }, [sourceInfo?.id]);

  useEffect(() => {
    if (octopusInstance) {
      octopusInstance.setCurrentTime(videoCurrentTime);
    }
  }, [videoCurrentTime]);

  useEffect(() => {
    drawCanvasWorker.postMessage({ subtitle, captionStyle, showCaption });
  }, [subtitle, captionStyle, showCaption]);

  useEffect(() => {
    if (!sourceInfo?.captions) return;
    if (octopusInstance) {
      octopusInstance.dispose();
      octopusInstance = null;
    }
    if (captionRef.current && showCaption) {
      var options = {
        canvas: captionRef.current,
        renderMode: 'wasm-blend',
        subUrl: sourceInfo?.subtitles?.url,
        fonts: sourceInfo?.fonts,
        lazyFileLoading: false,
        workerUrl: new URL(
          '../assets/js/libass/subtitles-octopus-worker.js',
          import.meta.url
        ),
      };
      octopusInstance = new SubtitlesOctopus(options); // You can experiment in console
    }
  }, [
    captionRef?.current,
    showCaption,
    sourceInfo?.subtitles?.url,
    sourceInfo?.fonts,
    mobile,
  ]);

  return (
    <StyledVideoEditor>
      <div className="flex-col justify-between pt-[12px] pb-[12px] space-y-[12px]">
        <div className="flex justify-center relative">
          <img src={posterImg} className=" rounded-[4px] w-4/5"></img>
          {exporting ? (
            <div className="w-4/5 h-full absolute bg-[#000d] z-10 flex flex-col justify-center items-center">
              <CircularProgressbar
                className="a"
                value={parseInt(process)}
                text={`${parseInt(process)}%`}
                strokeWidth={3}
                styles={buildStyles({
                  textColor: 'white',
                  pathColor: 'white',
                  trailColor: '#2e2e2e',
                })}
              />
            </div>
          ) : null}
          <canvas
            ref={canvasRef}
            className="w-4/5 h-full bg-[#5A657C] rounded-[4px] absolute"
          ></canvas>
          <canvas
            ref={captionRef}
            className="h-full bg-[#00000000] rounded-[4px] absolute"
            width={mobile ? 1080 : 1920}
            height={mobile ? 1920 : 1080}
          ></canvas>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className={laptop ? 'selected' : ''}
            onClick={() => {
              setLaptop(true);
              setMobile(false);
              drawCanvasWorker.postMessage({ isMobile: 'false' });
            }}
          >
            <Icon name="laptop" />
          </button>
          <button
            className={mobile ? 'selected' : ''}
            onClick={() => {
              setMobile(true);
              setLaptop(false);
              drawCanvasWorker.postMessage({ isMobile: 'true' });
            }}
          >
            <Icon name="mobile" />
          </button>
          {/* <button
            className="bg-[#2e2e2e] border-solid border-[1px] border-white justify-center rounded-[4px]"
            onClick={handleGenSMCaption}
          >
            <p className="text-[14px] ">Generate SM Caption</p>
          </button> */}
          <button
            onClick={() => {
              handlePublish();
              handleProgress();
            }}
            disabled={exporting}
          >
            {publishing ? <Icon name="spinner1" /> : <Icon name="share" />}
          </button>
          {showModal && (
            <ShareModal
              mediaLink={publishMediaURL}
              onShared={() => {
                setPublishMediaURL('');
                setPublishing(false);
                setSharing(false);
              }}
              onClose={onClose}
            />
          )}
          <button
            onClick={() => {
              handleDownload();
              handleProgress();
            }}
            disabled={exporting}
          >
            {downloading ? <Icon name="spinner1" /> : <Icon name="download" />}
          </button>
        </div>
      </div>
    </StyledVideoEditor>
  );
};

export default VideoExport;
