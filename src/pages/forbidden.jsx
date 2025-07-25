import warningIco from '../assets/images/warningIco.svg'
export default function Forbidden() {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
        <img src={warningIco} alt="warning" className="w-40 h-40 mb-4" />
        <h1 className="text-4xl font-bold text-red-500 mb-4">접근이 거부되었습니다</h1>
        <p className="mb-6 text-gray-700">인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.</p>
        <a
          href="/login"
          className="px-4 py-2 bg-yellow-main text-gray-700 rounded-lg"
        >
          로그인 페이지로 이동
        </a>
      </div>
    );
  }
  