export default function TermsPage() {
  return  (
  <div className="max-w-[60rem] w-full mx-auto px-4 mt-12 mb-20">
    <h2 className="text-black font-bold text-4xl mb-6">이용약관</h2>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제1조 (목적)</h3>
  <p className="text-black text-xl pl-4">
    이 약관은 대학생이 자신의 포트폴리오 및 작업물을 게시하고, 기업이 채용 공고를 등록하며, 양측이 상호 소통하는 온라인 플랫폼 서비스의 이용에 관한 회사와 회원 간의 권리·의무 및 책임사항을 규정합니다.
  </p>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제2조 (용어의 정의)</h3>
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
      ④ 검수 승인 또는 자동 승인은 결과물 승인 또는 기한 경과에 따른 승인을 말하며, 중도해지는 계약 기간 중 당사자가 계약을 해지하는 행위를 의미합니다.
      </p>
      <p className="text-black text-xl pl-4">
      ④ 예치 잔금 반환(환불)은 프로젝트가 미완료되거나 중단될 경우 예치된 잔금을 반환하는 것을 말합니다.
      </p>
      <p className="text-black text-xl pl-4">
      ⑤ 전자서명은 전자적 방식으로 서명·동의하는 행위를 의미합니다.
      </p>
      <p className="text-black text-xl pl-4">
      ⑥ 제3자 제공 또는 처리위탁(수탁자)은 개인정보처리방침에서 쓰는 법정 용어를 의미하며, 서비스 제공기간은 결제일로부터 최대 180일을 말합니다.
      </p>

  </div>
  
  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제3조 (약관의 효력 및 변경)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 본 약관은 회사가 서비스 화면에 게시하거나 기타 방법으로 회원에게 공지함으로써 효력을 발생합니다.</p>
  <p className="text-black text-xl pl-4">2. 회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 개정사유와 시행일자를 명시하여 최소 7일 전 공지합니다.</p>
  <p className="text-black text-xl pl-4">3. 회원이 개정된 약관에 대해 명시적으로 거부 의사를 표시하지 않고 계속 서비스를 이용하는 경우, 개정 약관에 동의한 것으로 간주합니다.</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제4조 (서비스 이용 계약의 체결)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회원가입은 이용자가 본 약관 및 개인정보처리방침에 동의하고, 회사가 정한 절차에 따라 회원가입 신청을 완료한 후 회사가 이를 승인함으로써 체결됩니다.</p>
  <p className="text-black text-xl pl-4">2. 회사는 다음 각 호에 해당하는 경우 이용 신청을 승낙하지 않을 수 있습니다.</p>
  <p className="text-black text-xl pl-4">- 실명이 아니거나 타인의 명의를 도용한 경우</p>
  <p className="text-black text-xl pl-4">- 허위 정보를 입력한 경우</p>
  <p className="text-black text-xl pl-4">- 기타 회사의 운영정책에 위배되는 행위</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제5조 (서비스의 내용)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회사는 다음과 같은 서비스를 제공합니다.</p>
  <p className="text-black text-xl pl-4">- 학생회원의 포트폴리오 등록, 관리 및 공개</p>
  <p className="text-black text-xl pl-4">- 기업회원의 공고문 작성 및 노출</p>
  <p className="text-black text-xl pl-4">- 포트폴리오 및 공고에 대한 상호 피드백, 댓글, 스크랩 등 SNS 기능</p>
  <p className="text-black text-xl pl-4">- 광고 콘텐츠의 제공 및 노출</p>
  <p className="text-black text-xl pl-4">- 향후 결제 시스템을 통한 유료 콘텐츠, 유료 채용 홍보 등 기능</p>
  <p className="text-black text-xl pl-4">2. 회사는 서비스 일부를 광고 기반으로 운영할 수 있으며, 회원은 광고 노출에 동의하는 것으로 간주됩니다.</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제6조 (회원의 의무)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.</p>
  <p className="text-black text-xl pl-4">- 허위 정보 등록 또는 타인 정보 도용</p>
  <p className="text-black text-xl pl-4">- 타인의 지식재산권, 초상권 등 권리를 침해하는 행위</p>
  <p className="text-black text-xl pl-4">- 불쾌감 또는 혐오감을 주는 게시물 등록</p>
  <p className="text-black text-xl pl-4">- 광고, 스팸 등 상업적 목적의 콘텐츠 무단 게시</p>
  <p className="text-black text-xl pl-4">- 서비스의 정상적 운영을 방해하는 행위</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제7조 (회사의 권리와 의무)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회사는 안정적인 서비스 제공을 위해 노력하며, 시스템 유지·보수 등의 사유로 일시적 중단이 있을 수 있습니다.</p>
  <p className="text-black text-xl pl-4">2. 회사는 회원이 등록한 콘텐츠를 사전 승인 없이 내부 홍보, 추천, 큐레이션 목적으로 활용할 수 있습니다.</p>
  <p className="text-black text-xl pl-4">3. 회사는 회원이 약관 위반 시, 사전 고지 없이 콘텐츠 삭제, 서비스 이용 제한, 회원 자격 박탈 등의 조치를 취할 수 있습니다.</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제8조 (지적재산권)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회원이 서비스에 등록한 콘텐츠에 대한 저작권은 해당 회원에게 있으며, 회사는 해당 콘텐츠를 서비스 운영 및 홍보 목적으로 사용할 수 있습니다.</p>
  <p className="text-black text-xl pl-4">2. 회원은 콘텐츠를 등록함으로써, 회사에 비독점적·무상·재사용 가능한 이용 권한을 부여한 것으로 간주됩니다.</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제9조 (광고 및 유료서비스)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회사는 서비스 내에 제3자의 광고를 게재할 수 있으며, 회원은 이에 대해 동의합니다.</p>
  <p className="text-black text-xl pl-4">2. 유료 서비스 도입 시, 가격, 결제 수단, 환불 정책 등은 별도의 고지 및 동의 절차를 거쳐 운영됩니다.</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제10조 (서비스의 해지 및 탈퇴)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회원은 언제든지 서비스 내 제공되는 메뉴를 통해 이용계약을 해지할 수 있습니다.</p>
  <p className="text-black text-xl pl-4">2. 회사는 다음 각 호에 해당하는 경우 사전 통보 없이 이용계약을 해지할 수 있습니다.</p>
  <p className="text-black text-xl pl-4">- 본 약관 또는 관련 법령을 위반한 경우</p>
  <p className="text-black text-xl pl-4">- 타인의 권리를 침해하거나 공공질서를 해친 경우</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제11조 (면책조항)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회사는 천재지변, 시스템 장애 등 불가항력 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>
  <p className="text-black text-xl pl-4">2. 회사는 회원 간 거래, 커뮤니케이션에 개입하지 않으며, 그 분쟁에 대해서는 책임을 지지 않습니다.</p>

  </div>

  <h3 className="text-black font-semibold text-3xl mb-6 mt-10">제12조 (준거법 및 관할)</h3>
  <div className="flex flex-col gap-4">
  <p className="text-black text-xl pl-4">1. 회사와 회원 간 분쟁이 발생할 경우, 양 당사자는 분쟁 해결을 위해 협의할 수 있습니다.</p>
  <p className="text-black text-xl pl-4">2. 분쟁 조정이 어려울 경우, 본 약관은 대한민국 법령에 따라 해석되며, 회사와 회원 간 분쟁 발생 시 회사의 본사 소재지를 관할하는 법원을 제1심 관할 법원으로 합니다.</p>
  </div>
 
</div>
  );
}