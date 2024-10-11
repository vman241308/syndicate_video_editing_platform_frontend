import React, { ChangeEvent, useEffect, useState } from 'react';
import Icon from '../icons';
import ShareModalPreviewer from './shareModalPreviewer';
import { Switch } from 'antd';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
interface ShareModalProps {
  onShared: Function;
  mediaLink: string;
  onClose: Function;
}

const ShareModal = ({ mediaLink, onShared, onClose }: ShareModalProps) => {
  const [smCaption, setSmCaption] = useState<string>('');
  const [statusArray, setStatus] = useState(new Array(5));
  const [sharing, setSharing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>('');
  const [alertColor, setAlertColor] = useState(false);
  const [instagram, setInstagram] = useState(false);
  const [facebook, setFacebook] = useState(false);
  const [youtube, setYoutube] = useState(false);
  const [linkedin, setLinkedin] = useState(false);
  const [tiktok, setTiktok] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleInstagram = (instagramChecked: boolean) => {
    setInstagram(!instagram);
    const currentArray = statusArray;
    if (instagramChecked) {
      currentArray[0] = 'instagram';
    } else currentArray[0] = '';
    setStatus(currentArray);
  };

  const handleFacebook = (checked: boolean) => {
    setFacebook(!facebook);
    const currentArray = statusArray;
    if (checked) {
      currentArray[1] = 'facebook';
    } else currentArray[1] = '';
    setStatus(currentArray);
  };

  const handleTiktok = (checked: boolean) => {
    setTiktok(!tiktok);
    const currentArray = statusArray;
    if (checked) {
      currentArray[2] = 'tiktok';
    } else currentArray[2] = '';
    setStatus(currentArray);
  };

  const handleYoutube = (checked: boolean) => {
    setYoutube(!youtube);
    const currentArray = statusArray;
    if (checked) {
      currentArray[3] = 'youtube';
    } else currentArray[3] = '';
    setStatus(currentArray);
  };

  const handleLinkedin = (checked: boolean) => {
    setLinkedin(!linkedin);
    const currentArray = statusArray;
    if (checked) {
      currentArray[4] = 'linkedin';
    } else currentArray[4] = '';
    setStatus(currentArray);
  };

  const handleShare = () => {
    const API_KEY = import.meta.env.VITE_AYRSHARE_PROFILE_KEY;

    const platforms = statusArray.filter((item) => item);

    if (selectedDate?.isBefore(new Date()) || platforms.length == 0) {
      setAlertColor(false);
      setAlertContent('Scheduling Failed');
      return;
    }

    if (mediaLink) setSharing(!sharing);

    fetch('https://app.ayrshare.com/api/auto-schedule/set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        title: 'Syndicate Video',
        setStartDate: `${selectedDate?.toISOString().slice(0, 19) + 'Z'}`,
        schedule: [
          `${selectedDate?.toISOString().slice(11, 16) + 'Z'}`,
          `${selectedDate?.toISOString().slice(11, 16) + 'Z'}`,
        ],
        autoSchedule: true,
      }),
    })
      .then((res) => {
        fetch('https://app.ayrshare.com/api/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            title: 'Syndicate Video',
            post: `${smCaption}`, // required
            platforms: platforms, // required
            mediaUrls: [mediaLink], //optional
            youTubeVisibility: 'public',
            instagramOptions: {
              reels: true,
              shareReelsFeed: true,
            },
          }),
        })
          .then((res) => res.json())
          .then(({ errors, postIds }) => {
            console.log('----> step1', errors, postIds);

            if (errors.length == 0) {
              setAlertContent(
                'You have just scheduled video to ' +
                  platforms.join(', ') +
                  ' successfully.'
              );
              setAlertColor(true);
            } else {
              const failed = [],
                succeed = [];
              for (let i = 0; i < errors.length; i++)
                failed.push(errors[i].platform);
              for (let i = 0; i < postIds.length; i++)
                succeed.push(postIds[i].platform);
              setAlertContent(
                'Scheduling to ' +
                  succeed.join(', ') +
                  ' was successful but scheduling to ' +
                  failed.join(', ') +
                  ' failed.'
              );
              setAlertColor(false);
            }
          })
          .catch(({ errors, postIds }) => {
            console.log('----> step2', errors, postIds);

            const failed = [],
              succeed = [];
            if (!errors || !postIds) {
              setAlertContent('Scheduling Video failed');
              setAlertColor(false);
            } else {
              for (let i = 0; i < errors.length; i++)
                failed.push(errors[i].platform);
              for (let i = 0; i < postIds.length; i++)
                succeed.push(postIds[i].platform);
              setAlertContent(
                'Scheduling to ' +
                  succeed.join(', ') +
                  ' was successful but scheduling to ' +
                  failed.join(', ') +
                  ' failed.'
              );
              setAlertColor(false);
            }
          });
      })
      .then((json) => {
        // setAlertColor(true);
        // setAlertContent('Success');
        // console.log(json);
        console.log(json);
      })
      // .then(({ errors, postIds }) => {
      //   if (errors.length == 0) {
      //     setAlertContent(
      //       'You have just scheduled video to ' +
      //         platforms.join(', ') +
      //         ' successfully.'
      //     );
      //     setAlertColor(true);
      //   } else {
      //     const failed = [],
      //       succeed = [];
      //     for (let i = 0; i < errors.length; i++)
      //       failed.push(errors[i].platform);
      //     for (let i = 0; i < postIds.length; i++)
      //       succeed.push(postIds[i].platform);
      //     setAlertContent(
      //       'Scheduling to ' +
      //         succeed.join(', ') +
      //         ' was successful but scheduling to ' +
      //         failed.join(', ') +
      //         ' failed.'
      //     );
      //     setAlertColor(false);
      //   }
      // })
      // .catch(({ errors, postIds }) => {
      //   const failed = [],
      //     succeed = [];
      //   if (!errors || !postIds) {
      //     setAlertContent('Scheduling Video failed');
      //     setAlertColor(false);
      //   } else {
      //     for (let i = 0; i < errors.length; i++)
      //       failed.push(errors[i].platform);
      //     for (let i = 0; i < postIds.length; i++)
      //       succeed.push(postIds[i].platform);
      //     setAlertContent(
      //       'Scheduling to ' +
      //         succeed.join(', ') +
      //         ' was successful but scheduling to ' +
      //         failed.join(', ') +
      //         ' failed.'
      //     );
      //     setAlertColor(false);
      //   }
      // })
      .catch(console.error)
      .finally(() => {
        setSharing(false);
        setShowAlert(true);
      });
  };

  if (!mediaLink) {
    return null;
  }

  return (
    <div className="flex bg-[#000d] rounded-sm  justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative my-6 mx-auto">
        <div className="border-0 w-[600px] h-[460px]  rounded-lg shadow-lg relative flex flex-col bg-[#232323] outline-none focus:outline-none">
          <div className="flex items-center justify-between p-5 rounded-t ">
            <p className="text-[20px] text-white">Select Platforms</p>
            <div className="bg-white rounded-md">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </div>
            <button
              className="bg-transparent border-0 text-white float-right"
              onClick={() => {
                onClose();
                setLinkedin(false);
                setYoutube(false);
                setTiktok(false);
                setInstagram(false);
                setFacebook(false);
              }}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-[27px] pr-[30px] pl-[30px]">
            <div className="flex justify-between">
              <div className="flex">
                <Icon name="orange" />
                <span className="text-white text-[15px]">Instagram</span>
              </div>
              <Switch
                id="1"
                title="instagram"
                style={{
                  backgroundColor: statusArray[0] ? '#0075FF' : 'gray',
                }}
                onChange={handleInstagram}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex">
                <Icon name="sky"></Icon>
                <span className="text-white text-[15px]">Facebook</span>
              </div>
              <Switch
                id="2"
                title="facebook"
                style={{
                  backgroundColor: statusArray[1] ? '#0075FF' : 'gray',
                }}
                onChange={handleFacebook}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex">
                <Icon name="blue"></Icon>
                <span className="text-white text-[15px]">TikTok</span>
              </div>
              <Switch
                id="3"
                title="tiktok"
                style={{
                  backgroundColor: statusArray[2] ? '#0075FF' : 'gray',
                }}
                onChange={handleTiktok}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-[35px] pr-[30px] pl-[30px]">
            <div className="flex justify-between">
              <div className="flex">
                <Icon name="blue"></Icon>
                <span className="text-white text-[15px]">Youtube </span>
              </div>
              <Switch
                style={{
                  backgroundColor: statusArray[3] ? '#0075FF' : 'gray',
                }}
                onChange={handleYoutube}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex">
                <Icon name="red"></Icon>
                <span className="text-white text-[15px]">Linkedin</span>
              </div>
              <Switch
                id="5"
                title="linkedin"
                style={{
                  backgroundColor: statusArray[4] ? '#0075FF' : 'gray',
                }}
                onChange={handleLinkedin}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <span className="w-4/5 border bg-white"></span>
          </div>
          <div className="flex p-6 justify-center ">
            <ShareModalPreviewer
              smCaption={smCaption}
              onChangedSmCaption={setSmCaption}
            ></ShareModalPreviewer>
          </div>
          <div className="flex justify-center mb-4">
            {showAlert && (
              <div className="flex justify-between">
                {alertColor ? (
                  <p className="text-[12px] text-white">{alertContent}</p>
                ) : (
                  <p className="text-[12px] text-red-600">{alertContent}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              className=" bg-blue-700 w-1/6 text-[15px] flex justify-center mb-5"
              onClick={handleShare}
            >
              {sharing ? <Icon name="spinner1" /> : 'share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
