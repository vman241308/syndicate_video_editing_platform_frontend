import React from 'react';

interface IconSkyProps {
  className?: string;
}

const IconSky = (props: IconSkyProps) => (
  <svg
    width="2"
    height="18"
    viewBox="0 0 2 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>sky</title>
    <line
      x1="1"
      y1="0.999939"
      x2="0.999999"
      y2="16.9999"
      stroke="#6CC1C6"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default IconSky;
