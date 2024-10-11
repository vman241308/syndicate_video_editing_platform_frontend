import React, { useState } from 'react';
import styled from 'styled-components';
import logoPng from '../assets/logo.png';
import metricPng from '../assets/metric.png';
import camcorderPng from '../assets/camcorder.png';
import settingPng from '../assets/setting.png';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const [isMetricSelected, setIsMetricSelected] = useState<boolean>(false);
  const [isCamSelected, setIsCamSelected] = useState<boolean>(true);
  const [isSettingSelected, setIsSettingSelected] = useState<boolean>(false);

  const navigate = useNavigate();
  return (
    <header className='flex flex-col justify-between gap-2 items-center pt-8 w-[70px] h-full'>
      <div className='rounded-xl items-center'>
        <div className='pl-4 pb-2 pt-4 pr-4 justify-center'>
          <img src={logoPng} width={48} height={48} />
        </div>
        <div className='pr-1 pl-1'>
          <button
            onClick={() => {
              setIsMetricSelected(true);
              setIsCamSelected(false);
              setIsSettingSelected(false);
              navigate('/metrics');
            }}
            className={`${isMetricSelected ? 'bg-[#232323]' : 'bg-none'}`}
          >
            <img src={metricPng} />
          </button>
        </div>
        <div className='pr-1 pl-1'>
          <button
            onClick={() => {
              setIsCamSelected(true);
              setIsMetricSelected(false);
              setIsSettingSelected(false);
              navigate('/home');
            }}
            className={`${isCamSelected ? 'bg-[#232323]' : 'bg-none'}`}
          >
            <img src={camcorderPng} />
          </button>
        </div>
      </div>
      <div className='pr-1 pl-1 pb-2'>
        <button
          onClick={() => {
            setIsSettingSelected(true);
            setIsCamSelected(false);
            setIsMetricSelected(false);
            navigate('/setting');
          }}
          className={`${isSettingSelected ? 'bg-[#232323]' : 'bg-none'}`}
        >
          <img src={settingPng} />
        </button>
      </div>
    </header>
  );
};

export default Nav;
