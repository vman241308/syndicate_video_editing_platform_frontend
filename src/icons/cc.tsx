import React from 'react';

interface IconCCProps {
  className?: string;
}

const IconCC = (props: IconCCProps) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 36 32"
    xmlSpace="preserve"
    {...props}
  >
    <title>CC</title>
    <path d="M 32 0 H 4 c -2.21 0 -4 1.79 -4 4 v 24 c 0 2.21 1.79 4 4 4 h 28 c 2.21 0 4 -1.79 4 -4 V 4 c 0 -2.21 -1.79 -4 -4 -4 z M 16 14 h -3 v -1 h -4 v 6 h 4 v -1 h 3 v 2 a 2 2 0 0 1 -2 2 h -6 a 2 2 0 0 1 -2 -2 v -8 a 2 2 0 0 1 2 -2 h 6 a 2 2 0 0 1 2 2 v 2 z m 14 0 h -3 v -1 h -4 v 6 h 4 v -1 h 3 v 2 a 2 2 0 0 1 -2 2 h -6 a 2 2 0 0 1 -2 -2 v -8 a 2 2 0 0 1 2 -2 h 6 a 2 2 0 0 1 2 2 v 2 z" />
  </svg>
);

export default IconCC;
