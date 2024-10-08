import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../Contexts/ThemeContext";

type popUPMessage = {
  pageTitle: string;
  setOpenEditSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};
const PageEditSuccess: React.FC<popUPMessage> = ({
  pageTitle,
  setOpenEditSuccess,
}) => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-500 " : "bg-gray-700 "
      } w-full h-screen flex justify-center items-center fixed bg-opacity-30 z-100`}
    >
      <div
        className={`w-1/2 flex flex-col relative border bg-base-100 shadow-xl px-5 pt-3 rounded-xl ${
          theme === "dark" ? "border-stone-900 text-slate-300" : ""
        }`}
      >
        <div className="w-full flex absolute justify-between top-0 pr-5">
          <div></div>
          <button
            className="btn btn-outline border-none rounded-full bg-none hover:bg-opacity-0"
            onClick={() => {
              setOpenEditSuccess(false);
              navigate(-1);
            }}
          >
            <span className="font-semibold text-2xl text-error">&times;</span>
          </button>
        </div>
        <p
          className={`${
            theme === "dark" ? "text-neutral-300" : "text-dark"
          } font-semibold mt-10 mb-5`}
        >
          <strong>{pageTitle}</strong> page has been edited successfully!
        </p>
        <div className="flex justify-center">
          <button
            className="btn btn-primary font-semibold px-5 mb-4"
            onClick={() => {
              navigate(-1);
              () => setOpenEditSuccess(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageEditSuccess;
