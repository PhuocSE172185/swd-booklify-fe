import React, { useState } from 'react';
import './Register.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = ({ show, onOpenLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    first_name: '',
    last_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = '' };
  }, [show]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{8,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be 8-15 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase and number';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          first_name: formData.first_name,
          last_name: formData.last_name
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.');
        localStorage.setItem('newUserEmail', formData.email);
        // Không chuyển hướng về trang chủ, chỉ hiện thông báo
      } else {
        let errorMessage = data.message || 'Registration failed!';
        if (
          errorMessage &&
          ((errorMessage.toLowerCase().includes('username') || errorMessage.toLowerCase().includes('email')) &&
           errorMessage.toLowerCase().includes('exist'))
        ) {
          errorMessage = 'Username or email are already used';
        }
        setMessage(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred. Please try again.';
      let displayMessage = errorMessage;
      if (
        errorMessage &&
        ((errorMessage.toLowerCase().includes('username') || errorMessage.toLowerCase().includes('email')) &&
         errorMessage.toLowerCase().includes('exist'))
      ) {
        displayMessage = 'Username or email are already used';
      }
      setMessage(displayMessage);
    } finally {
      setLoading(false);
    }
  };

  // Chỉ render modal khi show=true, không render nút Register ở header
  if (!show) return null;

  return (
    <>
      <div className="register-overlay" onClick={onClose}>
        <div className="register-container" onClick={e => e.stopPropagation()}>
          <div className="register-form">
            <div className="register-header">
              <h2>Register</h2>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>
            {(message || errors.general) && (
              <div className={`message ${(message && message.includes('success')) ? 'success' : 'error'}`}>
                {message || errors.general}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="first_name">First Name:</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={errors.first_name ? 'error' : ''}
                  placeholder="Enter your first name"
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={errors.last_name ? 'error' : ''}
                  placeholder="Enter your last name"
                />
                {errors.last_name && <span className="error-message">{errors.last_name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  placeholder="Enter your username"
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phone_number">Phone Number:</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={errors.phone_number ? 'error' : ''}
                  placeholder="Enter your phone number"
                />
                {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', userSelect: 'none' }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁' : '👁‍🗨'}
                  </span>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm your password"
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', userSelect: 'none' }}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '👁' : '👁‍🗨'}
                  </span>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <div className="form-links">
              <span>Already have an account? </span>
              <button type="button" className="login-link" style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} onClick={onOpenLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register; 