import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../Contexts/ThemeContext";

type popUPMessage = {
  pageTitle: string;
  setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};
const PageSuccess: React.FC<popUPMessage> = ({ pageTitle, setOpenSuccess }) => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-gray-500 bg-opacity-50">
      <div
        className={`w-1/2 flex flex-col relative border bg-base-100 shadow-xl px-5 pt-3 rounded-xl ${
          theme === "dark" ? "border-stone-800 text-slate-300" : ""
        }`}
      >
        <div className="w-full flex absolute justify-between top-0 pr-5">
          <div></div>
          <button
            className="btn btn-outline border-none rounded-full bg-none hover:bg-opacity-0 "
            onClick={() => {
              setOpenSuccess(false);
              navigate("/admin/pages");
            }}
          >
            <span className="text-2xl text-error">&times;</span>
          </button>
        </div>
        <p className="text-xl mt-10 mb-5">
          Page: <strong>{pageTitle}</strong> has been created successfully!
        </p>
        <div className="flex justify-center">
          <button
            className="btn btn-sm btn-primary fs-4 py-2 px-4 mb-4"
            onClick={() => {
              navigate("/admin/pages");
              () => setOpenSuccess(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSuccess;
