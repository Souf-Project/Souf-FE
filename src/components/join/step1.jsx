import { useState } from "react";
import dayjs from "dayjs";

export default function Step2() {
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [thirdPartyAgreement, setThirdPartyAgreement] = useState(false);
  const [marketingAgreement, setMarketingAgreement] = useState(false);

  return (
    <div className="mx-auto w-full sm:mt-[5%] rounded-[30px] sm:border-[1px] py-8 md:py-16 px-4 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-left mb-4">개인정보 동의</h2>
        
        {/* 스크롤 가능한 개인정보 동의 내용 */}
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 mb-6">
          <div className="w-full flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-left">1. 수집 항목 및 이용 목적</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="text-left">
                <tr className="border-b border-gray-300 text-left bg-gray-100">
                  <th className="w-2/5">수집 항목</th>
                  <th className="w-2/5">수집 목적</th>
                  <th className="w-1/5">보유 및 이용 기간</th>
                </tr>
                <tr className="border-b border-gray-100">
                  <td>이름, 이메일</td>
                  <td>회원 식별 및 본인 인증, 고지사항 전달</td>
                  <td>회원 탈퇴 시까지</td>
                </tr>
                <tr className="border-b border-gray-100">
                <td>비밀번호</td>
                <td>로그인 및 계정 보호</td>
                <td>회원 탈퇴 시까지</td>
                </tr>
                <tr className="border-b border-gray-100">
                <td>소속 학교, 학과</td>
                <td>기업 매칭 및 포트폴리오 정보 제공</td>
                <td>회원 탈퇴 시까지</td>
                </tr>
                <tr className="border-b border-gray-100">
                <td>IP 주소, 서비스 시용 기록</td>
                <td>서비스 개선, 보안 및 로그 기록</td>
                <td>3년</td>
                </tr>
                <tr className="border-b border-gray-100">
                <td>(선택) 프로필 사진, 자기소개, SNS 연동 정보</td>
                <td>개인화된 포트폴리오 제공</td>
                <td>회원 탈퇴 시까지</td>
                </tr>
                <tr>
                <td>(선택) 마케팅 수신 동의(이메일, SMS)</td>
                <td>이벤트, 혜택 안내 등 마케팅 정보 전달</td>
                <td>동의 철회 시까지</td>
                </tr>
              </thead>
                </table>
                <p>※ 귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으며, 필수 항목 동의 거부 시 회원가입 및 서비스 이용이 제한될 수 있습니다.</p>
            </div>
            <div className="w-full flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-left mt-4">2. 제3자 제공에 관한 사항</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="text-left">
                  <tr className="border-b border-gray-300 text-left bg-gray-100">
                    <th className="">제공받는 자</th>
                    <th className="">제공 항목</th>
                    <th className="">제공 목적</th>
                    <th className="">보유 및 이용 기간</th>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td>매칭 기업 회원사</td>
                    <td>이름, 소속, 포트폴리오 정보</td>
                    <td>채용 및 인재 매칭</td>
                    <td>매칭 후 1년 또는 동의 철회 시까지</td>
                  </tr>
                </thead>
                  </table>
                  <p>※ 제3자 제공에 대한 동의는 선택 사항이나, 동의하지 않을 경우 일부 매칭 서비스 이용에 제한이 있을 수 있습니다.</p>
            </div>
            <div className="w-full flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-left mt-4">3. 민감 정보 및 아동 정보</h3>
              <div className="flex">
              <span>
              회사는  
              </span>
              <span className="font-bold">
                민감정보(사상·신념, 건강 등)
                </span>
                <span>
                를 수집하지 않으며, 만 14세 미만 아동의 경우 법정대리인의 동의를 받아야 합니다.
              </span>
              </div>
            </div>
          </div>
        </div>

        {/* 동의 여부 체크박스 */}
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-left ml-6">동의 여부</h3>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 ml-6">
              <input
                type="checkbox"
                id="privacy-agreement"
                checked={privacyAgreement}
                onChange={(e) => setPrivacyAgreement(e.target.checked)}
                className="w-5 h-5 text-yellow-point bg-gray-100 border-gray-300 rounded focus:ring-yellow-point focus:ring-2"
              />
              <label htmlFor="privacy-agreement" className="text-lg">
                개인정보 수집 및 이용 동의 (필수)
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <input
                type="checkbox"
                id="third-party-agreement"
                checked={thirdPartyAgreement}
                onChange={(e) => setThirdPartyAgreement(e.target.checked)}
                className="w-5 h-5 text-yellow-point bg-gray-100 border-gray-300 rounded focus:ring-yellow-point focus:ring-2"
              />
              <label htmlFor="third-party-agreement" className="text-lg">
                제3자 제공 동의 (선택)
              </label>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <input
                type="checkbox"
                id="marketing-agreement"
                checked={marketingAgreement}
                onChange={(e) => setMarketingAgreement(e.target.checked)}
                className="w-5 h-5 text-yellow-point bg-gray-100 border-gray-300 rounded focus:ring-yellow-point focus:ring-2"
              />
              <label htmlFor="marketing-agreement" className="text-lg">
                마케팅 수신 동의 (선택)
              </label>
            </div>
            <div className="flex flex-col gap-2 mt-4 mx-6">
            <div className="flex flex-col gap-2 items-end border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">시행 일자:</p>
              <p className="text-sm text-gray-500">{dayjs().format('YYYY.MM.DD')}</p>
              </div>
              <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">회사명:</p>
              <p className="text-sm text-gray-500">주식회사 스프</p>
              </div>
              <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">연락처:</p>
              <p className="text-sm text-gray-500">010-1234-5678</p>
              </div>
           
            </div>
            </div>
           
          </div>
        </div>
      </div>
  );
}