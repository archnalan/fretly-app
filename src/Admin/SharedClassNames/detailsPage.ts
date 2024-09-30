
export const detailsPage = {
  container: "w-full h-full flex flex-col justify-start items-center bg-base-200",
  innerContainer: (theme: string) =>
    `${theme === "dark" ? "text-neutral-200" : "text-dark"} w-1/2 border bg-base-100 px-5 pt-3 pb-3 rounded-xl mt-[5rem] shadow-xl`,
  revertContainer: "flex items-center text-primary",
  revertButton:"text-xl me-2",
  header: "text-2xl font-semibold my-4",
  backHeaderButton:"text-3xl hover:opacity-75 hover:scale-90 me-4",
  detailRow: "flex justify-between mt-4",
  displayContainer: "w-3/4 text-end btn-disabled cursor-pointer mr-2",
  line: (theme:string)=>`${theme ==="dark"?"border-t-2 border-neutral-700":"border-t border-gray-300"} `,
  buttonContainer: "flex justify-end ext-end mb-3 mt-4",
  backButton: "btn btn-error me-2",
  cancelButton: "btn btn-secondary me-2",
  editButton: "btn btn-primary px-5",
};
