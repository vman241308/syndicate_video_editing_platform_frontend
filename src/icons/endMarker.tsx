import React from 'react';

interface IconEndMarkerProps {
  className?: string;
}

const IconEndMarker = (props: IconEndMarkerProps) => (
  <svg
    width="7"
    height="18"
    viewBox="0 0 7 18"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>endMarker</title>
    <path d="M6.00002 17.67C5.87335 17.67 5.74669 17.6 5.64669 17.45L1.30002 10.93C0.593353 9.87002 0.593353 8.13002 1.30002 7.07002L5.64669 0.55002C5.84002 0.26002 6.16002 0.26002 6.35335 0.55002C6.54669 0.84002 6.54669 1.32002 6.35335 1.61002L2.00669 8.13002C1.68669 8.61002 1.68669 9.39002 2.00669 9.87002L6.35335 16.39C6.54669 16.68 6.54669 17.16 6.35335 17.45C6.25335 17.59 6.12669 17.67 6.00002 17.67Z"></path>
  </svg>
);

export default IconEndMarker;
