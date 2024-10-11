import React, { useEffect, useState, ChangeEvent } from "react";
import Icon from "../icons";
import styled from "styled-components";

const StyledModalEditor = styled.div`
  button {
    background-color: transparent;
    border-radius: 2px;
    font-size: 12px;
    height: fit-content;
    transition-duration: 0.4s;
  }
  .button:hover {
    background-color: #257bf5; /* blue */
    color: white;
    border-style: none;
  }
`;

interface ShareModalEditorProps {
  content: string;
  setContent: Function;
  isShow: boolean;
  setIsShow: Function;
}

const ShareModalEditor = ({ isShow, setIsShow }: ShareModalEditorProps) => {
  return (
    <StyledModalEditor className="flex bg-[#000d] justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="my-6 mx-auto w-1/5 h-fit">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-[#2e2e2e] outline-none focus:outline-none">
          <div className="flex justify-end p-1 rounded-t ">
            <button
              className=" flex bg-transparent float-right"
              onClick={() => {
                setIsShow(false);
              }}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="flex justify-center p-2 ">
            <div>
              <Icon name="error" />
            </div>
            <p className="pl-[8px]">Are you sure to edit?</p>
          </div>
          <div className="flex justify-center p-3">
            <button
              className="button"
              type="button"
              onClick={() => {
                setIsShow(false);
              }}
            >
              <p>CANCEL</p>
            </button>
            <button
              className="button"
              type="button"
              onClick={() => {
                setIsShow(false);
              }}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </StyledModalEditor>
  );
};

export default ShareModalEditor;
