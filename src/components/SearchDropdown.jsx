import React, { useState } from 'react';

export default function SearchDropdown({ onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('제목');

    const options = [
        { value: 'title', label: '제목' },
        { value: 'content', label: '내용' },
    ];

    const handleSelect = (option) => {
        setSelectedOption(option.label);
        onSelect(option.value);
        setIsOpen(false);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.search-dropdown')) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative search-dropdown">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-32 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
                <span className="text-sm font-medium text-gray-700">{selectedOption}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 flex flex-col w-32">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                selectedOption === option.label ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 