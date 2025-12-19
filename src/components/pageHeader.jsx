import SearchDropdown from './SearchDropdown';
import SearchBar from './SearchBar';

const PageHeader = ({ 
  leftText, 
  leftButtons = [], 
  showDropdown = false, 
  showSearchBar = false,
  onSearchTypeChange,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  searchPlaceholder = "검색어를 입력하세요",
  activeButtonIndex = -1,
  isTabMode = false
}) => {
  return (
    <div className="w-screen border-b border-gray-200 mb-4 py-4 pt-4 px-2 md:px-8 lg:px-0">
      <div className="flex justify-between items-center w-full max-w-[60rem] mx-auto px-4 md:px-0">
        <div className="flex items-center gap-4 text-md font-bold">
          {leftText && (
            <span className="text-gray-600">{leftText}</span>
          )}
          {isTabMode ? (
            <div className="flex">
              {leftButtons.map((button, index) => (
                <button
                  key={index}
                  className={`px-3 py-3 rounded-lg text-xl font-bold transition-colors duration-200 relative group ${
                    activeButtonIndex === index ? "text-blue-main" : "text-gray-700"
                  }`}
                  onClick={button.onClick}
                >
                  <span>{button.text}</span>
                  <span
                    className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-blue-main transition-all duration-300 ease-out ${
                      activeButtonIndex === index ? "w-3/4" : "w-0 group-hover:w-3/4"
                    }`}
                  ></span>
                </button>
              ))}
            </div>
          ) : (
            leftButtons.map((button, index) => (
              <button 
                key={index}
                className=""
                onClick={button.onClick}
              >
                {button.text}
              </button>
            ))
          )}
        </div>
        {(showDropdown || showSearchBar) && (
          <div className="flex items-center gap-4">
            {showDropdown && (
              <SearchDropdown onSelect={onSearchTypeChange} />
            )}
            {showSearchBar && (
              <SearchBar
                value={searchQuery}
                onChange={onSearchQueryChange}
                onSubmit={onSearch}
                placeholder={searchPlaceholder}
                width="w-full md:w-[300px]"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
