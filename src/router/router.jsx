import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import CsPage from "../pages/csPage";
import Review from "../pages/review";
import ReviewDetail from "../pages/reviewDetail";
import Inspection from "../pages/inspection";
import { HelmetProvider } from 'react-helmet-async';
import FloatingChatButton from "../components/floatingChatButton";
import AlertModal from "../components/alertModal";
import Page1 from "../pages/policy/page1";
function AppRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === "/chat";
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

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
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/studentFeedList" element={<StudentFeedList />} />
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
          <Route path="/guide" element={<CsPage/>} />
          <Route path="/policy/page1" element={<Page1/>} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
      {!isChatPage && <FloatingChatButton />}
      
      {/* 세션 만료 모달 */}
      {showSessionExpiredModal && (
        <AlertModal
          type="simple"
          title="로그인 만료"
          description="로그인 시간이 만료되었습니다. 재로그인해주세요"
          TrueBtnText="로그인하러 가기"
          onClickTrue={() => {
            setShowSessionExpiredModal(false);
            if (!location.pathname.includes('/login')) {
              navigate('/login');
            }
          }}
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
