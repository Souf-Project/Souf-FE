import React from 'react';
import searchIco from '../assets/images/searchIco.svg';

export default function SearchBar({ value, onChange, onSubmit, placeholder 
    ,width="w-[300px]", height="py-2"
}) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(value);
    };

    return (
        <form onSubmit={handleSubmit} className={`${width}`}>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`w-full pl-3 pr-10 md:pr-12 ${height} text-sm rounded-[10px] shadow-sm focus:outline-none focus:ring-2 focus:border-transparent bg-blue-bright placeholder:text-blue-500 placeholder:text-[10px]`}
                />
                <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                >
                    <img src={searchIco} alt="search" className="w-4 h-4 md:w-6 md:h-6" />
                </button>
            </div>
        </form>
    );
} 