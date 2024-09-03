
export const confirmDelete = {
  overlay: "w-full h-full flex justify-center items-center fixed bg-gray-500 bg-opacity-50 z-1",
  container: (theme: string) =>
    `w-1/2 flex flex-col relative border bg-base-100 shadow-xl px-5 pt-3 rounded-xl ${
      theme === "dark" ? "border-stone-800" : ""
    }`,
  header: "w-full flex absolute top-2 end-3 justify-between items-end",
  closeButton: "btn btn-transparent font-semibold text-error border-0 bg-opacity-0 hover:bg-transparent me-2",
  closeIcon: "text-3xl text-error",
  message: "text-xl mt-10 mb-5",
  buttonContainer: "flex justify-center mb-5",
  noButton: "btn btn-error text-xl px-5 me-4",
  yesButton: "btn btn-primary text-xl px-4",
};
