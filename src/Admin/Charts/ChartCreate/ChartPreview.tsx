import React from "react";
import { GrClose } from "react-icons/gr";
import { IoMdCloseCircleOutline } from "react-icons/io";

type ChartPrevProps = {
  chartPreview: string;
  handleRemoveFile: () => void;
};
const ChartPreview: React.FC<ChartPrevProps> = ({
  chartPreview,
  handleRemoveFile,
}) => {
  return (
    <>
      {chartPreview && (
        <div className="container relative max-h-[10rem] overflow-y-scroll ">
          <div className="sticky top-0 right-0 bg-transparent z-10">
            <button
              className="absolute right-0 btn btn-circle rounded-5 text-primary"
              onClick={handleRemoveFile}
            >
              <GrClose />
            </button>
          </div>
          <img
            src={chartPreview}
            alt="chart preview"
            className="justify-self-end object-cover z-0 max-h-[15rem]"
          />
        </div>
      )}
    </>
  );
};

export default ChartPreview;
