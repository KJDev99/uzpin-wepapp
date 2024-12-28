import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getDisplayedPages = () => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 2) pages.push(1, "...");
      if (currentPage === 1) {
        pages.push(currentPage, currentPage + 1);
      } else if (currentPage === totalPages) {
        pages.push(currentPage - 1, currentPage);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
      if (currentPage < totalPages - 1) pages.push("...", totalPages);
    }

    return pages;
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="my-4 flex items-center justify-end gap-2 pb-4">
      {displayedPages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`rounded px-3 py-1 ${
              page === currentPage
                ? "bg-[#ffba00] text-[#343434]"
                : "bg-[#FFFFFF] text-[#343434]"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-3 py-1 text-[#343434]">
            ...
          </span>
        )
      )}
    </div>
  );
};

export default Pagination;
