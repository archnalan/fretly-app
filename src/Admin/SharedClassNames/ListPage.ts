import { theme } from "../../DataModels/ThemeModel";

export const listPage = {
container: "w-full h-full overflow-y-scroll relative bg-base-200", 
  innerContainer: (theme: theme) =>
    `${theme === "dark" ? "text-neutral-300" : "text-dark"} flex flex-col justify-start items-center bg-base-200 h-full`,
  header: "m-3 text-3xl mt-8 text-primary font-semibold", 
  successAlert: "w-3/4 alert alert-error text-wrap",
  toastContainer:"toast toast-top toast-end",
  toastDiv:"alert alert-success",
  errorAlert: "w-3/4 alert alert-error text-wrap text-slate-200 bg-opacity-1/2",
  contentContainer: "w-3/4 rounded-xl bg-base-100 shadow-md p-3 mb-2",
  searchContainer: "flex justify-between",
  searchInputContainer: "flex w-1/2 justify-start items-center relative me-5",
  searchInput: "h-full input input-bordered w-full pl-10 rounded-md placeholder-primary placeholder-opacity-50",
  searchButton: "btn btn-link absolute border-none",
  createLinkContainer:"flex items-center border border-base-200 rounded-r-md px-2 btn btn-neutral text-primary bg-transparent hover:bg-opacity-30 hover:border-base-300",
  createLinkLabel:"cursor-pointer me-2",
  createButton: "text-primary text-2xl",
  tableContainer: "w-3/4 bg-base-100 p-2",  
  table: (theme: theme) => `${theme === "dark" ? "text-neutral-300" : ""} table align-middle`,
  tableHead:"text-base",
  tableRow: "col-number col-title col-category col-author col-actions",
  theadButton: "btn btn-error btn-sm w-fit",
  tableDivider: "divide-y divide-gray-300",
  tdDropContainer:"dropdown dropdown-right ",
  dropdownButton: "btn btn-ghost btn-circle",
  ulDropdown:"dropdown-content menu menu-compact bg-base-100 rounded-box w-52 shadow absolute right-0 mt-2 z-1 border",
  liElement: "w-full",
  linkItem:"me-2 flex items-center",
  iconStyle: "mr-2",
  listDeleteButton: "btn btn-error btn-sm bg-opacity-75 flex items-center justify-start",
  dropdownContainer: "dropdown dropdown-right ",
  dropdownActionButton: "btn btn-ghost btn-circle",
  dropdownListContainter: "dropdown-content menu menu-compact bg-base-100 rounded-box w-52 shadow absolute right-0 mt-2 z-1 border",
  spinnerPreview:"w-full h-full flex justify-center items-center",
  spinnerSpan:"loading loading-spinner text-info loading-lg",
  detailsButton: "me-2 flex items-center",
  editButton: "me-2 flex items-center justify-start",
  deleteButton: "btn btn-error btn-sm bg-opacity-75 flex items-center justify-start",
  paginationContainer: "flex justify-center fixed bottom-5 bg-base-150 shadow-md rounded-xl border",
};




