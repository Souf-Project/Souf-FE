import Comment from "./comment";
import sendIco from "../../assets/images/sendIco.svg";

export default function commentList() {
    return (
        <div className="flex flex-col rounded-2xl border border-gray-200 px-6 py-6 w-full shadow-sm max-w-4xl mx-auto mt-4 mb-24">
            <Comment />
            <div className="flex items-center gap-2 mt-4">
                <input className="w-full h-10 rounded-full border border-gray-200 px-4 py-2 transition-all duration-200 focus:outline-none focus:shadow-sm" placeholder="댓글을 입력해주세요."></input>
                <button className="w-16 h-10 rounded-full bg-yellow-point flex items-center justify-center">
                    <img src={sendIco} alt="sendIco" className="w-10 h-10" />
                </button>
            </div>
        </div>
    )
}