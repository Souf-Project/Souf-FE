import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/pageHeader";
import FilterDropdown from "../components/filterDropdown";
import firstCategoryData from "../assets/categoryIndex/first_category.json";
import secondCategoryData from "../assets/categoryIndex/second_category.json";
import soufMockup from "../assets/images/soufMockup.png";

export default function Review() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedFirstCategory, setSelectedFirstCategory] = useState("");
    const [selectedSecondCategory, setSelectedSecondCategory] = useState("");
    
    // 대분류 옵션
    const firstCategoryOptions = [
        { value: "", label: "전체" },
        ...firstCategoryData.first_category.map(category => ({
            value: category.first_category_id.toString(),
            label: category.name
        }))
    ];
    
    // 중분류 옵션 (선택된 대분류에 따라 필터링)
    const secondCategoryOptions = [
        { value: "", label: "전체" },
        ...secondCategoryData.second_category
            .filter(category => selectedFirstCategory === "" || category.first_category_id === parseInt(selectedFirstCategory))
            .map(category => ({
                value: category.second_category_id.toString(),
                label: category.name
            }))
    ];


    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };
    
    const handleFirstCategoryChange = (value) => {
        setSelectedFirstCategory(value);
        setSelectedSecondCategory(""); // 대분류 변경 시 중분류 초기화
    };
    
    const handleSecondCategoryChange = (value) => {
        setSelectedSecondCategory(value);
    };


    return (
        <div className="w-screen">
            <PageHeader
                leftButtons={[
                    { text: "외주 후기", onClick: () => navigate("/review") }
                ]}
            />
            <div className="flex gap-4 w-full max-w-[100rem] mx-auto">
                <div className="h-80 bg-zinc-300 w-full" />
                <div className="h-80 bg-orange-400 w-full" />
                <div className="h-80 bg-zinc-300 w-full" />
            </div>
            <div className="max-w-[60rem] flex items-center mx-auto mt-8 flex-col">
                <h1 className="text-lg font-bold mr-auto">BEST 후기</h1>
                <div className="mt-4 flex items-center gap-6">
                    <div className="w-56 h-40 bg-blue-500/20 rounded-[5px] shadow-md"/>
                    <div className="w-56 h-40 bg-yellow-400/5 rounded-[5px] shadow-md"/>
                    <div className="w-56 h-40 bg-blue-500/20 rounded-[5px] shadow-md"/>
                    <div className="w-56 h-40 bg-yellow-400/5 rounded-[5px] shadow-md"/>
                </div>
            </div>
            
            {/* 별도의 탭 컴포넌트 */}
            <div className="max-w-[60rem] mx-auto mt-8">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`pl-1 py-2 text-lg font-bold transition-colors duration-200 relative group ${
                            activeTab === 0 ? "text-blue-main" : "text-gray-700"
                        }`}
                        onClick={() => handleTabChange(0)}
                    >
                        <span>기업 매칭 후기</span>
                        <span
                            className={`absolute bottom-0 left-14 transform -translate-x-1/2 h-[3px] bg-blue-main transition-all duration-300 ease-out ${
                                activeTab === 0 ? "w-28" : "w-0 group-hover:w-2/3"
                            }`}
                        ></span>
                    </button>
                    <button
                        className={`px-6 py-2 text-lg font-bold transition-colors duration-200 relative group ${
                            activeTab === 1 ? "text-blue-main" : "text-gray-700"
                        }`}
                        onClick={() => handleTabChange(1)}
                    >
                        <span>학생 활동 후기</span>
                        <span
                            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[3px] bg-blue-main transition-all duration-300 ease-out ${
                                activeTab === 1 ? "w-3/4" : "w-0 group-hover:w-2/3"
                            }`}
                        ></span>
                    </button>
                </div>
                 <div className="flex justify-between items-center mt-6">
                     <div className="flex items-center gap-4">
                         <FilterDropdown
                             options={firstCategoryOptions}
                             selectedValue={selectedFirstCategory}
                             onSelect={handleFirstCategoryChange}
                             placeholder="대분류 선택"
                         />
                         <FilterDropdown
                             options={secondCategoryOptions}
                             selectedValue={selectedSecondCategory}
                             onSelect={handleSecondCategoryChange}
                             placeholder="중분류 선택"
                             width="w-52"
                         />
                     </div>
                 </div>
                
                {/* 탭 내용 */}
                <div className="mt-6 px-4">
                    {activeTab === 0 && (
                        <div className="w-full mb-32">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg border">
                                    <h3 className="font-semibold text-blue-800">웹 개발 프로젝트</h3>
                                    <p className="text-sm text-gray-600 mt-2">훌륭한 품질과 빠른 완성도로 만족스러웠습니다.</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border">
                                    <h3 className="font-semibold text-green-800">디자인 작업</h3>
                                    <p className="text-sm text-gray-600 mt-2">창의적이고 전문적인 디자인을 제공해주셨습니다.</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border">
                                    <h3 className="font-semibold text-purple-800">앱 개발</h3>
                                    <p className="text-sm text-gray-600 mt-2">사용자 친화적인 인터페이스로 완성도가 높았습니다.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 1 && (
                        <div className="w-full mb-32">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="w-full h-44 bg-neutral-50 rounded-lg shadow-md p-4 flex items-center gap-2">
                                    <img src={soufMockup} alt="soufMockup" className="w-36 h-36 rounded-md" />
                                    <div className="flex flex-col gap-2">
                                        <span className="text-yellow-300 text-2xl font-bold">★★★★★</span>
                                        <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">관영 컴퍼니</h3>
                                        <span className="text-gray-500 text-sm">2025.05.02</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">브랜드 아이덴티티를 완벽하게 구현해주셨습니다.</p>
                                    </div>
                                </div>
                              
                               
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}