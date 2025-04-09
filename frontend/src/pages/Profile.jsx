import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { ACCESS_TOKEN } from "../constants";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    display_name: "",
    bio: "No bio provided yet. Click edit to add your bio!",
  });
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.user_id;
        const username = decodedToken.username;
        setUsername(username);

        const response = await fetch(
          `http://localhost:8000/api/user/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch profile");
        }

        const data = await response.json();
        setProfile({
          display_name: data.profile?.display_name || "",
          bio:
            data.profile?.bio ||
            "No bio provided yet. Click edit to add your bio!",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message || "Failed to load profile data");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const userId = JSON.parse(atob(token.split(".")[1])).user_id;
      console.log("Updating profile for user:", userId);
      console.log("Request data:", {
        profile: {
          display_name: profile.display_name,
          bio: profile.bio,
        },
      });

      const response = await fetch(
        `http://localhost:8000/api/user/${userId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile: {
              display_name: profile.display_name,
              bio: profile.bio,
            },
          }),
        }
      );

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || "Failed to update profile";
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      setProfile({
        display_name: data.profile?.display_name || profile.display_name,
        bio: data.profile?.bio || profile.bio,
      });
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    }
  };

  // Get the display name to show in the greeting
  const displayName = profile.display_name || username;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="profile-content">
        <div className="profile-avatar">
          <span className="chef-emoji">👨‍🍳</span>
        </div>

        <div className="profile-greeting">
          <h2>Hello, {displayName}!</h2>
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <label>Display Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) =>
                  setProfile({ ...profile, display_name: e.target.value })
                }
                placeholder="Enter your display name"
              />
            ) : (
              <p>{profile.display_name || "No display name set"}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Bio:</label>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Tell us about yourself"
              />
            ) : (
              <p>{profile.bio}</p>
            )}
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
