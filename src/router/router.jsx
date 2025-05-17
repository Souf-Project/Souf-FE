import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/header";
import Home from "../pages/home";
import Login from "../pages/login";
import VerifyStudent from "../pages/verifyStudent";
import Recruit from "../pages/recruit";
import RecruitDetail from "../pages/recruitDetails";
import MyPage from "../pages/mypage";
import Footer from "../components/footer";
import Join from "../pages/join";
import PwdFind from "../pages/pwdFind";
import StudentProfileList from "../pages/studentProfileList";
import ProfileDetail from "../components/studentProfile/profileDetail";
import PostDetail from "../components/studentProfile/postDetail";
import PostEdit from "../pages/postEdit";
import PostUpload from "../pages/postUpload";

function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verifyStudent" element={<VerifyStudent />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/recruitDetails/:id" element={<RecruitDetail />} />
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
