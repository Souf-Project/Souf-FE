import { useState } from 'react';
import SEO from '../components/seo';
import PageHeader from '../components/pageHeader';
import arrow from '../assets/images/backArrow.svg';

export default function Contest() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
        <style>{`
            .prize-card-fill-up {
                transition: all 0.3s;
            }
            
            .prize-card-fill-up:hover {
                background: transparent;
                box-shadow: inset 0 -150px 0 0 rgba(123, 182, 255, 0.7);
            }
            
            .prize-card-fill-up.second:hover {
                box-shadow: inset 0 -150px 0 0 rgba(161, 204, 241, 0.7);
            }
            
            .prize-card-fill-up.third:hover {
                box-shadow: inset 0 -150px 0 0 rgba(206, 228, 241, 0.7);
            }
        `}</style>
        <SEO title="피드 경진대회 정보" description="스프 SouF 대학생 피드 경진대회" subTitle="스프" />
        <PageHeader leftText="경진대회" />
            <div className="w-full max-w-[60rem] mx-auto px-4 md:px-6 py-12">
                {/* 헤더 섹션 */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        SOUF 대학생 피드 경진대회
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base">2025년 2월 2일 ~ 2월 28일</p>
                </div>

                {/* 설명 섹션 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <div className="text-gray-800 leading-relaxed space-y-4">
                        <p className="text-lg md:text-xl font-medium">
                            디자인·음악·촬영·IT 등 내가 만든 작품을 피드로 올리고, 좋아요로 실력을 증명해보세요.
                        </p>
                        <p className="text-lg md:text-xl text-gray-700">
                            대학생이라면 누구나 참여 가능하며, 가장 많은 좋아요을 받은 사람이 수상의 주인공이 됩니다.
                        </p>
                        <p className="text-lg md:text-xl text-gray-700">

                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        참가 자격 및 참여 방법
                    </h2>
                    <div className="space-y-6 text-lg">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">참가 자격</h3>
                            <p className="text-gray-700 mb-2">
                                만 19세 이상 대학교 재학·휴학·졸업생으로 SouF 회원 가입 및 학교 인증을 완료한 개인만 참여할 수 있습니다.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">참여 방법</h3>
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-start gap-3">
                                    <span className="text-blue-main font-bold text-lg min-w-[100px]">STEP 1.</span>
                                    <span className="text-gray-700">SOUF에 '대학생 계정'으로 가입한다.</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-start gap-3">
                                    <span className="text-blue-main font-bold text-lg min-w-[100px]">STEP 2.</span>
                                    <span className="text-gray-700">나의 실력을 뽐낼 수 있는 이미지와 함께 피드를 업로드한다.</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-start gap-3">
                                    <span className="text-blue-main font-bold text-lg min-w-[100px]">STEP 3.</span>
                                    <span className="text-gray-700">다른 참여자의 피드에 좋아요를 3개 이상 누르면 참여 완료!</span>
                                </div>
                            </div>
                            <p className="text-gray-700 mt-4 pt-4 border-t border-gray-200">
                                <span className="font-semibold">대회 기간 중 피드 게시물 1개 이상 업로드 시 자동으로 참가가 확정됩니다.</span> (별도 신청 없음)
                            </p>
                        </div>
                    </div>
                </div>

                {/* 일정 섹션 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        일정
                    </h2>
                    <div className="space-y-6 text-lg">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <span className="text-gray-600 font-semibold min-w-[80px]">진행 기간</span>
                            <span className="text-gray-900 font-bold">2025년 2월 2일 ~ 2월 28일</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <span className="text-gray-600 font-semibold min-w-[80px]">심사 기간</span>
                            <span className="text-gray-900 font-bold">2025년 3월 1일 ~ 3월 8일</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <span className="text-gray-600 font-semibold min-w-[80px]">결과 발표</span>
                            <span className="text-blue-main font-bold">2025년 3월 9일</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        심사 및 수상
                    </h2>
                    <div className="space-y-6 text-lg">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">심사 기준</h3>
                            <div className="space-y-3 text-gray-700">
                                <p>사용자가 업로드한 <span className="text-blue-main font-bold">모든 피드의 총합</span>으로 대학생 피드 경진대회 수상자를 선정합니다.</p>
                                <p>SOUF 피드 가이드라인에 맞게 업로드한 피드만 계산됩니다.</p>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="font-semibold text-gray-900 mb-2">점수 구성:</p>
                                    <ul className="space-y-2 list-disc list-inside">
                                        <li>피드 좋아요 수 합산 (85%)</li>
                                        <li>심사위원 점수 (15%, SouF 운영진)</li>
                                    </ul>
                                    <p className="mt-3 text-gray-700">최종 점수 합산 기준으로 수상자를 선정합니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 상금 섹션 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        시상 내역
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="prize-card-fill-up border border-gray-200 rounded-lg p-6 hover:border-[#7BB6FF] transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-600 font-lg text-2xl">1등</span>
                               
                            </div>
                            <p className="text-xl font-bold text-gray-900">30만원</p>
                        </div>
                        <div className="prize-card-fill-up second border border-gray-200 rounded-lg p-6 hover:border-[#A1CCFF] transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-600 font-lg text-2xl">2등</span>
                               
                            </div>
                            <p className="text-xl font-bold text-gray-900">15만원</p>
                        </div>
                        <div className="prize-card-fill-up third border border-gray-200 rounded-lg p-6 hover:border-[#CEE4FF] transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-600 font-lg text-2xl">3등</span>
                               
                            </div>
                            <p className="text-xl font-bold text-gray-900">10만원</p>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">상금 지급</h3>
                        <div className="space-y-3 text-lg text-gray-700">
                            <p>상금은 계좌이체로 지급됩니다.</p>
                            <p>관련 법령에 따라 제세공과금이 원천징수될 수 있으며, 25만 원 초과 시 4.4%가 원천징수됩니다.</p>
                            <p className="font-semibold">상금 지급을 위해 수상자에 한해 계좌정보 제출이 필요합니다.</p>
                        </div>
                    </div>
                </div>

                {/* 추가 혜택 섹션 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        참여 혜택
                    </h2>
                    <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3">
                                <span className="text-gray-900 font-bold text-lg min-w-[80px]">조건 1</span>
                                <span className="text-gray-700 text-base md:text-lg">피드 1개 이상 업로드</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-gray-900 font-bold text-lg min-w-[80px]">조건 2</span>
                                <span className="text-gray-700 text-base md:text-lg">다른 참여자의 피드에 좋아요를 3개 이상 누르기</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-300">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-900 font-bold text-lg min-w-[80px]">보상</span>
                                <span className="font-bold text-lg md:text-2xl">
                                    추첨을 통해 <span className="text-blue-main font-bold">스타벅스 아메리카노 기프티콘 5명</span> 증정
                                </span>
                            </div>
                    </div>
                </div>

                {/* 저작권 섹션 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        저작권
                    </h2>
                    <div className="space-y-4 text-lg text-gray-700">
                        <p>응모작의 저작권은 응모자에게 귀속됩니다.</p>
                        <p>SouF는 대회 결과 발표 및 서비스 홍보 목적에 한해 응모작을 활용할 수 있으며, 이 경우 저작권자를 명확히 표시합니다.</p>
                        <p>응모작의 관리·삭제·노출 기준은 SouF 이용약관을 따릅니다.</p>
                    </div>
                </div>

                {/* 패널티 및 실격 섹션 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        패널티 및 실격
                    </h2>
                    <div className="text-lg text-gray-700">
                        <p>
                            저작권 침해, 도배, 부적절한 콘텐츠, 개인정보 노출 등 운영 정책 위반 시 게시물 삭제, 실격 또는 수상 취소 및 상금 환수가 이루어질 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* 분쟁 및 면책 섹션 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
                        분쟁 및 면책
                    </h2>
                    <div className="space-y-4 text-lg text-gray-700">
                        <p>분쟁 발생 시 상호 협의를 원칙으로 하며, 해결이 어려운 경우 관련 법령에 따릅니다.</p>
                        <p>천재지변 등 불가항력적 사유에 대해서는 책임을 지지 않으며, 주최 측의 고의·중과실이 있는 경우에는 관련 법령에 따라 책임을 부담합니다.</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-8 overflow-hidden">
                    <button
                        onClick={toggleAccordion}
                        className="w-full text-left transition-colors duration-200 flex items-center justify-between"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">SouF 피드 경진대회 운영 및 법적 고지</h2>
                        <img
                            src={arrow}
                            alt="화살표"
                            className={`w-6 h-6 transition-transform duration-500 ease-in-out flex-shrink-0 ${
                                isOpen ? "rotate-90" : "rotate-[270deg]"
                            }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="h-[1px] bg-gray-200 my-4"></div>
                        <div className="pb-4">
                            <div className="space-y-8 text-base md:text-lg text-gray-700">
                                {/* 제1조 */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">제1조 (저작권 및 응모작 이용)</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                        <p>본 경진대회에 업로드된 모든 응모작(텍스트, 이미지, 링크 등 포함)의 저작권은 해당 응모자에게 귀속됩니다.</p>
                                        <p>SouF는 경진대회 운영, 결과 발표, 서비스 및 브랜드 홍보를 목적으로 응모작을 비독점적으로 이용할 수 있습니다.</p>
                                        <p>SouF는 응모작을 활용하는 경우, 가능한 범위 내에서 응모자의 닉네임 또는 프로필명을 통해 저작권자를 명확히 표시합니다.</p>
                                        <p>응모작의 보관, 노출 제한, 삭제, 비공개 처리 등은 SouF 이용약관 및 관련 정책에 따릅니다.</p>
                                    </div>
                                </div>

                                {/* 제2조 */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">제2조 (응모 자격 및 참가 확정)</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                        <p>응모 자격은 다음 각 호를 모두 충족한 자로 합니다.</p>
                                        <ul className="list-decimal list-inside space-y-2 ml-4">
                                            <li>만 19세 이상인 자</li>
                                            <li>대학교 재학·휴학·졸업생</li>
                                            <li>SouF가 요구하는 학적 인증 서류 제출 및 승인 완료자</li>
                                        </ul>
                                        <p>개인 참가만 허용하며, 팀 단위 참가 및 공동 수상은 인정하지 않습니다.</p>
                                        <p>대회 기간 중 SouF 플랫폼에 피드 게시물 1건 이상을 업로드한 경우, 별도 신청 절차 없이 참가가 자동 확정됩니다.</p>
                                    </div>
                                </div>

                                {/* 제3조 */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">제3조 (심사 기준 및 선정 방식)</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                        <p>심사는 다음 기준에 따라 진행됩니다.</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>사용자 전체 피드 좋아요 수 총합: 85%</li>
                                            <li>심사위원 점수(주최 측): 15%</li>
                                        </ul>
                                        <p>최종 점수는 상기 항목을 합산하여 산정하며, 최고 득점 순으로 수상자를 선정합니다.</p>
                                        <p>심사 결과에 따른 세부 점수는 요청 시 공개할 수 있으며, 심사위원단의 최종 결정에 대한 이의는 공정성 유지를 위해 제한될 수 있습니다.</p>
                                    </div>
                                </div>

                                {/* 제4조 */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">제4조 (상금 지급 및 세금 처리)</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                        <p>상금은 수상자 본인 명의 계좌로 계좌이체 방식으로 지급합니다.</p>
                                        <p>상금 지급을 위해 수상자에 한해 다음 자료 제출을 요청할 수 있습니다.</p>
                                        <ul className="list-decimal list-inside space-y-2 ml-4">
                                            <li>신분 확인 정보(성명, 연락처)</li>
                                            <li>본인 명의 계좌정보(통장 사본 또는 계좌 확인 자료)</li>
                                            <li>세법상 원천징수 이행에 필요한 정보(필요 시)</li>
                                        </ul>
                                        <p>상금은 제세공과금 포함 금액이며, 관련 법령에 따라 원천징수 후 지급됩니다.</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>지급액 25만 원 초과 시 4.4% 원천징수</li>
                                            <li>25만 원 이하 지급 시 원천징수 생략</li>
                                        </ul>
                                        <p>제세공과금 처리 및 지급 증빙은 관계 법령에 따라 처리됩니다.</p>
                                    </div>
                                </div>

                                {/* 제5조 */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">제5조 (패널티 및 실격)</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                        <p>다음 각 호에 해당하는 경우, 사전 또는 사후 통지 후 게시물 삭제, 참가 실격, 수상 취소 및 상금 환수 조치를 할 수 있습니다.</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>개인정보 노출</li>
                                            <li>폭력·혐오·악의적 콘텐츠</li>
                                            <li>선정성·부적절한 콘텐츠</li>
                                            <li>욕설, 인신공격, 명예훼손</li>
                                            <li>저작권 침해 또는 표절</li>
                                            <li>반복성 게시글(도배) 및 비정상적 활동</li>
                                            <li>기타 SouF 이용약관 위반 행위</li>
                                        </ul>
                                        <p>수상 이후라도 위반 사실이 확인될 경우 수상을 취소하고 상금을 환수할 수 있습니다.</p>
                                    </div>
                                </div>

                                {/* 제6조 */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">제6조 (분쟁 해결)</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                        <p>본 경진대회와 관련하여 주최 측과 참가자 간 분쟁이 발생할 경우, 상호 성실히 협의하여 해결하도록 노력합니다.</p>
                                        <p>협의로 해결되지 않을 경우, 민법·저작권법 등 관계 법령에 따른 절차에 따르며, 필요 시 한국저작권위원회 분쟁조정 등 공신력 있는 조정 절차를 활용할 수 있습니다.</p>
                                    </div>
                                </div>

                                {/* 제7조 */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">제7조 (면책 및 책임 제한)</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                        <p>주최 측은 천재지변, 화재, 통신망 장애, 해킹 등 불가항력적 사유 또는 참가자의 고의·과실로 발생한 손해에 대해 책임을 지지 않습니다.</p>
                                        <p>다만, 주최 측의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 부담합니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}