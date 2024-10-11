import React from "react";

interface CaptionBoxProps {
  duration: number;
  captions: Array<Caption>;
  className?: string;
}

const CaptionBox = ({ duration, captions }: CaptionBoxProps) => {
  return (
    <div className="flex flex-row justify-between h-[35px] relative">
      {captions &&
        captions.map((caption) => {
          return (
            <div
              className="flex absolute bg-[#0075FF] rounded-sm items-center justify-center overflow-hidden"
              key={caption.id}
              style={{
                width: `${((caption.end - caption.start) / duration) * 100}%`,
                height: 25,
                padding: 4,
                left: `${(caption.start / duration) * 100}%`,
              }}
            >
              <p className="text-[4px]  text-black break-all">
                {caption.text.replace("<br />", " ")}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default CaptionBox;
