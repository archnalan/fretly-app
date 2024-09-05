
export const editPage= {
  container: "w-full h-full flex justify-center items-center relative bg-base-200 z-0",
  innerContainer: (theme: string) =>
    `${theme === "dark" ? "text-neutral-300" : "text-dark"} w-1/2 border bg-base-100 shadow-lg px-5 pt-3 pb-5 rounded-xl`,
  header: "text-2xl font-bold mt-4 mb-10",
  form: "mb-4 flex justify-between",
  label: "text-lg font-semibold",
  inputContainer: "w-3/4",
  input: "input input-bordered w-full mb-1",
  errorText: "text-error text-sm mb-2",
  selectContainer: "mb-4 flex justify-between",
  selectInnerContainer: "w-3/4 flex-col",
  selectElement: "w-full select select-bordered",
  buttonContainer: "flex justify-end mb-5",
  backButton: "btn btn-error me-2",
  saveButton: "btn btn-primary px-4",
};
