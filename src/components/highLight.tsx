import React from 'react';

interface HighLightProps {
  text: string;
  highlight: string;
  paragraph: string;
}

const HighLight = ({ text, highlight, paragraph }: HighLightProps) => {
  const parts = paragraph.split(new RegExp(`(${highlight!})`, 'gi'));
  return (
    <>
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { backgroundColor: 'blue' }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
      <br />
    </>
  );
};

export default HighLight;
