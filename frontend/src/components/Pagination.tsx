import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7; // Odd number to keep current page in the middle
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range of pages to show
      const halfMaxPages = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(currentPage - halfMaxPages, 1);
      let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
      
      // Adjust if we're at the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }
      
      // Add first page and ellipsis
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add last page and ellipsis
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-8 space-x-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md focus:outline-none disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>

      {pageNumbers.map((page, idx) => (
        <React.Fragment key={idx}>
          {page === '...' ? (
            <span className="px-3 py-1">...</span>
          ) : (
            <button
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-3 py-1 rounded-md focus:outline-none ${
                page === currentPage
                  ? 'bg-red-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md focus:outline-none disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;