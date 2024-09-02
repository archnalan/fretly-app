import React from "react";
import ReactPaginate from "react-paginate";
import { GrNext, GrPrevious } from "react-icons/gr";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
  const handlePageClick = (data: { selected: number }) => {
    onPageChange(data.selected);
  };

  return (
    <ReactPaginate
      previousLabel={<GrPrevious />}
      nextLabel={<GrNext />}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      containerClassName={"w-full flex justify-center bottom-5 join rounded-xl"}
      pageClassName={"join-item btn btn-sm"}
      pageLinkClassName={"join-item btn-link"}
      activeClassName={"join-item btn-active"}
      nextLinkClassName={"join-item btn-link "}
      nextClassName={"join-item btn btn-sm"}
      nextAriaLabel="Next"
      previousLinkClassName={"join-item btn-link"}
      previousClassName={"join-item btn btn-sm"}
      previousAriaLabel="Previous"
      breakLinkClassName={"join-item btn-link"}
    />
  );
};

export default Pagination;
