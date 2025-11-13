export default function PrivacyPage() {
    return (
        <div className="max-w-[60rem] w-full mx-auto px-4 mt-12 mb-20">
              <h2 className="text-black font-bold text-4xl mb-6">개인정보처리방침</h2>

              <p className="text-black text-xl pl-4">
              스프(이하 “회사”)는 「개인정보 보호법」 및 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 처리하기 위해 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>

              <h3 className="text-black font-semibold text-3xl mb-6 mt-10">1. 처리의 목적 및 항목</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">
          회사는 다음 목적을 위하여 최소한의 개인정보를 처리합니다.
        </p>
        <table className="border border-black w-full text-left">
          <thead>
            <tr>
              <th className="border px-4 py-2">목적</th>
              <th className="border px-4 py-2">처리 항목(필수)</th>
              <th className="border px-4 py-2">선택 항목</th>
              <th className="border px-4 py-2">보유기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">회원가입 및 본인확인</td>
              <td className="border px-4 py-2">이름, 이메일(ID), 비밀번호</td>
              <td className="border px-4 py-2">프로필 사진, 자기소개, SNS 계정</td>
              <td className="border px-4 py-2">회원 탈퇴 시까지</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">대학(학력) 인증</td>
              <td className="border px-4 py-2">소속 학교, 학과(전공), 학교 이메일, 인증 이력</td>
              <td className="border px-4 py-2">(대체서류: 학생증/재(휴)학·졸업(예정) 증명서)</td>
              <td className="border px-4 py-2">탈퇴 또는 인증 철회 시까지</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">매칭/계약/정산</td>
              <td className="border px-4 py-2">성명/회사명, 연락처, (사업자일 경우) 사업자등록정보, 정산 계좌(마스킹 처리)</td>
              <td className="border px-4 py-2">포트폴리오 정보</td>
              <td className="border px-4 py-2">전자상거래법에 따른 보관(아래 §6 참조)</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">고객지원 및 분쟁 대응</td>
              <td className="border px-4 py-2">문의/신고 기록, 채팅/알림 이력</td>
              <td className="border px-4 py-2">첨부 파일</td>
              <td className="border px-4 py-2">소비자 분쟁처리 기준에 따른 보관</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">보안 및 서비스 품질 개선</td>
              <td className="border px-4 py-2">접속 일시, IP주소, 기기정보, 이용기록(로그)</td>
              <td className="border px-4 py-2">쿠키/행태정보(동의 시)</td>
              <td className="border px-4 py-2">접속로그 3개월(통신비밀보호법), 기타는 목적 달성 시까지</td>
            </tr>
          </tbody>
        </table>
        <p className="text-black text-xl pl-4">
          ※ 선택 항목은 미동의해도 서비스 핵심 이용에는 제한이 없습니다(단, 맞춤 추천 등 일부 기능 제한 가능).
        </p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">2. 수집 방법</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 회원가입·이용 과정에서 이용자가 직접 입력</p>
        <p className="text-black text-xl pl-4">- 대학 인증 과정(학교 이메일 인증 또는 대체서류 업로드)</p>
        <p className="text-black text-xl pl-4">- 서비스 이용 시 자동 수집(접속·로그·쿠키 등)</p>
        {/* <p className="text-black text-xl pl-4">- 결제·정산 처리 과정에서 결제대행사/정산사로부터 필요한 정보 수신</p> */}
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">3. 제3자 제공</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">
          회사는 원칙적으로 이용자 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에 한합니다.
        </p>
        <table className="border border-black w-full text-left">
          <thead>
            <tr>
              <th className="border px-4 py-2">제공받는 자</th>
              <th className="border px-4 py-2">제공 항목</th>
              <th className="border px-4 py-2">제공 목적</th>
              <th className="border px-4 py-2">보유·이용 기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">매칭된 기업(수요자) 또는 프리랜서(공급자)</td>
              <td className="border px-4 py-2">이름/소속/프로필(포트폴리오), 연락수단(플랫폼 내)</td>
              <td className="border px-4 py-2">프로젝트 제안·계약·협업</td>
              <td className="border px-4 py-2">매칭 종료 후 1년 또는 동의 철회 시까지</td>
            </tr>
            {/* <tr>
              <td className="border px-4 py-2">결제대행사(KG이니시스)</td>
              <td className="border px-4 py-2">결제 식별자, 결제 수단 일부 정보, 결제/취소 이력</td>
              <td className="border px-4 py-2">결제·환불·부정거래 방지</td>
              <td className="border px-4 py-2">관련 법령 및 계약에 따름</td>
            </tr> */}
          </tbody>
        </table>
        <p className="text-black text-xl pl-4">
          ※ 제3자 제공은 선택 동의 기반이며, 미동의 시 일부 기능(매칭 제안 등)에 제한이 있을 수 있습니다.
        </p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">4. 처리의 위탁(수탁자)</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">안전하고 효율적인 서비스 제공을 위해 다음 업체에 업무를 위탁할 수 있습니다.</p>
        <table className="border border-black w-full text-left">
          <thead>
            <tr>
              <th className="border px-4 py-2">수탁자</th>
              <th className="border px-4 py-2">위탁업무</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">아마존웹서비스(AWS)</td>
              <td className="border px-4 py-2">인프라 호스팅, 데이터 보관(리전: 서울/ap-northeast-2)</td>
            </tr>
            {/* <tr>
              <td className="border px-4 py-2">KG 이니시스</td>
              <td className="border px-4 py-2">전자지급결제대행(PG), 결제창 제공, 결제 승인/매입/정산, 환불·부분취소 처리, 에스크로(대금예치) 운영, 현금영수증/카드전표 발급, 부정거래 탐지(FDS)</td>
            </tr> */}
          </tbody>
        </table>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">5. 국외 이전</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">해당 없음</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">6. 법정 보관기간</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">전자상거래 등에서의 소비자보호에 관한 법률에 따라 아래 정보는 법정 기간 보관합니다.</p>
        <p className="text-black text-xl pl-4">- 계약 또는 청약철회 기록: 5년</p>
        {/* <p className="text-black text-xl pl-4">- 대금결제 및 재화 등의 공급 기록: 5년</p> */}
        <p className="text-black text-xl pl-4">- 소비자 불만 또는 분쟁처리 기록: 3년</p>
        <p className="text-black text-xl pl-4">- 표시·광고에 관한 기록: 6개월</p>
        <p className="text-black text-xl pl-4">- 접속로그: 3개월(통신비밀보호법)</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">7. 이용자 권리와 행사방법</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 본인·대리인은 언제든지 개인정보 열람·정정·삭제·처리정지 요구 가능</p>
        <p className="text-black text-xl pl-4">- 앱/웹 마이페이지 및 고객센터를 통해 요청 가능하며, 회사는 법령이 정한 기간 내 처리</p>
        <p className="text-black text-xl pl-4">- 만 14세 미만 아동의 경우 법정대리인의 동의를 받아 처리</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">8. 쿠키 및 행태정보</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 회사는 서비스 개선과 맞춤형 제공을 위해 쿠키를 사용할 수 있으며, 이용자는 브라우저 설정으로 저장을 거부할 수 있습니다.</p>
        <p className="text-black text-xl pl-4">- 온라인 맞춤형 광고/행태정보 수집 운영 시 수집 항목·목적·보유기간·거부 방법을 별도로 고지하며, 미사용 시 “운영하지 않음” 표기</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">9. 파기절차 및 방법</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 보유기간 경과·처리 목적 달성 시 지체 없이 파기</p>
        <p className="text-black text-xl pl-4">- 전자파일은 복구 불가능한 방법으로 삭제, 출력물은 분쇄 또는 소각</p>
        <p className="text-black text-xl pl-4">- 일부 정보는 법령상 보관 의무에 따라 별도 분리 보관 후 파기</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">10. 안전성 확보조치</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 관리적 조치: 내부관리계획 수립·시행, 최소권한 관리, 정기 교육</p>
        <p className="text-black text-xl pl-4">- 기술적 조치: 암호화 저장(비밀번호 해시), 전송 구간 암호화(TLS), 접근통제(IAM), 이상징후 모니터링</p>
        <p className="text-black text-xl pl-4">- 개인정보 유출 통지: 유출 또는 침해 사실 인지 시 법령에 따라 지체 없이 통지·신고</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">11. 개인정보 보호책임자</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 보호책임자: 박정곤</p>
        <p className="text-black text-xl pl-4">- 이메일: <a href="mailto:souf-official@souf.co.kr" className="underline text-blue-600">souf-official@souf.co.kr</a></p>
        <p className="text-black text-xl pl-4">- 주소: 서울특별시 광진구 광나루로19길 23, 103호</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">13. 권익침해 구제방법</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 개인정보 침해 상담·신고: 개인정보침해신고센터(118), 개인정보분쟁조정위원회(1833-6972)</p>
        <p className="text-black text-xl pl-4">- 대검찰청 사이버수사과(1301), 경찰청 사이버수사국(182)</p>
      </div>

      <h3 className="text-black font-semibold text-3xl mb-6 mt-10">14. 고지의 의무</h3>
      <div className="flex flex-col gap-4">
        <p className="text-black text-xl pl-4">- 본 방침은 [시행일자]부터 적용됩니다. 내용 추가·삭제·수정이 있을 경우 시행 7일 전부터 공지</p>
        <p className="text-black text-xl pl-4">- 최초 시행: 2025. 08. 06</p>
        <p className="text-black text-xl pl-4">- 최근 개정: 2025. 10. 19</p>
      </div>
        </div>
    )
}