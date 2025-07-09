import { useState, useRef, useEffect } from "react";

export default function Hashtag() {
  const [tags, setTags] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleAddClick = () => {
    setIsInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
      setIsInputVisible(false);
    }
    //esc 눌럿을 때
    if (e.key === "Escape") {
      setInputValue("");
      setIsInputVisible(false);
    }
    //암것도 입력 안하고 바깥클릭하면 +로 남게 추가할 예정..
  };

  useEffect(() => {
    if (isInputVisible) {
      inputRef.current?.focus();
    }
  }, [isInputVisible]);

  return (
    <div>
      <div className="font-semibold text-lg mb-1">
        해시태그{" "}
        <span className="text-gray-400 text-sm font-normal">(선택)</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {isInputVisible ? (
          <input
            ref={inputRef}
            className="px-3 py-1 rounded-lg border text-sm outline-none max-w-[120px]"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="입력 후 Enter"
          />
        ) : (
          <button
            onClick={handleAddClick}
            className="px-3 py-1 min-w-[80px] rounded-lg border text-sm text-gray-500 hover:bg-gray-100"
          >
            +
          </button>
        )}

        {tags.map((tag, idx) => (
          <div key={idx} className="px-3 py-1 rounded-lg border text-sm">
            #{tag}
          </div>
        ))}
      </div>
    </div>
  );
}
