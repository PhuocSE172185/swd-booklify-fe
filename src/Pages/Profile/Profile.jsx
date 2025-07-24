import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      console.error("Missing token");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUser(response.data.data))
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) return <div className="profile-container">Đang tải dữ liệu người dùng...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {/* <img src={user.avatar_url || "/default-avatar.png"} alt="Avatar" /> */}
          <div className="profile-header-info">
            <h2>{user.full_name}</h2>
            {/* <p>{user.email}</p> */}
          </div>
        </div>

        <div className="profile-section">
          <span className="profile-label">Name</span>
          <span className="profile-value">{user.full_name}</span>
        </div>

        <div className="profile-section">
          <span className="profile-label">Email account</span>
          <span className="profile-value">{user.email}</span>
        </div>

        <div className="profile-section">
          <span className="profile-label">Mobile number</span>
          <span className="profile-value">{user.phone || "Add number"}</span>
        </div>

        <div className="profile-section">
         <span className="profile-label">Subscription Status</span>
         <span className="profile-value">
          {user.status_string === "Active" ? "Premium" : user.status_string}
         </span>

        </div>


        <div className="profile-section">
          <span className="profile-label">Created At</span>
          <span className="profile-value">{formatDate(user.created_at)}</span>
        </div>

      </div>
    </div>
  );
};

export default Profile;
