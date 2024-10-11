import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Icon from '../icons';

const StyledShareModal = styled.div`
  background-color: #2c2c2c;
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
interface ShareModalPreviewerProps {
  smCaption: string;
  onChangedSmCaption: Function;
}

const ShareModalPreviewer = ({
  smCaption,
  onChangedSmCaption,
}: ShareModalPreviewerProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempSmCaption, setTempSmCaption] = useState<string | undefined>('');

  const handleChangeSmCaption = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTempSmCaption(event.target.value);
  };

  useEffect(() => {
    setTempSmCaption(smCaption);
  }, [smCaption]);

  return (
    <StyledShareModal className=" rounded-xl pl-[20px] pr-[20px] w-3/5 min-h-[110px] h-fit">
      <div className="flex flex-col rounded-2xl">
        <div className="flex pt-4 pl-3">
          <div className="flex text-[20px] justify-center text-white mb-[7px] flex-grow">
            Social Media Caption
          </div>
          <div
            className="flex justify-right"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Icon name="edit"></Icon>
          </div>
        </div>
        {isEditing ? (
          <div className="bg-[#2c2c2c] content w-full h-full overflow-y-auto text-[#999999]">
            <form>
              <textarea
                className="w-full h-4/5 bg-[#2c2c2c] text-[12px] "
                defaultValue={smCaption}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChangeSmCaption(event)
                }
                placeholder="Write here your caption."
              ></textarea>
            </form>
            <div className="flex justify-center pt-[5px]">
              <button
                className="button"
                onClick={() => {
                  onChangedSmCaption(smCaption);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                className="button"
                onClick={() => {
                  onChangedSmCaption(tempSmCaption);
                  setIsEditing(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#2c2c2c] content h-full w-full overflow-y-auto text-[12px] text-[#999999]">
            <p className="content">{smCaption}</p>
          </div>
        )}
      </div>
    </StyledShareModal>
  );
};

export default ShareModalPreviewer;
