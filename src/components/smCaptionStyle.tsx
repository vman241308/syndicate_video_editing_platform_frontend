import React, { useEffect, useState } from 'react';
import Icon from '../icons';
import styled from 'styled-components';
import FontPicker from 'font-picker-react';

interface SmCaptionStyleProps {
  captionStyle: CaptionStyle;
  onChangeStyle: Function;
}

const StyledSmCaptionStyle = styled.div`
  background: var(--light-navy);

  width: 100%;

  button {
    padding: 12px;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  #font-picker {
    width: 100%;
    flex: 1 1 0%;
    box-shadow: none;
    font-size: 16px;

    .dropdown-button {
      padding: 0.875rem !important;
      background: #3f3f3f;
      height: auto !important;
    }

    .dropdown-icon.finished::before {
      border-top: 6px solid #fff;
    }

    ul {
      background: #3f3f3f;

      li button:hover,
      li button:focus,
      li button.active-font {
        background: #e95420;
      }

      ::-webkit-scrollbar-track {
        background: #3f3f3f;
      }
      ::-webkit-scrollbar-thumb {
        background-color: var(--dark-slate);
        border: 3px solid #3f3f3f;
        border-radius: 10px;
      }
    }
  }
`;

const SmCaptionStyle = ({
  onChangeStyle,
  captionStyle,
}: SmCaptionStyleProps) => {
  const [vAlignment, setVAlignment] = useState<string>();
  const [hAlignment, setHAlignment] = useState<string>();
  useEffect(() => {
    const parts = captionStyle.textAlign.split('-');
    const vAlignment = parts[0];
    const hAlignment = parts[1];
    setVAlignment(vAlignment);
    setHAlignment(hAlignment);
  }, [captionStyle.textAlign]);

  return (
    <StyledSmCaptionStyle className="flex flex-col rounded-2xl h-full top-0 bottom-full">
      <p className="flex w-full text-left text-[20px] text-white pt-2 px-5">
        Text
      </p>
      <div className="pt-4 pl-[20px] pr-[20px] pb-[20px] space-y-[12px] w-full">
        <div className="flex flex-row w-full gap-5">
          <div className="flex w-full">
            <FontPicker
              apiKey={import.meta.env.VITE_GOOGLE_FONT_API_KEY}
              activeFontFamily={captionStyle.font}
              onChange={(nextFont) => {
                const fontFiles: Array<string> = [];
                for (let i = 0; i < (nextFont?.variants || []).length; i++) {
                  const filePath = nextFont.files
                    ? nextFont.files[nextFont.variants[i]].replace(
                        'http:',
                        'https:'
                      )
                    : undefined;
                  if (!filePath) continue;
                  if (!fontFiles.includes(filePath)) {
                    fontFiles.push(filePath);
                  }
                }
                onChangeStyle({
                  ...captionStyle,
                  font: nextFont.family,
                  fontFiles,
                });
              }}
            />
          </div>
          <div className="flex w-full">
            <select
              className="block text-base p-3.5 top-full rounded-sm bg-[#3f3f3f] placeholder-gray-400 max-h-[52px] flex-auto text-white w-full"
              onChange={(evt) =>
                onChangeStyle({ ...captionStyle, fontSize: evt.target.value })
              }
              value={captionStyle.fontSize}
            >
              <option value="18px">18px</option>
              <option value="24px">24px</option>
              <option value="30px">30px</option>
              <option value="36px">36px</option>
              <option value="48px">48px</option>
              <option value="60px">60px</option>
              <option value="72px">72px</option>
              <option value="96px">96px</option>
              <option value="104px">104px</option>
              <option value="120px">120px</option>
              <option value="136px">136px</option>
              <option value="148px">148px</option>
              <option value="160px">160px</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <select
            className="block text-base p-3.5 rounded-sm bg-[#3f3f3f] placeholder-gray-400 text-white max-h-[52px] flex-auto w-full"
            onChange={(evt) =>
              onChangeStyle({ ...captionStyle, fontWeight: evt.target.value })
            }
            value={captionStyle.fontWeight}
          >
            <option value="lighter">Light</option>
            <option value="bold">Semibold</option>
            <option value="bolder">Bold</option>
          </select>
          <select
            className="block text-base p-3.5 rounded-sm bg-[#3f3f3f] placeholder-gray-400 text-white max-h-[52px] flex-auto w-full"
            onChange={(evt) =>
              onChangeStyle({
                ...captionStyle,
                textAlign: `${evt.target.value}-${hAlignment}`,
              })
            }
            value={vAlignment}
          >
            <option value="bottom">Bottom</option>
            <option value="200bottom">Lower Third</option>
            <option value="middle">Middle</option>
            <option value="200top">Upper Third</option>
            <option value="top">Top</option>
          </select>
        </div>
        <div className="flex flex-row space-x-5 w-full">
          <button
            className={`${
              hAlignment === 'left' ? 'selected flex-none' : 'flex-none'
            }`}
            onClick={() =>
              onChangeStyle({
                ...captionStyle,
                textAlign: `${vAlignment}-left`,
              })
            }
          >
            <Icon name="alignment-left" />
          </button>
          <button
            className={`${
              hAlignment === 'center' ? 'selected flex-none' : 'flex-none'
            }`}
            onClick={() =>
              onChangeStyle({
                ...captionStyle,
                textAlign: `${vAlignment}-center`,
              })
            }
          >
            <Icon name="alignment-center" />
          </button>
          <button
            className={`${
              hAlignment === 'right' ? 'selected flex-none' : 'flex-none'
            }`}
            onClick={() =>
              onChangeStyle({
                ...captionStyle,
                textAlign: `${vAlignment}-right`,
              })
            }
          >
            <Icon name="alignment-right" />
          </button>
          <button
            className={`${
              captionStyle.italic ? 'selected flex-none' : 'flex-none'
            }`}
            onClick={() =>
              onChangeStyle({ ...captionStyle, italic: !captionStyle.italic })
            }
          >
            <Icon name="italic" />
          </button>
          <button
            className={`${
              captionStyle.underline ? 'selected flex-none' : 'flex-none'
            }`}
            onClick={() =>
              onChangeStyle({
                ...captionStyle,
                underline: !captionStyle.underline,
              })
            }
          >
            <Icon name="underline" />
          </button>
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <button
            className={`w-1/4 h-[50px] pr-2 p-0 ${
              captionStyle.capitalize ? 'selected' : ''
            }`}
            onClick={() => {
              onChangeStyle({
                ...captionStyle,
                capitalize: !captionStyle.capitalize,
              });
            }}
          >
            <p
              className="text-center font-normal font-sans text-[18px]
            "
            >
              Capitalize
            </p>
          </button>
          <button
            className={`w-1/4 pr-2 h-[50px] p-0 flex items-center ${
              captionStyle.rmp ? 'selected' : ''
            }`}
            onClick={() => {
              onChangeStyle({ ...captionStyle, rmp: !captionStyle.rmp });
            }}
          >
            <p className="text-center font-normal font-sans text-[16px] py-[1.5px]">
              Remove Punctuation
            </p>
          </button>
          <button
            className={`w-1/4 pr-2 h-[50px] p-0 items-center
              ${
                captionStyle.style !== 'default'
                  ? 'selected flex-none'
                  : 'flex-none'
              }`}
            onClick={() =>
              onChangeStyle({
                ...captionStyle,
                style: captionStyle.style !== 'default' ? 'default' : 'karaoke',
              })
            }
          >
            <p
              className="text-center font-normal font-sans text-[18px] py-[1.5px] w-full
            "
            >
              Style
            </p>
          </button>
        </div>
      </div>
    </StyledSmCaptionStyle>
  );
};

export default SmCaptionStyle;
