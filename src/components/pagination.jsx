import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];

    let startPage = 0;
    let endPage = totalPages;

    if (totalPages > 10) {
        if (currentPage < 5) {
            // 지금 0-4일때
            startPage = 0;
            endPage = 10;
        } else if (currentPage > totalPages - 6) {
            // 현재 페이지가 끝에서 5개 이내면 마지막 10개 보여줌
            startPage = totalPages - 10;
            endPage = totalPages;
        } else {
            // 그 외에는 현재 페이지가 중앙(5번째) 위치하도록 보여줌
            startPage = currentPage - 4;
            endPage = currentPage + 6;
        }
    } else {
        // 10페이지 이하일 땐 전부 보여줌
        startPage = 0;
        endPage = totalPages;
    }

    for (let i = startPage + 1; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-2 my-10">
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
