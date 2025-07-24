import { BrowserRouter, Routes, Route, useMatch } from 'react-router-dom';

import Home from '../Pages/Home';
import NotFound from '../Pages/NotFound/NotFound';
import React from 'react';
import Nav from '../Components/Nav/Nav';
import Footer from '../Components/Footer/Footer';
import BookList from '../book/BookList';
import BookDetail from '../book/BookDetail';
import BookReader from '../book/BookReader';
import VerifyEmail from '../Pages/VerifyEmail';
import SubscriptionPlans from '../Components/Subscription/SubscriptionPlan';
import Login from '../Components/Login/Login'; 
import Profile from "../Pages/Profile/Profile";


function AppRoutes() {
  const matchReader = useMatch('/epub-reader/:epubFile');
  const hideHeaderFooter = !!matchReader;

  return (
    <>
      {!hideHeaderFooter && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Book feature routes */}
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/books/:id/read" element={<BookReader />} />
        <Route path="/book/:epubFile" element={<BookDetail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/subscription" element={<SubscriptionPlans />} />
        <Route path="/login" element={<Login />} /> {/* Thêm dòng này */}
        <Route path= "/profile" element= {<Profile/>} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
