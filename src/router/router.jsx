import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/header';
import Home from '../pages/home';
import Login from '../pages/login';
import VerifyStudent from '../pages/verifyStudent';
import Recruit from '../pages/recruit';
import RecruitDetail from '../pages/recruitDetails';
import Footer from '../components/footer';


function AppRouter() {
  
    return (
        <>
            <Header/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verifyStudent" element={<VerifyStudent />} />
                <Route path="/recruitDetails/:id" element={<RecruitDetail />} />
                <Route path="/recruit" element={<Recruit />} />
            </Routes>
            <Footer/>
        </>
    );
}

export default function Router() {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
}
