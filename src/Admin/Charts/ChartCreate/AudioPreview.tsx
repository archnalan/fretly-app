import React from "react";
import { GrClose } from "react-icons/gr";
import { IoMdCloseCircleOutline } from "react-icons/io";

type AudioProps = {
  audioPreview: string;
  handleRemoveAudioFile: () => void;
};

const AudioPreview: React.FC<AudioProps> = ({
  audioPreview,
  handleRemoveAudioFile,
}) => {
  return (
    <div>
      {audioPreview && (
        <div className="container relative max-h-[10rem]">
          <div className="sticky top-0 right-0 bg-transparent z-10">
            <button
              className="absolute right-0 btn btn-circle rounded-5 text-primary"
              onClick={handleRemoveAudioFile}
            >
              <GrClose />
            </button>
          </div>
          <audio controls className="m3 max-w-full max-h-[5rem] object-fit z-0">
            <source src={audioPreview} />
            Your Browser does not support this audio
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioPreview;
