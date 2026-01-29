import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import Header from "../components/header";
import Home from "../pages/home";
import Login from "../pages/login";
import Redirect from "../pages/redirect";
import Recruit from "../pages/recruit";
import Feed from "../pages/feed";
import RecruitDetail from "../pages/recruitDetails";
import RecruitsAll from "../pages/recruitsAll";
import MyPage from "../pages/mypage";
import Footer from "../components/footer";
import Join from "../pages/join";
import PwdFind from "../pages/pwdFind";
import StudentProfileList from "../pages/studentProfileList";
import StudentFeedList from "../pages/studentFeedList";
import ProfileDetail from "../components/studentProfile/profileDetail";
import PostDetail from "../components/studentProfile/postDetail";
import PostEdit from "../pages/postEdit";
import PostUpload from "../pages/postUpload";
import RecruitUpload from "../pages/recruitUpload";
import Chat from "../pages/chat";
import Contests from "../pages/contests";
import ContestDetail from "../pages/contestDetail";
import Search from "../pages/search";
import Withdraw from "../pages/withdraw";
import ScrollToTop from "../components/scrollToTop";
import Forbidden from "../pages/forbidden";
import Guide from "../pages/guide";
import CsPage from "../pages/csPage";
import Review from "../pages/review";
import ReviewDetail from "../pages/reviewDetail";
import Inspection from "../pages/inspection";
import { HelmetProvider } from 'react-helmet-async';
import FloatingChatButton from "../components/floatingChatButton";
import useUnreadStore from "../store/useUnreadStore";
import { UserStore } from "../store/userStore";
import { getUnreadChatCount, getNotificationCount, getNotificationList } from "../api/notification";
import useUnreadSSE from "../hooks/useUnreadSSE";
import AlertModal from "../components/alertModal";
import TermsPage from "../pages/policy/terms";
import PrivacyPage from "../pages/policy/privacy";
import ComplainPage from "../pages/policy/complain";
import Contract from "../pages/contract";
import AdditionalInfo from "../pages/additionalInfo";
import PopUpView from "../components/popUpView";
import PopUpDC from "../utils/popUpDC";
import popUpImg from "../assets/images/SOUF_contest_A4.png";
import Contest from "../pages/contest";


function AppRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === "/chat";
  const [cookies, setCookie, removeCookie] = useCookies();

  const { nickname, memberId } = UserStore();
  const { setUnreadChatCount, setUnreadNotificationCount, setNotifications } = useUnreadStore();
  useUnreadSSE();

  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  // 초기 데이터 로드 (로그인한 경우만, SSE 구독 후)
  useEffect(() => {
    if (memberId) {
      // SSE 구독 후 약간의 지연을 두고 API 호출 (SSE 연결이 완료될 시간 확보)
      const fetchInitialData = async () => {
        try {
          // SSE 구독 후 약간 대기
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 읽지 않은 채팅 개수 조회
          const chatCountResponse = await getUnreadChatCount();
          const chatCount = chatCountResponse?.result || 0;
          setUnreadChatCount(chatCount);
          // console.log('초기 채팅 개수 로드:', chatCount);
          
          // 읽지 않은 알림 개수 조회
          const notificationCountResponse = await getNotificationCount();
          const notificationCount = notificationCountResponse?.result || 0;
          setUnreadNotificationCount(notificationCount);
          // console.log('초기 알림 개수 로드:', notificationCount);
          
          // 알림 목록 조회
          const notificationListResponse = await getNotificationList(0, 20);
          const notificationList = notificationListResponse?.result?.content || notificationListResponse?.result || [];
          setNotifications(notificationList);
          // console.log('초기 알림 목록 로드:', notificationList.length, '개');
        } catch (error) {
          console.error('초기 데이터 로드 실패:', error);
        }
      };
      fetchInitialData();
    }
  }, [memberId, setUnreadChatCount, setUnreadNotificationCount, setNotifications]);

  useEffect(() => {
    // 세션 만료 이벤트 리스너
    const handleSessionExpired = (event) => {
      setShowSessionExpiredModal(true);
    };

    window.addEventListener('showSessionExpiredModal', handleSessionExpired);

    return () => {
      window.removeEventListener('showSessionExpiredModal', handleSessionExpired);
    };
  }, []);

  // 팝업 표시 여부 확인 (메인 페이지에서만)
  useEffect(() => {
    if (location.pathname === "/") {
      const currentCookies = cookies[PopUpDC.COOKIE_VALUE];
      setShowPopUp(!currentCookies);
    } else {
      setShowPopUp(false);
    }
  }, [cookies, location.pathname]);

  // 팝업 닫기 핸들러
  const closePopUp = (selCheck) => {
    if (selCheck) {
      // 오늘 하루 열지 않기 체크 시 쿠키에 저장 (1일)
      const expires = new Date();
      expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 1일
      setCookie(PopUpDC.COOKIE_VALUE, 'true', { 
        path: '/', 
        expires 
      });
    }
    setShowPopUp(false);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Inspection />} /> */}
          <Route path="/contest" element={<Contest />} />
          <Route path="/error" element={<Inspection />} />
         <Route path="/login" element={<Login />} />
         <Route path="/test" element={<Guide />} />
          <Route path="/oauth/kakao/callback" element={<Redirect />} />
          <Route path="/oauth/google/callback" element={<Redirect />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/studentFeedList" element={<StudentFeedList />} />
          <Route path="/recruitDetails/:id" element={<RecruitDetail />} />
          <Route path="/recruitsAll" element={<RecruitsAll />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/join" element={<Join />} />
          <Route path="/additionalInfo" element={<AdditionalInfo />} />
          <Route path="/pwdFind" element={<PwdFind />} />
          <Route path="/students" element={<StudentProfileList />} />
          <Route path="/profileDetail/:id" element={<ProfileDetail />} />
          <Route
            path="/profileDetail/:id/post/:worksId"
            element={<PostDetail />}
          />
          <Route path="/postEdit" element={<PostEdit />} />
          <Route path="/postUpload" element={<PostUpload />} />
          <Route path="/recruitUpload" element={<RecruitUpload />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:category/:id" element={<ContestDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/withdraw" element={<Withdraw/>} />
          <Route path="/forbidden" element={<Forbidden/>} />
      <Route path="/guide" element={<CsPage/>} />
          <Route path="/policy/terms" element={<TermsPage/>} />
          <Route path="/policy/privacy" element={<PrivacyPage/>} />
          <Route path="/policy/complaintDispute" element={<ComplainPage/>} />
          <Route path="/contract" element={<Contract/>} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
      {!isChatPage && <FloatingChatButton />}
      
      {/* 세션 만료 모달 */}
      {showSessionExpiredModal && (
        <AlertModal
          type="simple"
          title="로그인 필요"
          description="로그인이 필요한 서비스입니다"
          TrueBtnText="로그인하러 가기"
          onClickTrue={() => {
           
            setShowSessionExpiredModal(false);
            if (!location.pathname.includes('/login')) {
              navigate('/login');
            }
          }}
        />
      )}

      {/* 팝업  */}
      {showPopUp && location.pathname === "/" && (
        <PopUpView 
          closePopUp={closePopUp}
          title="SOUF 피드 경진대회 개최"
          imageUrl={popUpImg}
        />
      )}
    </div>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
    <HelmetProvider>
      <ScrollToTop/>
      <AppRouter />
      </HelmetProvider>
    </BrowserRouter>
  );
}
