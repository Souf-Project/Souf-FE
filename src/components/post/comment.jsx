export default function Comment() {
    return (
        <div>
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-sm text-gray-400">2025-01-01</p>
                </div>
                <p className="text-medium text-gray-800 font-medium">댓글 내용입니다.</p>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                    <button>답글 달기</button>
                    <button>답글 열기</button>
                </div>
            </div>
           </div>
        </div>
    )
}