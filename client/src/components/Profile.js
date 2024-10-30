import React, { useState, useEffect } from 'react';
import { apiUrl } from '../App';
import '../styles/Profile.css';

function Profile({ token }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [token]);

  if (error) return <div className="error-message">{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Member since:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default Profile; 