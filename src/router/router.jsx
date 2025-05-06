import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/header';
import Home from '../pages/home';
import Login from '../pages/login';
import Footer from '../components/footer';
import Join from '../pages/join';


function AppRouter() {
  
    return (
        <>
            <Header/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join/>} />
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
