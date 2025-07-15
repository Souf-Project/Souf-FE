import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UpdateOption({ id, memberId, worksData, mediaData, onDelete}) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const navigate = useNavigate();

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (Number(id) !== memberId) return null;

  // console.log("여기 데이터 " , worksData);

  return (
    <div className="flex justify-end relative" ref={optionsRef}>
      <button
        onClick={() => setShowOptions((prev) => !prev)}
        className="text-xl px-2 py-1 rounded hover:bg-gray-100"
      >
        ⋯
      </button>

      {showOptions && (
        <div className="absolute right-[-100px] mt-2 w-28 bg-white border rounded shadow-lg z-10">
          <button
            onClick={() =>
              navigate("/postEdit", {
                state: { worksData, mediaData },
              })
            }
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            수정하기
          </button>
          <button
            onClick={onDelete}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}
