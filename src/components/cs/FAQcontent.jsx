import { useState } from "react";
import SearchBar from "../SearchBar";
import Accordian from "./accordian";

export default function FAQcontent({ onInquiryClick }) {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() === "") {
            setIsSearching(false);
            setFilteredData([]);
            return;
        }
        
        // 검색을 위해 모든 FAQ 데이터를 하나의 배열로 합침
        const allFaqData = [
            ...faqData1.map(item => ({ ...item, category: '계정/인증' })),
            ...faqData2.map(item => ({ ...item, category: '프로필·피드' })),
            ...faqData3.map(item => ({ ...item, category: '외주 공고·지원/견적' })),
            ...faqData4.map(item => ({ ...item, category: '매칭·채팅' })),
            ...faqData5.map(item => ({ ...item, category: '표준 계약서·전자서명' })),
            ...faqData6.map(item => ({ ...item, category: '결제·정산' }))
        ];

        const filtered = allFaqData.filter(item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.ulList && item.ulList.some(listItem => 
                listItem.toLowerCase().includes(searchQuery.toLowerCase())
            )) ||
            (item.olList && item.olList.some(listItem => 
                listItem.toLowerCase().includes(searchQuery.toLowerCase())
            )) ||
            (item.quotation && item.quotation.some(quote => 
                quote.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        );
        
        setFilteredData(filtered);
        setIsSearching(true);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim() === "") {
            setIsSearching(false);
            setFilteredData([]);
        }
    };

    const faqData1 = [
        {
            question: "대학생 인증은 어떻게 하나요?",
            answer: "학교 이메일로 간편 인증합니다.",
            ulList: [
                 "우측 상단 [대학생 인증하기] 클릭",
                 "학교 이메일(@univ.ac.kr 등) 입력 → 인증번호 발송",
                 "받은 인증번호 입력 → 완료",
            ],
            quotation: [
                "메일이 안 보이면 스팸함을 확인하고, 5분 후에도 없으면 재발송을 눌러주세요.",
                "학교 이메일이 없거나 인증이 어려운 경우, 학생증/재(휴)학·졸업(예정) 증명서로 대체 인증을 요청할 수 있습니다."
            ]
        },
        {
            question: "팀/조직 계정으로 운영할 수 있나요?",
            answer: "가능합니다.",
            ulList: [
                "공급자(프리랜서) 역할에서 동아리/팀 명의로 프로필을 운영할 수 있습니다.",
                "대표 1인이 계정을 생성한 뒤, 프로필 설명에 팀 구성·역할·연락처를 명확히 기재해 주세요.",
                "계약은 실제 작업 책임자(대표 또는 지정자) 명의로 진행됩니다."
            ]
        },
        {
            question: "비밀번호를 잊었어요 / 로그인이 안 돼요. 어떻게 복구하나요?",
            answer: "비밀번호 재설정 기능을 이용해 주세요.",
            olList: [
                "로그인 화면 [비밀번호 재설정] 클릭",
                "가입 이메일 입력 → 인증번호 발송",
                "받은 인증번호 입력 → 비밀번호 재설정 페이지로 이동",
                "새로운 비밀번호 입력 → 비밀번호 재설정 완료",
            ],
           
        },
        {
            question: "회원 탈퇴 시 내 데이터(피드/후기/계약)는 어떻게 처리되나요?",
            answer: "즉시 비공개 처리되며, 법정·정산 근거 보관 후 안전 삭제됩니다.",
            ulList: [
                "탈퇴 즉시 피드/후기는 비공개 전환됩니다.",
                "계약·정산 관련 기록은 분쟁 대응 및 관련 법령 준수를 위해 최대 1년 보관 후 안전하게 삭제(또는 비식별화)됩니다.",
                "공동 작업물·상대방과 연관된 기록은 상대방의 권리 보호를 위해 일부가 유지될 수 있습니다."
            ]
        },
        {
            question: "알림(이메일/푸시) 설정은 어디서 바꾸나요?",
            answer: "마이페이지에서 변경할 수 있습니다.",
            ulList: [
                "마이페이지 › 알림 설정에서 이메일/푸시/웹 알림을 켜고 끌 수 있습니다.",
                "보안·결제·계약 체결 등 중요 알림은 해제할 수 없습니다.",
            ]
        }

    ];
    const faqData2 = [
        {
            question: "태그/카테고리 노출은 추천에 영향을 주나요?",
            answer: "네, 영향을 줍니다.",
            ulList: [
                "태그·카테고리는 검색 결과와 추천(맞춤 피드)에 반영됩니다.",
                "다만 노출은 콘텐츠 품질(이미지/설명/성과), 활동도, 후기 등 종합 지표로 결정됩니다.",
                "팁: 전공·툴·도메인 태그를 3–5개 내로 정확히 기재하세요. 예) #브랜딩 #UI #섬유 #Python"
            ]
        },
        {
            question:"결과물에 저작권·초상권이 있으면 올려도 되나요?",
            answer: " 권리 보유자(당사자)의 허락 없이는 업로드할 수 없습니다.",
            ulList: [
                "본인이 만든 콘텐츠라도 타인의 초상/상표/배경 음악/폰트 등이 포함되면 사용 허락이 필요합니다.",
                "기업 프로젝트 결과물은 계약서의 저작권·공개 범위에 따라 게시하세요.",
                "권리 협의 없이 게시하여 분쟁이 발생한 경우, 게시자는 전적인 책임을 부담하며, 플랫폼은 약관에 따라 게시물을 비공개/삭제할 수 있습니다.",
                "팁: 민감 정보는 가리고, 가능하면 비식별 처리(얼굴 모자이크, 로고 제거)를 권장합니다."
            ]
        },
        {
            question: "부적절한 피드를 발견했어요. 신고는 어떻게 하나요?",
            answer: "피드 상단의 ⋯ 버튼에서 신고할 수 있습니다.",
            olList: [
                "피드 상단 ⋯(더보기) 클릭 → 신고하기 선택",
                "사유 선택(저작권/초상권/욕설·비방/스팸 등) → 필요 시 설명 첨부",
                "제출하면 운영팀이 검토 후 조치(비공개, 수정 요청, 계정 제재 등)합니다.",
            ]
        },
       
    ];
    const faqData3 = [
        {
            question: "“견적 받아보기”와 “생각한 금액이 있어요”의 차이는 무엇인가요?",
            answer: "예산 확실/불확실에 따라 선택합니다.",
            ulList: [
                "생각한 금액이 있어요: 의뢰자가 예산을 고정해 공고를 올립니다. 지원자는 해당 예산을 기준으로 지원합니다.",
                "견적 받아보기: 예산이 애매하면 선택하세요. 지원자가 제안가·일정·작업범위를 함께 보내며, 의뢰자는 제안을 비교·협의하에 결정합니다.",
            ]
        },
        {
            question: "여러 지원자의 견적을 비교·정렬할 수 있나요?",
            answer: "마이페이지의 [지원 내역]에서 한 화면 비교가 가능합니다.",
            ulList: [
                "제안가, 예상 일정, 포트폴리오, 후기(평점)를 비교하고 필요 시 정렬/필터하여 확인하세요.",
                "더 확인이 필요하면 지원자와 1:1 채팅으로 상세 협의가 가능합니다.",
            ]
        },
        
    ];
    const faqData4 = [
        {
            question: "외부 메신저로 대화해도 되나요? (주의사항)",
            answer: "가능하지만 권장하지 않습니다.",
            ulList: [
                "안전한 계약/정산 및 기록 관리를 위해 플랫폼 내 채팅 사용을 권장합니다.",
                "플랫폼 표준 계약·정산을 통하지 않은 거래는 지원·분쟁 대응 대상에서 제외됩니다.",
                "외부 메신저 이용 시 개인정보 보호와 계약 증빙을 스스로 관리하셔야 합니다.",
            ]
        },
        {
            question: "채팅 기록은 계약서 작성에 반영되나요?",
            answer: "네. 합의된 핵심 항목을 바탕으로 계약서를 작성합니다.",
            ulList: [
                "채팅에서 정리한 금액·일정·산출물·수정횟수·저작권 등을 바탕으로 의뢰자가 [계약서 만들기]로 표준 계약서를 작성·전송하고, 전자서명으로 확정합니다.",
            ]
        },
    ];
    const faqData5 = [
        {
            question: "표준 계약서에는 어떤 조항이 포함되나요?",
            answer: "실무에 필요한 기본 조항이 모두 포함됩니다.",
            ulList: [
                "당사자 정보, 작업 범위/산출물, 기간, 금액/지급(선금·잔금), 검수·수정, 중도해지/지체상금, 저작권·사용권(포트폴리오 공개 포함), 기밀 유지, 불가항력, 관할 법원, 전자서명 등",
            ],
          
        },
        {
            question: "전자서명의 법적 효력은 어떻게 보장되나요?",
            answer: "본인 인증과 서명 이력 보관을 통해 계약 증빙을 갖춥니다.",
            ulList: [
                "계정 인증 정보, 서명 타임스탬프, 계약서 원본 파일을 보관하며, 양 당사자의 동의 사실을 근거로 계약 효력이 인정될 수 있습니다.",
                "실제 법적 분쟁 대응은 계약서 전문·서명 이력·결제 내역 등 기록으로 뒷받침됩니다.",
            ]
        },
        {
            question: "플랫폼 표준 계약서를 꼭 사용해야 하나요?",
            answer: "필수는 아니지만 강력히 권장드립니다.",
            ulList: [
                "Souf 표준 계약·정산 절차를 사용할 경우, 에스크로(선금/잔금)·환불 규정·기록을 기반으로 분쟁 시 자료 제공 등 지원이 가능합니다.",
                ""
            ]
        },
       
    ]
    const faqData6 = [
        {
            question: "결제는 어떤 수단을 지원하나요?",
            answer: "외부 결제 시스템을 통해 다양한 수단을 지원합니다.",
            ulList: [
                "신용/체크카드, 계좌이체, 가상계좌(무통장) 등을 이용할 수 있습니다.",
            ]
        },
        {
            question: "선금/잔금은 언제 지급되나요? 정산 일정은?",
            answer: "계약 확정 후 전액 결제 → 선금 즉시 지급 → 검수 승인 후 잔금 지급입니다.",
            olList: [
                "전자서명 완료 후, 의뢰자가 총액 결제(플랫폼 예치)",
                "플랫폼이 계약서 기준에 따라 선금을 즉시 프리랜서에게 지급",
                "작업 완료 → 의뢰자 검수 승인 시 잔금 자동 지급(수수료 제외)"
            ]
        },
        {
            question: "프로젝트 미완료/중단 시 잔금 환불은 어떻게 되나요?",
            answer: "계약 기준에 따라 예치된 잔금을 의뢰자에게 환불합니다.",
            ulList: [
                "프리랜서가 미완료·중단한 경우, 잔금은 환불되며 선금 환불 여부는 계약서 조건(진행분 정산 등)에 따릅니다.",
            ]
        },
        {
            question: "플랫폼 수수료는 얼마이며 언제 차감되나요?",
            answer: "잔금 정산 시 자동 차감됩니다.",
            ulList: [
                "수수료율은 요금 정책/요율표를 따르며, 계약 생성 단계에서 사전 고지됩니다.",
            ]
        },
        {
            question: "영수증/세금계산서 발급은 어떻게 하나요?",
            answer: "결제 내역에서 카드전표/현금영수증 출력이 가능하며, 플랫폼 수수료에 대한 세금계산서 발급을 지원합니다.",
            ulList: [
                "의뢰자 결제 건의 카드전표·현금영수증은 결제 내역에서 내려받을 수 있습니다.",
                "플랫폼 수수료에 대해서는 세금계산서 발급을 지원합니다.",
                "프리랜서 대금에 대한 세무 증빙은 계약서/정산 내역을 활용하시고, 사업자 형태에 따라 별도 서류가 필요할 수 있습니다."
            ]
        },
        {
            question: "개인 프리랜서 원천징수(3.3%)는 어떻게 처리하나요?",
            answer: "원칙적으로 의뢰자(지급자)의 책임이며, 플랫폼 정산 화면에서 적용 여부를 설정할 수 있도록 지원합니다(정책에 따름).",
            ulList: [
                "개인(사업자 미등록) 프리랜서에게 지급 시, 법령에 따라 3.3% 원천징수 대상일 수 있습니다.",
                "원천세 신고·납부 의무는 지급자(의뢰자)에게 있으며, 플랫폼의 원천징수 대행 기능 제공 여부는 운영 정책에 따릅니다.",
                "정확한 세무 처리는 세무 전문가와 상담하시기 바랍니다."
            ]
        },
    ]
    return (
        <div>
             <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                placeholder="어떤게 궁금하신가요?"
                width="w-1/2"
                height="py-4"
            />
            <div className="flex items-center gap-2 mt-4">
                <button
                        className={`pr-8 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 0 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(0)}
                    >
                        <span>계정/인증</span>
                      
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 1 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(1)}
                    >
                        <span>프로필·피드</span>
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 2 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(2)}
                    >
                        <span>외주 공고·지원/견적</span>
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 3 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(3)}
                    >
                        <span>매칭·채팅</span>
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 4 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(4)}
                    >
                        <span>표준 계약서·전자서명</span>
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 5 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(5)}
                    >
                        <span>결제·정산</span>
                    </button>
            </div>
            <div className="flex flex-col gap-4 mt-8">
                {isSearching ? (
                    filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <div key={index}>
                                <div className="text-sm text-gray-500 mb-2 font-medium">{item.category}</div>
                                <Accordian 
                                    question={item.question} 
                                    answer={item.answer} 
                                    ulList={item.ulList} 
                                    olList={item.olList} 
                                    quotation={item.quotation} 
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg">검색 결과가 없습니다.</p>
                            <p className="text-sm mt-2">다른 검색어로 시도해보세요.</p>
                        </div>
                    )
                ) : (
                  
                    <>
                        {activeTab === 0 && faqData1.map((item, index) => (
                            <Accordian key={index} question={item.question} answer={item.answer} ulList={item.ulList} olList={item.olList} quotation={item.quotation} />
                        ))}
                        {activeTab === 1 && faqData2.map((item, index) => (
                            <Accordian key={index} question={item.question} answer={item.answer} ulList={item.ulList} olList={item.olList} quotation={item.quotation} />
                        ))}
                        {activeTab === 2 && faqData3.map((item, index) => (
                            <Accordian key={index} question={item.question} answer={item.answer} ulList={item.ulList} olList={item.olList} quotation={item.quotation} />
                        ))}
                        {activeTab === 3 && faqData4.map((item, index) => (
                            <Accordian key={index} question={item.question} answer={item.answer} ulList={item.ulList} olList={item.olList} quotation={item.quotation} />
                        ))}
                        {activeTab === 4 && faqData5.map((item, index) => (
                            <Accordian key={index} question={item.question} answer={item.answer} ulList={item.ulList} olList={item.olList} quotation={item.quotation} />
                        ))}
                        {activeTab === 5 && faqData6.map((item, index) => (
                            <Accordian key={index} question={item.question} answer={item.answer} ulList={item.ulList} olList={item.olList} quotation={item.quotation} />
                        ))}
                    </>
                )}
            </div>
            <div className="flex items-center  gap-8 mt-8">
                <p className="text-2xl font-semibold">궁금한 점이 해결되지 않으셨나요?</p>
                <button className="px-10 py-4 bg-blue-500 text-white text-2xl font-bold rounded-lg"
                onClick={onInquiryClick}>문의하기</button>
            </div>
        </div>
    );
}