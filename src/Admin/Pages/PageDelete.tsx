import React from "react";
import { PageModel } from "../../DataModels/PageModel";
import { useThemeContext } from "../../Contexts/ThemeContext";

type popUPMessage = {
  todelete: PageModel;
  handleDelete: (name: string, id: number) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};
const PageDelete: React.FC<popUPMessage> = ({
  todelete,
  handleDelete,
  setOpenConfirm,
}) => {
  const { theme } = useThemeContext();

  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-gray-500 bg-opacity-50 z-1">
      <div
        className={`w-1/2 flex flex-col relative border bg-base-100 shadow-xl px-5 pt-3 rounded-xl ${
          theme === "dark" ? "border-stone-800" : ""
        }`}
      >
        <div className="w-full flex absolute top-0 end-0 justify-between items-end ">
          <div></div>
          <button
            className="btn btn-transparent font-semibold text-error border-0 bg-opacity-0 hover:bg-transparent me-2"
            onClick={() => setOpenConfirm(false)}
          >
            <span className="text-3xl">&times;</span>
          </button>
        </div>
        <p className="text-xl mt-10 mb-5">
          Do you want to delete the page <strong>{todelete.title}</strong>?
        </p>
        <div className="flex justify-center mb-5">
          <button
            className="btn btn-error text-xl px-5 me-4"
            onClick={() => setOpenConfirm(false)}
          >
            No
          </button>
          <button
            className="btn btn-primary text-xl  px-4 "
            onClick={() => {
              handleDelete(todelete.title, todelete.id);
              setOpenConfirm(false);
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageDelete;
