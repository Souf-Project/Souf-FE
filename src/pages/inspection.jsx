import SouFLogo from "../assets/images/SouFLogo.png";
export default function Inspection() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center border-4 border-[#3181D2] rounded-lg lg:p-12 p-6">
        <div className="flex items-center justify-start w-full border-b-4 border-gray-300 pb-6">
        <img src={SouFLogo} alt="SouFLogo" className="lg:w-48 w-24 mr-auto" />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 my-12 font-medium text-md lg:text-2xl text-center">
            <p className="text-4xl">스프 점검 안내</p>
            <p className="hidden lg:block">더 나은 서비스를 위해 현재 서버 점검을 진행하고 있습니다.</p>
            <p className="lg:hidden">더 나은 서비스를 위해<br/>현재 서버 점검을 진행하고 있습니다.</p>
            <p className="hidden lg:block">잠시만 기다려 주세요. 이용에 불편을 드려 죄송합니다.</p>
            <p className="lg:hidden">잠시만 기다려 주세요.<br/>이용에 불편을 드려 죄송합니다.</p>
            <p className="hidden lg:block">궁금하신 점이나 문의하실 사항이 있으시면 아래의 연락처를 통해 연락바랍니다.</p>
            <p className="lg:hidden">궁금하신 점이나 문의하실 사항이 있으시면<br/>아래의 연락처를 통해 연락바랍니다.</p>
            <p>문의 연락처: souf-official@souf.co.kr</p>
        </div>
        <div className="flex flex-col ml-auto text-sm text-gray-500">
            <p>사업자 번호 ㅣ 508-24-95706</p>
            <p>(주)스프 ㅣ 통신판매업</p>
            <p>서울특별시 광진구 광나루로19길 23, 103호</p>
            <p className="mt-4">© 2025 SOUF. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}