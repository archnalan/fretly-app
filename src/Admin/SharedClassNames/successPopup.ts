import { theme } from "../../DataModels/ThemeModel";

export const SuccessPopup = {
  overlay: (theme: theme)=>`${
        theme === "dark" ? "bg-gray-500 " : "bg-gray-700 "
      } w-full h-screen flex justify-center items-center fixed bg-opacity-30 z-100`,
  container: (theme: theme) =>
   `w-1/2 flex flex-col relative border bg-base-100 shadow-xl px-5 pt-3 rounded-xl ${
          theme === "dark" ? "border-stone-900 text-slate-300" : ""
        }`,
  header: "w-full flex absolute justify-between top-0 pr-5",
  closeButton: "btn btn-outline border-none rounded-full bg-none hover:bg-opacity-0",
  closeIcon: "text-2xl text-error",
  message: "text-xl mt-10 mb-5",
  buttonContainer: "flex justify-start mb-4",
  okButton: "btn btn-md btn-primary ",
};
