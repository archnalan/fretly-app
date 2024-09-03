
export const SuccessPopup = {
  overlay: "w-full h-full flex justify-center items-center fixed bg-gray-500 bg-opacity-50",
  container: (theme: string) =>
    `w-1/2 flex flex-col relative border bg-base-100 shadow-xl px-5 pt-3 rounded-xl ${
      theme === "dark" ? "border-stone-800 text-slate-300" : ""
    }`,
  header: "w-full flex absolute justify-between top-0 pr-5",
  closeButton: "btn btn-outline border-none rounded-full bg-none hover:bg-opacity-0",
  closeIcon: "text-2xl text-error",
  message: "text-xl mt-10 mb-5",
  buttonContainer: "flex justify-center",
  okButton: "btn btn-sm btn-primary fs-4 py-2 px-4 mb-4",
};
