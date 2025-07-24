import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscriptionStatus.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubscriptionStatus = ({ className = "" }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Lấy token từ localStorage/sessionStorage
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const res = await fetch(`${API_BASE_URL}/Subscription/my-subscriptions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (res.ok && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setStatus(data.data[0]);
        } else {
          setStatus(null);
        }
      } catch {
        setStatus(null);
      }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <span className={`subscription-status-header ${className}`}>
        Đang kiểm tra...
      </span>
    );
  }

  if (!status) {
    return (
      <span className={`subscription-status-header expired ${className}`}>
        Chưa đăng ký.{' '}
        <button
          className="subscription-register-btn"
          onClick={() => navigate('/subscription')}
        >
          Đăng ký ngay
        </button>
      </span>
    );
  }

  // Xác định class dựa trên status
  const getStatusClass = (statusText) => {
    if (statusText === 'Hoạt động') return '';
    if (statusText === 'Hết hạn' || statusText === 'Đã hủy') return 'expired';
    return 'inactive';
  };

  return (
    <span className={`subscription-status-header ${getStatusClass(status.status)} ${className}`}>
      {status.plan_name || status.name || 'Gói'}: {status.status || 'Không rõ'}
    </span>
  );
};

export default SubscriptionStatus;