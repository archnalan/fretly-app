import React from "react";
import { PageModel } from "../../DataModels/PageModel";
import { Link } from "react-router-dom";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

type PageCardsType = {
  pageList: PageModel[];
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setToDelete: React.Dispatch<React.SetStateAction<PageModel | undefined>>;
};
const PageCards: React.FC<PageCardsType> = ({
  pageList,
  setToDelete,
  setOpenConfirm,
}) => {
  return (
    <>
      {pageList.map((item) => (
        <div
          key={item.id}
          className="w-full grid grid-cols-10 items-center rounded-lg bg-base-100 shadow-lg p-3 mb-3  cursor-pointer"
        >
          <input type="checkbox" className="checkbox-xs ms-2" />
          <span className="">{String(item.id).padStart(3, "0")}</span>
          <span className="col-span-2">{item.title}</span>
          <span className="col-span-4">{item.content}</span>
          <span className="">{item.sorting}</span>
          <div className="flex dropdown dropdown-end drop-shadow-sm">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost hover:bg-transparent z-[0]"
            >
              <BsThreeDotsVertical />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li className="flex justify-between ">
                <Link
                  to={`${item.id}`} /* className="btn btn-info btn-sm me-2 " */
                >
                  <FiList className="me-2 text-bg-base" />
                  <span className="">Details</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`edit/${item.id}`}
                  /* className="btn btn-primary btn-sm me-2" */
                >
                  <FiEdit className="me-2 text-primary" />
                  <span className="">Edit</span>
                </Link>
              </li>
              <li>
                <button
                  className="bg-error btn-sm hover:text-error text-base-100 "
                  onClick={() => {
                    setToDelete(item);
                    setOpenConfirm(true);
                  }}
                >
                  <FiTrash2 className="me-2" />
                  <span className="">Delete</span>
                </button>
              </li>
            </ul>
          </div>
          <span></span>
        </div>
      ))}
    </>
  );
};

export default PageCards;
