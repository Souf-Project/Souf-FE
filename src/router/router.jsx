import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/header';
import Home from '../pages/home';
import Login from '../pages/login';
import VerifyStudent from '../pages/verifyStudent';
import Recruit from '../pages/recruit';
import RecruitDetail from '../pages/recruitDetails';
import MyPage from '../pages/mypage';
import Footer from '../components/footer';
import Join from '../pages/join';

function AppRouter() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verifyStudent" element={<VerifyStudent />} />
                    <Route path="/recruit" element={<Recruit />} />
                    <Route path="/recruitDetails/:id" element={<RecruitDetail />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/join" element={<Join/>} />
                </Routes>
            </main>
            <Footer/>
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
