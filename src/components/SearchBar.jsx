import React from 'react';
import searchIco from '../assets/images/searchIco.svg';

export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <form onSubmit={onSubmit} className="w-[300px]">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full px-6 py-1 text-lg rounded-[30px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] focus-none"
                />
                <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                    <img src={searchIco} alt="search" className="w-6 h-6" />
                </button>
            </div>
        </form>
    );
} 