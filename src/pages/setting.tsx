import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Icon from '../icons';
import check from '../assets/check.png';
import cross from '../assets/cross.png';
import axios from 'axios';
import ShareModalEditor from '../components/shareModalEditor';

const StyleSetting = styled.div`
  width: 100%;
  height: 100%;
  .modal {
    display: flex;
    font-size: 16px;
    color: white;
    justify-content: space-between;
    width: 100%;
    padding: 15px;
  }
  .checkbar {
    width: 320px;
    height: 58px;
    display: flex;
    align-items: center;
    background-color: black;
    color: white;
    border-radius: 7px;
    justify-content: space-between;
    padding: 12px;
  }
`;
const Setting = () => {
  const [tiktokStatus, setTiktokStatus] = useState<boolean>(false);
  const [instagramStatus, setInstagramStatus] = useState<boolean>(false);
  const [youtubeStatus, setYoutubeStatus] = useState<boolean>(false);
  const [facebookStatus, setFacebookStatus] = useState<boolean>(false);
  const [linkedinStatus, setLinkedinStatus] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [userPlan, setUserPlan] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [emailActive, setEmailActive] = useState<boolean>(false);
  const [passwordActive, setPasswordActive] = useState<boolean>(false);

  async function getUserInfo() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_AUTH_ENDPOINT}/getInfo`
      );
      console.log(data);
      setUserEmail(data.email);
      setTiktokStatus(data.tiktok);
      setFacebookStatus(data.facebook);
      setYoutubeStatus(data.youtube);
      setLinkedinStatus(data.linkedin);
      setInstagramStatus(data.instagram);
      setUserPassword(data.userPassword);
      setUserPlan(data.userPlan);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <StyleSetting className='flex justify-center pt-[95px] pb-[95px]'>
      <div className='flex flex-col w-1/2 min-w-fit h-full bg-[#2e2e2e] items-center rounded-xl'>
        {showModal ? (
          <ShareModalEditor
            content={userEmail}
            setContent={setUserEmail}
            isShow={showModal}
            setIsShow={setShowModal}
          />
        ) : null}
        <div className='flex flex-col items-center pb-[43px]'>
          <div className='text-white text-[32px] pt-[12px] pb-[43px]'>
            Setting
          </div>
          <div className='flex flex-col w-[290px] border border-white rounded-[4px] justify-between justify-items-center'>
            <div className='modal'>
              <p>Email: {userEmail}</p>
              <div
                className='cursor-pointer'
                onClick={() => {
                  setEmailActive(true);
                  setPasswordActive(false);
                  setShowModal(true);
                }}
              >
                <Icon name='edit' />
              </div>
            </div>
            <div className='modal'>
              <p>Password: {userPassword}</p>
              <div
                className='cursor-pointer'
                onClick={() => {
                  setPasswordActive(true);
                  setEmailActive(false);

                  setShowModal(true);
                }}
              >
                <Icon name='edit' />
              </div>
            </div>
            <div className='modal'>
              <p>Plan: {userPlan}</p>
              <div
                className='cursor-pointer'
                onClick={() =>
                  window.open(
                    'https://billing.stripe.com/p/login/dR6dSPg75dwvdpebII',
                    '_blank'
                  )
                }
              >
                <Icon name='edit' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col  p-3'>
          <p className='p-[8px]'>Click To Connect Or Disconnect</p>
          <div className='space-y-2'>
            <div className='checkbar'>
              <p>Instagram</p>
              {instagramStatus ? (
                <img src={check}></img>
              ) : (
                <img src={cross}></img>
              )}
            </div>
            <div className='checkbar'>
              <p>Facebook</p>
              {facebookStatus ? (
                <img src={check}></img>
              ) : (
                <img src={cross}></img>
              )}
            </div>
            <div className='checkbar'>
              <p>Youtube</p>
              {youtubeStatus ? (
                <img src={check}></img>
              ) : (
                <img src={cross}></img>
              )}
            </div>
            <div className='checkbar'>
              <p>TikTok</p>
              {tiktokStatus ? <img src={check}></img> : <img src={cross}></img>}
            </div>
            <div className='checkbar'>
              <p>LinkedIn</p>
              {linkedinStatus ? (
                <img src={check}></img>
              ) : (
                <img src={cross}></img>
              )}
            </div>
          </div>
        </div>
      </div>
    </StyleSetting>
  );
};

export default Setting;
