
export const listPage = {
container: "w-full h-full overflow-y-scroll relative bg-base-200", 
  innerContainer: (theme: string) =>
    `${theme === "dark" ? "text-neutral-300" : "text-dark"} flex flex-col justify-start items-center bg-base-200 h-full`,
  header: "m-3 text-3xl mt-5", 
  successAlert: "w-3/4 alert alert-error text-wrap",
  errorAlert: "w-3/4 alert alert-error text-wrap text-slate-200 bg-opacity-1/2",
  contentContainer: "w-3/4 rounded-xl bg-base-100 shadow p-3",
  searchContainer: "flex justify-between mb-3",
  searchInputContainer: "flex w-1/2 justify-start items-center relative me-5",
  searchInput: "h-3/4 input input-bordered w-full pl-10 rounded-md",
  searchButton: "btn btn-link absolute border-none",
  createButton: "btn btn-neutral",
  tableContainer: "overflow-x-auto",
  table: "table align-middle",
  tableHeader: (theme: string) => `${theme === "dark" ? "text-neutral-300" : ""} text-xl`,
  tableRow: "col-number col-title col-category col-author col-actions",
  tableDivider: "divide-y divide-gray-300",
  spinnerPreview:"w-full h-full flex justify-center items-center",
  spinnerSpan:"loading loading-spinner text-info loading-lg",
  detailsButton: "btn btn-info btn-sm me-2",
  editButton: "btn btn-primary btn-sm me-2",
  deleteButton: "btn btn-error btn-sm",
  paginationContainer: "flex justify-center fixed bottom-5 bg-base-150 shadow-md rounded-xl border",
};




