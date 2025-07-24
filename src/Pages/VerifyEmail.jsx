import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Thiếu mã xác thực.');
      return;
    }
    const verify = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok && data.access_token) {
          // Lưu token và tự động login
          sessionStorage.setItem('authToken', data.access_token);
          sessionStorage.setItem('userData', JSON.stringify({ username: data.username, last_name: data.last_name || '', loginTime: new Date().toISOString() }));
          setStatus('success');
          setMessage('Xác thực thành công! Đang đăng nhập...');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Xác thực thất bại.');
        }
      } catch {
        setStatus('error');
        setMessage('Có lỗi xảy ra.');
      }
    };
    verify();
  }, [location, navigate]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h2>Xác thực email</h2>
      {status === 'loading' && <div>Đang xác thực...</div>}
      {status !== 'loading' && <div>{message}</div>}
    </div>
  );
} 