import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SubscriptionPlan.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const res = await fetch(`${API_BASE_URL}/Subscription/plans`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (res.ok && data.data && Array.isArray(data.data)) {
          setPlans(data.data);
        } else {
          setPlans([]);
        }
      } catch {
        setPlans([]);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return; 
    }

    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Subscription/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: planId,
          auto_renew: false,
          payment_method: 'VNPAY',
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process subscription');
      }

      if (data.result === 'success' && data.data?.payment_url) {
        const subscriptionInfo = {
          user_subscription_id: data.data.user_subscription_id,
          payment_id: data.data.payment_id,
          subscription: data.data.subscription,
          expires_at: data.data.expires_at
        };
        localStorage.setItem('pending_subscription', JSON.stringify(subscriptionInfo));
        toast.info('Redirecting to payment gateway...');
        window.location.href = data.data.payment_url;
      } else if (data.result === 'success') {
        toast.success('Subscription successful!');
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to process subscription');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="subscription-page">
      <h1 className="subscription-title">Choose Subscription Plan</h1>
      {loading ? (
        <div className="subscription-loading">Loading plans...</div>
      ) : (
        <div className="subscription-cards">
          {plans.map((plan, idx) => (
            <div className={`subscription-card${plan.is_popular ? ' popular' : ''}`} key={plan.id || idx}>
              {plan.is_popular && <div className="subscription-badge">★ Popular</div>}
              <div className={`subscription-card-header ${plan.is_popular ? 'popular' : ''}`}> 
                <span className="subscription-card-title">{plan.name}</span>
                <span className="subscription-card-menu">≡</span>
              </div>
              <div className="subscription-card-desc">{plan.description}</div>
              <div className="subscription-card-price" style={{ color: plan.name.includes('Basic') ? '#2979ff' : '#ffb300' }}>
                {plan.price.toLocaleString()} VND
                <div className="subscription-card-duration">/{plan.duration === 30 ? 'month' : plan.duration === 365 ? 'year' : `${plan.duration} days`}</div>
              </div>
              {plan.is_long_term && <div className="subscription-card-save">Long-term savings</div>}
              <ul className="subscription-features">
                {plan.features && plan.features.map((f, i) => (
                  <li key={i} className="subscription-feature">
                    <span className="feature-check">✔</span> {f}
                  </li>
                ))}
                {plan.more_features && <li className="subscription-more-features">+{plan.more_features} more features</li>}
              </ul>
              <div className="subscription-card-info">
                <div>Status: <span className="subscription-status-active">Active</span></div>
                <div>Display Order: {plan.display_order}</div>
                <div>Created: {plan.created_at ? new Date(plan.created_at).toLocaleDateString('en-US') : ''}</div>
              </div>
              <button 
                className="subscription-btn"
                onClick={() => handleSubscribe(plan.id)}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;