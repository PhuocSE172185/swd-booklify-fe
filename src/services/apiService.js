// API Service for authentication
// Thay thế mock API bằng API thực tế khi cần

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://booklify-h3e6cvgrdjd4gjaw.southeastasia-01.azurewebsites.net/api';
    this.timeout = import.meta.env.VITE_API_TIMEOUT || 10000;
  }

  // Helper method for making HTTP requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        // Nếu API trả về lỗi, trả về object có result: 'error'
        return { result: 'error', message: data.message || 'Request failed', data };
      }
      return { result: 'success', data };
    } catch (error) {
      return { result: 'error', message: error.message || 'Network error' };
    }
  }

  // Login method
  async login(username, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, grant_type: 'password' }),
    });
  }

  // Register method
  async register({ username, email, password, phone_number }) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, phone_number }),
    });
  }

  // Logout method
  async logout(token) {
    // Mock API response - thay thế bằng API thực tế
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Logging out with token:', token); // Sử dụng token để tránh linter error
        resolve({
          result: 'success',
          message: 'Đăng xuất thành công!'
        });
      }, 500);
    });

    // Uncomment và sử dụng code dưới đây cho API thực tế:
    /*
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    */
  }

  // Get user profile
  async getUserProfile(token) {
    // Mock API response - thay thế bằng API thực tế
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Getting profile with token:', token); // Sử dụng token để tránh linter error
        resolve({
          result: 'success',
          data: {
            id: 1,
            email: 'admin@example.com',
            username: 'admin@example.com',
            name: 'Admin User',
            app_role: 'admin',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
          }
        });
      }, 500);
    });

    // Uncomment và sử dụng code dưới đây cho API thực tế:
    /*
    return this.makeRequest('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    */
  }

  // Refresh token
  async refreshToken(refreshToken) {
    // Mock API response - thay thế bằng API thực tế
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Refreshing token:', refreshToken); // Sử dụng refreshToken để tránh linter error
        resolve({
          result: 'success',
          data: {
            access_token: 'new_mock_token_' + Date.now(),
            refresh_token: 'new_refresh_token_' + Date.now(),
          }
        });
      }, 500);
    });

    // Uncomment và sử dụng code dưới đây cho API thực tế:
    /*
    return this.makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    */
  }

  // Forgot password
  async forgotPassword(email) {
    // Mock API response - thay thế bằng API thực tế
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Sending forgot password email to:', email); // Sử dụng email để tránh linter error
        resolve({
          result: 'success',
          message: 'Email khôi phục mật khẩu đã được gửi!'
        });
      }, 1000);
    });

    // Uncomment và sử dụng code dưới đây cho API thực tế:
    /*
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    */
  }

  // Reset password
  async resetPassword(token, newPassword) {
    // Mock API response - thay thế bằng API thực tế
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Resetting password with token:', token, 'new password:', newPassword); // Sử dụng các tham số để tránh linter error
        resolve({
          result: 'success',
          message: 'Mật khẩu đã được đặt lại thành công!'
        });
      }, 1000);
    });

    // Uncomment và sử dụng code dưới đây cho API thực tế:
    /*
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
    */
  }

  // Download epub file as blob
  async downloadEpub(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return await response.blob();
  }
}

// Export singleton instance
export const apiService = new ApiService(); 

export default apiService;