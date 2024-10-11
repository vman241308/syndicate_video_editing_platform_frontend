import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinner_KYSC = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const StyledPath = styled.path`
  transform-origin: center;
  animation: ${spinner_KYSC} 0.75s infinite linear;
`;

interface IconProps {
  className?: string;
}

const IconSpinner1 = (props: IconProps) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    {...props}
  >
    <title>Wait for a while</title>
    <StyledPath d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" />
  </svg>
);

export default IconSpinner1;
