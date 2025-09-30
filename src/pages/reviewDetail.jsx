import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/pageHeader";
import soufMockup from "../assets/images/soufMockup.png";
import RecommendRecruit from "../components/recruit/recommendRecruit";

export default function ReviewDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // state에서 카테고리 데이터 받아오기
    const firstCategory = location.state?.firstCategory || "전체";
    const secondCategory = location.state?.secondCategory || "전체";
    
    const handleSearch = (e) => {
        e.preventDefault();
        console.log(e.target.value);
    };
    return (
        <div>
            <PageHeader
                leftButtons={[
                    { text: `외주 후기 > ${firstCategory} > ${secondCategory}`, onClick: () => navigate("/review") }
                ]}
                showDropdown={true}
                showSearchBar={true}
                searchPlaceholder="검색어를 입력하세요"
                onSearch={handleSearch}
            />
            <div className="w-full max-w-[60rem] mx-auto flex gap-8 mb-40">
                <div className="w-2/3 flex flex-col gap-8">
                    <img src={soufMockup} alt="soufMockup" className="w-full h-auto object-cover rounded-xl" />
                    <div className="flex flex-col gap-2 border-b border-gray-700 pb-4">
                    <h1 className="text-base font-bold">열매로운 로고</h1>
                    {/* <div className="flex items-center gap-2">
                        <div className="border border-gray-200 rounded-md text-blue-main text-sm font-bold px-2 py-1 shadow-md">디지털 콘텐츠</div>
                        <div className="border border-gray-200 rounded-md text-blue-main text-sm font-bold px-2 py-1 shadow-md">마케팅 디자인</div>
                    </div> */}
                    </div>
                    <div className="flex flex-col gap-4 border-b border-gray-700 pb-4">
                        <div className="text-base font-bold">평가</div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-300 text-2xl font-bold">★</span>
                            <span className="text-base font-bold">4.5</span>
                        </div>
                    <div className="text-base font-bold">후기 내용 💬</div>
                    <div className="text-neutral-700 text-md font-regular leading-5">Lorem ipsum nulla semper amet pellentesque adipiscing a tellus gravida congue fermentum in cras condimentum neque dictum blandit arcu nisi nisl ornare feugiat amet urna ligula facilisis tristique id id viverra tellus eget elit mi commodo adipiscing tempus turpis dui sed id aliquam est pretium mollis nunc nunc blandit posuere scelerisque volutpat fringilla tincidunt cras tincidunt aenean vitae mattis ultrices sit hendrerit penatibus aliquam vivamus blandit nam at molestie dolor id quis sed integer turpis lacus eleifend quis nulla facilisi fringilla varius hendrerit volutpat nisl fermentum in faucibus ac ultrices nisl suscipit mattis neque risus turpis nullam sit imperdiet sed dictum massa suspendisse bibendum habitant amet eget vitae nec at dolor nibh nulla nibh egestas sodales ultricies ornare urna</div>
                    </div>
                </div>


                <div className="w-1/3 h-fit flex flex-col gap-2 bg-white rounded-[5px] border border-gray-200 p-4 bg-[#FFFDFD]">
                    <div className="flex justify-between items-center gap-2 text-neutral-600 text-xs font-bold ">
                        <div>
                        <span>{firstCategory}</span>
                        <span>{secondCategory}</span>
                        </div>
                        <button className="bg-blue-main text-white text-xs font-bold px-2 py-1 rounded-[5px]">&gt;</button> 
                    </div>
                   
                    <div className="text-neutral-800 text-base font-bold">
                    성공을 향해 발사하다 프로젝트 제작
                    </div>
                    <div className="text-zinc-500 text-xs font-bold">
                    관영컴퍼니
                    </div>
                    <span className="h-[0.5px] w-full bg-gray-300"></span>
                    
                    
                </div>
            </div>
        </div>
    )
}