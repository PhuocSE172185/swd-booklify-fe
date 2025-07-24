import React, { useState, useEffect } from 'react';
import './Nav.css';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { navLinks, navRight } from '../../Data/Data';
import { VscMenu } from 'react-icons/vsc';
import { GrClose } from 'react-icons/gr';
import Login from '../Login/Login';
import Register from '../Register/Register';

export default function Nav() {
  const [isNavLinksShowing, setIsNavLinksShowing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    // Kiểm tra user đã login chưa
    const userData = sessionStorage.getItem('userData') || localStorage.getItem('userData');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [showLogin]); // reload khi login/logout

  if(innerWidth < 1024){
    window.addEventListener('scroll', ()=> {
      document.querySelector('nav-links ').classList.add('navLinksHide');
      setIsNavLinksShowing(false);
    })
  };

  window.addEventListener('scroll', ()=> {
    document.querySelector('nav').classList.toggle('navShadow',window.scrollY > 0);
  })

  // Hàm mở Login và đóng Register
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  // Hàm mở Register và đóng Login
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };
  // Đóng cả hai modal
  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  // Xử lý logout
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberLogin');
    setUser(null);
    setShowLogin(false);
    setShowRegister(false);
    // Reload lại Nav
    window.location.reload();
  };

  return (
    <nav>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>

        <ul
          className={`nav-links ${isNavLinksShowing ? 'navLinksShow' : 'navLinksHide'}`}
        >
          {navLinks.map(({ name, path }, index) => (
            <li key={index}>
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {navRight.managements.map((item, index) => {
  const isProfile = item.link === "/profile";
  return (
    <Link
      key={index}
      className="management-icons"
      to={isProfile && !user ? "#" : item.link}
      onClick={(e) => {
        if (isProfile && !user) {
          e.preventDefault();
          setShowLogin(true); // Mở modal login nếu chưa đăng nhập
        }
      }}
    >
      <item.icon />
    </Link>
  );
})}

          {/* Nếu đã login thì hiện Hello, <FirstLetter> và Log out */}
          {user ? (
            <>
              <span className="nav-hello">Hello, <b>{user.last_name ? user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1) : (user.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : '')}</b></span>
              <button type="button" className="logout-btn" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <Login 
              show={showLogin} 
              onOpenRegister={openRegister} 
              onClose={closeModals} 
              onOpen={openLogin}
            />
          )}
          <Register 
            show={showRegister} 
            onOpenLogin={openLogin} 
            onClose={closeModals} 
          />

          <button
            className="menu-button"
            onClick={() => setIsNavLinksShowing(!isNavLinksShowing)}
          >
            {isNavLinksShowing ? <GrClose /> : <VscMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
