import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/header";
import Home from "../pages/home";
import Login from "../pages/login";
import Redirect from "../pages/redirect";
import VerifyStudent from "../pages/verifyStudent";
import Recruit from "../pages/recruit";
import Feed from "../pages/feed";
import RecruitDetail from "../pages/recruitDetails";
import RecruitsAll from "../pages/recruitsAll";
import MyPage from "../pages/mypage";
import Footer from "../components/footer";
import Join from "../pages/join";
import PwdFind from "../pages/pwdFind";
import StudentProfileList from "../pages/studentProfileList";
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
import { getUnreadNotificationCount, getNotifications } from "../api/notification";
function AppRouter() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  const { nickname } = UserStore();
  const { setUnreadCount, setNotifications, unreadCount } = useUnreadStore();

  // 로그인 시 알림 초기화
  useEffect(() => {
    const initializeNotifications = async () => {
      if (nickname) {
        try {
          // 읽지 않은 알림 개수 조회
          const unreadCountResponse = await getUnreadNotificationCount();
          console.log("읽지 않은 알림 개수:", unreadCountResponse);
          setUnreadCount(unreadCountResponse.result || 0);

          // 최근 알림 목록 조회 (최대 20개)
          const notificationsResponse = await getNotifications(0, 20);
          setNotifications(notificationsResponse.result || []);
        } catch (error) {
          console.error('알림 초기화 에러:', error);
          // 에러 발생 시 기본값 설정
          setUnreadCount(0);
          setNotifications([]);
        }
      } else {
        // 로그아웃 시 알림 상태 초기화
        setUnreadCount(0);
        setNotifications([]);
      }
    };

    initializeNotifications();
  }, [nickname, setUnreadCount, setNotifications, unreadCount]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Inspection />} /> */}
         <Route path="/login" element={<Login />} />
          <Route path="/oauth/kakao/callback" element={<Redirect />} />
          <Route path="/oauth/google/callback" element={<Redirect />} />
          <Route path="/verifyStudent" element={<VerifyStudent />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/recruitDetails/:id" element={<RecruitDetail />} />
          <Route path="/recruitsAll" element={<RecruitsAll />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/join" element={<Join />} />
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
          <Route path="/guide" element={<Guide/>} />
          <Route path="/csPage" element={<CsPage/>} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
      {!isChatPage && <FloatingChatButton />}
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
