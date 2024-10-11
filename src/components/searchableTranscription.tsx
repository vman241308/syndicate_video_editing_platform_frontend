import React, { useState, useEffect, useRef } from 'react';
import InputMask from 'react-input-mask';
import styled from 'styled-components';

const StyledTranscription = styled.div`
  background-color: var(--light-navy);
  width: 100%;
  height: 100%;
  .content {
    color: var(--dark-white);
  }
  button {
    background-color: transparent;
    border-radius: 2px;
    margin-right: 20px;
    font-size: 12px;
    height: fit-content;
    transition-duration: 0.4s;
    border-color: #999999;
    border-width: 1px;
  }
  .button:hover {
    background-color: #257bf5; /* Green */
    color: white;
    border-style: none;
  }
`;

interface TranscriptionProps {
  className?: string;
  original: Array<Caption>;
  isEditing: boolean;
  onFinishEdition: Function;
  onChangedCaption: Function;
}

const SearchableTranscription = ({
  original,
  isEditing,
  onFinishEdition,
  onChangedCaption,
}: TranscriptionProps) => {
  const [tempCaption, setTempCaption] = useState<Array<Caption>>([]);

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: 'start' | 'end'
  ) => {
    const innerText = event.currentTarget.value;
    const seconds = timeToSeconds(innerText);
    tempCaption[index][type] = seconds;
    setTempCaption(JSON.parse(JSON.stringify(tempCaption)));
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const innerText = event.currentTarget.value;
    if (tempCaption[index].text !== innerText) {
      tempCaption[index].text = innerText;
    }
    setTempCaption(JSON.parse(JSON.stringify(tempCaption)));
  };

  const secondsToTime = (secs: number) => {
    let seconds = Math.floor(secs);
    const miliseconds = (secs - seconds) * 100;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      seconds > 9 ? seconds : `0${seconds}`
    }.${miliseconds > 9 ? miliseconds : `0${miliseconds}`}`;
  };

  const timeToSeconds = (time: string) => {
    const parts = time.split(/:|\./g);
    return (
      parseInt(parts[0]) * 60 + parseInt(parts[1]) + parseInt(parts[2]) / 100
    );
  };

  useEffect(() => {
    setTempCaption(JSON.parse(JSON.stringify(original)));
  }, [original]);

  return (
    <StyledTranscription className='rounded-2xl pl-[20px] pr-[20px] min-h-full pb-10'>
      {isEditing ? (
        <div className='h-full overflow-y-auto'>
          <div className='text-[14px] border rounded-sm border-[#999999] h-full overflow-y-auto '>
            {tempCaption?.map((paragraph, i) => {
              return (
                <div
                  key={`editable-${i}`}
                  suppressContentEditableWarning={true}
                  className='flex'
                >
                  <InputMask
                    mask='99:99.99'
                    placeholder='00:00.00'
                    value={secondsToTime(paragraph.start)}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      handleTimeChange(evt, i, 'start')
                    }
                    className='bg-[#2e2e2e] content text-[14px] h-[25px] w-[60px]'
                  />
                  ~&nbsp;&nbsp;
                  <InputMask
                    mask='99:99.99'
                    placeholder='00:00.00'
                    value={secondsToTime(paragraph.end)}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      handleTimeChange(evt, i, 'end')
                    }
                    className='bg-[#2e2e2e] content text-[14px] h-[25px] w-[60px]'
                  />
                  &nbsp;&nbsp;
                  <input
                    type='text'
                    placeholder=''
                    value={paragraph.text}
                    onChange={(evt) => handleContentChange(evt, i)}
                    className='bg-[#2e2e2e] content text-[14px] w-full h-[25px] min-w-[60px]'
                  />
                </div>
              );
            })}
          </div>
          <div className='flex float-right pt-[5px]'>
            <button
              className='button'
              onClick={() => {
                onFinishEdition();
                setTempCaption(JSON.parse(JSON.stringify(original)));
              }}
            >
              Cancel
            </button>
            <button
              className='button'
              onClick={() => {
                onChangedCaption(tempCaption);
                onFinishEdition();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className='text-[14px] content h-full overflow-y-auto'>
          {original?.map((paragraph, i) => {
            return <div key={`static-${i}`}>{paragraph.text}</div>;
          })}
        </div>
      )}
    </StyledTranscription>
  );
};

export default SearchableTranscription;
