import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SmCaptionStyle from '../components/smCaptionStyle';
import VideoEditor from '../components/videoEditor';
import TranscriptionSummary from '../components/transcriptionSummary';
import VideoExport from '../components/videoExport';
import VideoUploader from '../components/videoUploader';
import { subtitles } from '../services/subtitles';
import Icon from '../icons';
// @ts-ignore
import parseSRT from 'parse-srt';

import styled from 'styled-components';
import useWebSocket, { ReadyState } from 'react-use-websocket';

let keepAliveInterval: number;

const StyledHomeDiv = styled.div`
  display: grid;

  grid-template-rows: repeat(6, minmax(0px, max-content));
  .video-editor {
    min-height: 204px;
    padding: 2% 1% 3% 1%;
    order: 1;
  }
  .video-export {
    min-height: 168px;
    padding: 2% 1% 2% 1%;
    order: 2;
  }
  .transcription-blog {
    min-height: 236px;
    padding: 2% 1% 2% 2%;
    order: 4;
  }
  .sm-caption-style {
    min-height: 390px;
    padding: 4% 1% 1% 1%;
    order: 3;
  }

  @media (min-width: 460px) {
    grid-template-rows: repeat(4, minmax(0px, max-content));
    grid-template-columns: repeat(12, minmax(0px, 1fr));
    .video-editor {
      grid-column: span 12 / span 12;
      min-height: 260px;
      padding: 1% 1% 3% 1%;
      order: 1;
    }
    .video-export {
      grid-column: span 12 / span 12;
      min-height: 250px;
      padding: 2% 1% 2% 1%;
      order: 3;
    }
    .transcription-blog {
      grid-column: span 12 / span 12;
      min-height: 200px;
      padding: 1% 1% 1% 1%;
      order: 2;
    }
    .sm-caption-style {
      grid-column: span 12 / span 12;
      min-height: 200px;
      padding: 1% 1% 1% 1%;
      order: 4;
    }
  }
  @media (min-width: 720px) {
    grid-template-rows: repeat(3, minmax(0px, max-content));
    grid-template-columns: repeat(6, minmax(0px, 1fr));
    .video-editor {
      grid-column: span 6 / span 6;
      min-height: 390px;
      padding: 2% 1% 2% 1%;
      order: 1;
    }
    .transcription-blog {
      grid-column: span 6 / span 6;
      min-height: 236px;
      padding: 2% 1% 2% 1%;
      order: 2;
    }
    .video-export {
      grid-column: span 6 / span 6;
      min-height: 200px;
      padding: 2% 1% 2% 1%;
      order: 3;
    }
    .sm-caption-style {
      grid-column: span 6 / span 6;
      min-height: 200px;
      padding: 2% 1% 2% 1%;
      order: 4;
    }
  }
  @media (min-width: 1000px) {
    grid-template-rows: repeat(6, minmax(0px, max-content));
    grid-template-columns: 460fr 368fr 460fr;
    .video-editor {
      grid-row: span 4 / span 4;
      grid-column: span 2 / span 2;
      min-height: 390px;
      padding: 2% 1% 2% 3%;
      order: 1;
    }
    .video-export {
      grid-row: span 2 / span 2;
      grid-column: span 1 / span 1;
      min-height: 193px;
      padding: 3% 4% 4% 2%;
      order: 2;
    }
    .transcription-blog {
      grid-row: span 2 / span 2;
      grid-column: span 2 / span 2;
      min-height: 236px;
      padding: 10% 1% 2% 3%;
      order: 4;
    }
    .sm-caption-style {
      grid-row: span 4 / span 4;
      grid-column: span 1 / span 1;
      min-height: 433px;
      padding: 1% 4% 4% 2%;
      order: 3;
    }
  }
`;

let timeoutID: number | undefined;

const Home = () => {
  const dispatch = useDispatch();
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const [loadingSubtitles, setLoadingSubtitles] = useState<boolean>(false);
  const [showCC] = useSelector((state: any) => [state.caption_visible]);
  const [subtitle, setSubtitle] = useState<Array<Caption>>([]);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>({
    font: 'Poppins',
    fontSize: '48px',
    fontWeight: 'lighter', // lighter, bold, bolder
    italic: false,
    underline: false,
    textAlign: 'middle-center', // start, end, left, right, center
    style: 'default',
    capitalize: false,
    rmp: false,
  });

  const [transProcess, setTransProcess] = useState<string | number>(0);

  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket<{
    event: string;
    key: string;
    progress: string | number;
    audio: string;
  }>(
    import.meta.env.VITE_WEBSOCKET_ENDPOINT,
    {
      onOpen: () => {
        if (keepAliveInterval !== undefined) {
          window.clearInterval(keepAliveInterval);
        }
        keepAliveInterval = window.setInterval(() => {
          sendJsonMessage({ action: 'refresh' });
        }, 28000);
      },
      onClose: () => {
        window.clearInterval(keepAliveInterval);
      },
    },
    loadingSubtitles
  );

  const handleLoading = () => {
    setLoadingSubtitles(true);
  };

  const fetchSubtitles = async (subtitleUrl: string) => {
    if (!videoInfo) return;
    return fetch(subtitleUrl)
      .then((response) => {
        return response.text();
      })
      .then((data?) => {
        const captions = parseSRT(data);
        setVideoInfo({
          ...videoInfo,
          captions,
        });
      })
      .finally(() => {
        setTransProcess(0);
        setLoadingSubtitles(false);
      });
  };

  const onUploadedVideo = (details: VideoInfo) => {
    setVideoInfo(details);
    handleLoading();
  };

  useEffect(() => {
    if (subtitle.length === 0) setSubtitle(videoInfo?.captions || []);
  }, [videoInfo]);

  useEffect(() => {
    if (readyState == ReadyState.OPEN && loadingSubtitles)
      sendJsonMessage({
        action: 'uploadVideo',
        bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        key: videoInfo?.videoUrl.replace(
          `https://${import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN}/`,
          ''
        ),
      });
  }, [readyState, loadingSubtitles]);

  const genAssSubtitleContent = (start = 0, end = 0) => {
    return subtitles(subtitle || [], captionStyle, start, end);
  };

  // const changeSmCaption = (start = 0, end = 0) => {
  //   let content = '';
  //   if (subtitle) {
  //     for (let i = 0; i < subtitle.length; i++) {
  //       if (start + end !== 0 && subtitle[i].start < start) continue;
  //       if (start + end !== 0 && subtitle[i].start > end) continue;
  //       content += subtitle[i].text + ' ';
  //     }
  //   }

  //   setSMCaption(content);
  // };

  // const genSmCaption = (start = 0, end = 0) => {
  //   let content = '';
  //   if (subtitle) {
  //     for (let i = 0; i < subtitle.length; i++) {
  //       if (start + end !== 0 && subtitle[i].start < start) continue;
  //       if (start + end !== 0 && subtitle[i].start > end) continue;
  //       content += subtitle[i].text + ' ';
  //     }
  //   }
  //   return content;
  // };

  useEffect(() => {
    console.log(lastJsonMessage);
    if (lastJsonMessage?.event === 'TRANSCRIBING_SRT')
      setTransProcess(lastJsonMessage?.progress);
    if (lastJsonMessage?.event === 'TRANSCRIBING_SRT_ENDED') {
      fetchSubtitles(
        `https://${import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN}/${
          lastJsonMessage?.key
        }`
      );
    }
    if (lastJsonMessage?.event === 'UPLOADING_AUDIO') {
      const audioUrl = `https://${import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN}/${
        lastJsonMessage?.audio
      }`;
      dispatch({
        type: 'AUDIO_URL',
        audio_url: audioUrl,
      });
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (!videoInfo) return;
    let transcription = '';
    (subtitle || []).map((item: Caption) => {
      transcription += item.text + ' ';
    });

    if (subtitle) {
      const captionContent = genAssSubtitleContent();
      const blob = new Blob([captionContent], { type: 'plain/ass' });
      let reader = new FileReader();
      reader.onload = function (e) {
        setVideoInfo({
          ...videoInfo,
          subtitles: {
            url: e.target?.result || '',
          },
          transcription,
          fonts: captionStyle?.fontFiles,
        });
        setLoadingSubtitles(false);
      };
      reader.readAsDataURL(blob);
    } else {
      setVideoInfo({
        ...videoInfo,
        transcription,
        fonts: captionStyle?.fontFiles,
      });
    }
  }, [JSON.stringify(subtitle), captionStyle]);

  return (
    <StyledHomeDiv className='min-h-full w-full'>
      <div className='video-editor'>
        <div className='w-full flex flex-wrap'>
          <div className='flex-1'>
            {videoInfo && <VideoEditor showCaption={showCC} info={videoInfo} />}
            {!videoInfo && <VideoUploader onUploadedVideo={onUploadedVideo} />}
          </div>
          <div className='px-1 flex items-end pb-[139px]'>
            <button
              className={showCC ? 'selected' : ''}
              onClick={() =>
                dispatch({
                  type: 'CAPTION_VISIBLE',
                  visible: !showCC,
                })
              }
            >
              <Icon name='cc' className='w-[30px]' />
            </button>
          </div>
        </div>
      </div>
      <div className='video-export'>
        <VideoExport
          sourceInfo={videoInfo}
          captionStyle={captionStyle}
          onGenerateAssContent={genAssSubtitleContent}
        />
      </div>
      <div className='transcription-blog'>
        <TranscriptionSummary
          caption={subtitle || []}
          loading={loadingSubtitles}
          prompt={videoInfo?.transcription || ''}
          onChangedCaption={setSubtitle}
          progress={transProcess}
        />
      </div>

      <div className='sm-caption-style'>
        <SmCaptionStyle
          captionStyle={captionStyle}
          onChangeStyle={(captionStyle: CaptionStyle) =>
            setCaptionStyle(captionStyle)
          }
        />
      </div>
    </StyledHomeDiv>
  );
};

export default Home;
