
export const detailsPage = {
  container: "w-full h-full flex flex-col justify-start items-center bg-base-200",
  innerContainer: (theme: string) =>
    `${theme === "dark" ? "text-neutral-200" : "text-dark"} w-1/2 border bg-base-100 px-5 pt-3 pb-3 rounded-xl mt-[5rem] shadow-xl`,
  header: "text-3xl mb-5 mt-4",
  detailRow: "flex justify-between text-end mt-4",
  line: (theme:string)=>`${theme ==="dark"?"border-t-2 border-neutral-700":"border-t border-gray-300"} `,
  buttonContainer: "flex justify-end ext-end mb-3 mt-4",
  backButton: "btn btn-error me-2",
  editButton: "btn btn-primary px-5",
};
