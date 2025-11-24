export default function ComplainPage() {
    return (
        <div className="max-w-[60rem] w-full mx-auto px-4 mt-12 mb-20">
            <h2 className="text-black font-bold text-4xl mb-6">분쟁처리방침</h2>

            <p className="text-black text-xl pl-4">시행일자: 2025.10.19</p>
  <p className="text-black text-xl pl-4">회사명: 스프(SouF)</p>
  <p className="text-black text-xl pl-4">연락처: 사이트 하단 참고</p>

  <div className="bg-gray-100 border-l-4 border-red-500 p-4 mt-4">
    <p className="text-black text-xl pl-4 font-semibold">⛔️ 중요 고지</p>
    <p className="text-black text-xl pl-4">
      분쟁 예방과 공정한 처리를 위해 모든 거래는 <strong>스프 표준 계약서로 진행</strong>해야 합니다.
    </p>
    <p className="text-black text-xl pl-4">
      해당 절차를 사용하지 않은 거래(플랫폼 외 협의·자체 계약·현금 직접지급 등)는 회사가 분쟁의 판단·중재에 관여하지 않으며, 시스템에 존재하는 사실자료의 열람·제공 범위 이외에는 지원이 어렵습니다.
    </p>
    {/* <p className="text-black text-xl pl-4">
      또한 예치되지 않은 대금의 반환·정산은 보장되지 않습니다.
    </p> */}
  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">1. 목적 및 적용 범위</h3>
  <p className="text-black text-xl pl-4">
    본 방침은 SouF 플랫폼에서 발생할 수 있는 기업–프리랜서 간 외주 거래 분쟁 및 이용자–회사 간 서비스 분쟁을 신속·공정하게 처리하기 위한 원칙과 절차를 규정합니다. 본 방침은 이용약관, 결제·정산·환불(에스크로) 정책, 표준 외주계약서와 함께 적용됩니다.
  </p>

  
  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">2. 용어의 정의</h3>
  <div className="flex flex-col gap-4">
    <p className="text-black text-xl pl-4">
    이 약관에서 정하는 용어의 정의는 다음과 같습니다.
    </p>
  <p className="text-black text-xl pl-4">
  ① 스프(SouF) 회사가 제공하는 서비스에 가입한 자(기업·소상공인·개인사업자·프리랜서 포함)를 회원이라 하며, 회원 중 프로젝트를 의뢰하고 대금을 지급하는 자를 발주자(수요자/의뢰자)라 하고, 프로젝트를 수행하는 자를 수급자(공급자/프리랜서/대학생 프리랜서)라 합니다.
      </p>
      <p className="text-black text-xl pl-4">
      ② 프로젝트(외주)란 플랫폼을 통해 체결·수행되는 업무를 의미하며, 표준 계약서는 회사가 제공하는 외주 표준계약을 말합니다.
      </p>
      <p className="text-black text-xl pl-4">
       ③ 검수 승인 또는 자동 승인은 결과물 승인 또는 기한 경과에 따른 승인을 말하며, 중도해지는 계약 기간 중 당사자가 계약을 해지하는 행위를 의미합니다.
      </p>
      <p className="text-black text-xl pl-4">
      ④ 전자서명은 전자적 방식으로 서명·동의하는 행위를 의미합니다.
      </p>
      <p className="text-black text-xl pl-4">
      ⑤ 제3자 제공 또는 처리위탁(수탁자)은 개인정보처리방침에서 쓰는 법정 용어를 의미하며, 서비스 제공기간은 결제일로부터 최대 180일을 말합니다.
      </p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">3. 회사(플랫폼)의 역할</h3>
  <p className="text-black text-xl pl-4">
    회사는 매칭·표준계약서 작성 지원·계약 체결 기록 보관 기능을 제공합니다.
  </p>
  <p className="text-black text-xl pl-4">
    회사는 외주 계약의 직접 당사자가 아니며, 프로젝트 이행 책임은 발주자와 수급자에게 있습니다. 분쟁 시 회사는 본 방침에 따라 조정·기록 제공 범위 내에서 지원합니다.
  </p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">4. 분쟁 유형(예시)</h3>
  {/* <p className="text-black text-xl pl-4">- 대금·정산: 선금/잔금 지급, 환불(예치 잔금 반환)</p> */}
  <p className="text-black text-xl pl-4">- 이행·품질: 일정 지연, 산출물 품질·수정 횟수 이견, 검수 불합리 주장</p>
  <p className="text-black text-xl pl-4">- 권리침해: 저작권·초상권·상표권 관련 게시물/결과물 분쟁</p>
  <p className="text-black text-xl pl-4">- 계정·후기: 허위 후기, 모욕/비방, 부정사용</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">5. 처리 원칙</h3>
  <p className="text-black text-xl pl-4">- 문서 우선: 표준 계약서·별첨 명세, 채팅 로그, 결제·정산 로그를 최우선 증빙으로 삼습니다.</p>
  <p className="text-black text-xl pl-4">- 신속·중립: 정해진 기한 내 중립적으로 사실을 확인하고 합리적 조정안을 제시합니다.</p>
  <p className="text-black text-xl pl-4">- 최소 개입: 자율 합의를 우선하며, 불가 시 정책·계약 기준으로 조정합니다.</p>
  <p className="text-black text-xl pl-4">- 개인정보 최소화: 분쟁 처리 목적 범위 내에서만 자료를 열람·제공합니다.</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">6. 처리 절차 및 기한(SLA)</h3>
  <p className="text-black text-xl pl-4">1. 접수: 마이페이지 › 도움말/문의 또는 고객센터로 접수 → 접수번호 발급</p>
  <p className="text-black text-xl pl-4">2. 초기 안내(영업일 기준 3일 이내): 담당자 배정, 필요 자료 목록 안내, 임시조치 여부 통지</p>
  <p className="text-black text-xl pl-4">3. 사실 확인(영업일 기준 7–10일 이내): 양측 소명·증빙 확인(계약/채팅/파일/정산 로그)</p>
  <p className="text-black text-xl pl-4">4. 조정안 제시(최초 접수 후 14–30일 이내): 환불·지급·수정·비공개 등 조정안 통지</p>
  <p className="text-black text-xl pl-4">5. 종결: 합의 또는 미합의 종결 통지. 미합의 시 외부 분쟁조정·법원 이용 안내</p>
  <p className="text-black text-xl pl-4">※ 긴급 사안(사기·권리침해 등)은 선조치(비공개, 게시중단) 후 사실 확인을 진행할 수 있습니다.</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">7. 조정 기준(요지)</h3>
  <p className="text-black text-xl pl-4">- 검수·수정: 계약서의 검수 기한·수정 횟수(별첨 기준) 준수 여부를 확인합니다.</p>
  <p className="text-black text-xl pl-4">- 중도해지: 작업 진행률(마일스톤/산출물 기준)에 따라 정산 후 예치 잔금 반환/지급을 결정합니다.</p>
  <p className="text-black text-xl pl-4">- 완료 후: 검수 승인 또는 자동 승인 이후에는 잔금 반환이 불가합니다(하자 시 재수정/보증 절차).</p>
  <p className="text-black text-xl pl-4">- 권리침해: 소명자료와 권리관계 확인 후 임시 비공개/삭제/수정 및 재발 방지 조치.</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">8. 임시조치 및 제재</h3>
  <p className="text-black text-xl pl-4">- 임시조치: 게시물/피드 비공개, 검색 제한, 정산 보류, 신규 거래 제한</p>
  <p className="text-black text-xl pl-4">- 제재: 경고, 기간 제한, 영구 이용정지, 법령 위반 시 관계기관 통보</p>
  <p className="text-black text-xl pl-4">- 임시조치·제재 사유와 이의신청 방법을 알립니다.</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">9. 증빙 제출 안내</h3>
  <p className="text-black text-xl pl-4">- 필수: 표준 계약서 및 별첨, 채팅 로그(플랫폼 내), 산출물/납품 이력, 결제·정산 로그</p>
  <p className="text-black text-xl pl-4">- 선택: 외부 커뮤니케이션 기록, 공문/권리증서, 기타 객관증빙</p>
  <p className="text-black text-xl pl-4">- 형식: 스크린샷·원본 파일·링크. 위·변조가 의심되는 자료는 인정되지 않을 수 있습니다.</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">10. 표준 계약서 미사용 거래</h3>
  <p className="text-black text-xl pl-4">- 플랫폼 표준 계약·정산 절차를 사용하지 않은 거래(외부 메신저 협의, 현금 직접지급 등)는 지원·분쟁 대응 대상에서 제외됩니다.</p>
  <p className="text-black text-xl pl-4">- 이 경우 회사는 시스템에 존재하는 사실자료(채팅 타임스탬프, 결제/환불 이벤트 로그 등)의 열람·제공에 한하여 지원할 수 있습니다.</p>
  {/* <p className="text-black text-xl pl-4">- 환불·정산은 KG이니시스를 통한 예치금에 한해 처리됩니다.</p> */}

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">11. 자료 보관 및 제공</h3>
  <p className="text-black text-xl pl-4">분쟁 처리와 법령 준수를 위해 필요한 자료는 관련 법령 및 개인정보 처리방침에 따라 보관·파기하며, 사법기관·분쟁조정기구의 적법한 요청에 한해 제공될 수 있습니다.</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">12. 외부 분쟁조정 및 관할</h3>
  <p className="text-black text-xl pl-4">- 합의에 이르지 못하거나 법적 판단이 필요한 경우, 관할·준거법은 이용약관 및 계약서 조항에 따릅니다.</p>
  <p className="text-black text-xl pl-4">- 약관(플랫폼 ↔ 회원)</p>
  <p className="text-black text-xl pl-6">- 본 약관 및 서비스와 관련하여 발생한 분쟁의 1심 관할은 서울중앙지방법원으로 합니다.</p>
  <p className="text-black text-xl pl-6">- 이용자의 주소지 관할 법원도 1심 관할로 합니다.</p>
  <p className="text-black text-xl pl-4">- 표준 외주계약(발주자 ↔ 수급자)</p>
  <p className="text-black text-xl pl-6">- 본 계약과 관련하여 분쟁이 발생한 경우, 당사자는 우선 협의로 해결하되, 협의가 불가한 때에는 피고의 보통재판적이 있는 법원을 1심 관할로 합니다.</p>
  <p className="text-black text-xl pl-6">- 단, 당사자 합의가 있는 경우 서울중앙지방법원을 1심 관할로 할 수 있습니다.</p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">13. 기타</h3>
  <p className="text-black text-xl pl-4">- 본 방침에 정하지 않은 사항은 이용약관, 표준 외주계약서 및 관련 법령을 따릅니다.</p>
  <p className="text-black text-xl pl-4">- 회사는 서비스 안전과 공정성을 위해 필요한 범위에서 본 방침을 개정할 수 있으며, 시행 7일 전 공지합니다.</p>
        </div>
    )
}
