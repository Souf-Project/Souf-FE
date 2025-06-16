import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`w-[20px] h-[20px] flex items-center justify-center text-sm ${
                    currentPage === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-yellow-point'
                }`}
            >
                &lt;
            </button>
            
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number - 1)}
                    className={`w-[20px] h-[20px] flex items-center justify-center text-sm ${
                        currentPage === number - 1
                            ? 'text-yellow-point font-bold'
                            : 'text-gray-700 hover:text-yellow-point'
                    }`}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`w-[20px] h-[20px] flex items-center justify-center text-sm ${
                    currentPage === totalPages - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-yellow-point'
                }`}
            >
                &gt;
            </button>
        </div>
    );
}
