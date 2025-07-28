import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile.jsx';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);
  return (
    <>
      <div className="bg-glow"></div>

      <div className="header">
        <div className="logo">
          <h1>Mockneto</h1>
        </div>

        <div className="nav-right">
          <div className="links">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Practice Interview</Link>
            <Link to="/interviewtips">Interview Tips</Link>
            <Link to="/contactus">Contact Us</Link>
            <Link to="/aboutus">About Us</Link>
          </div>
          {user ? (
              <Profile />
        ) : (
          <div className="ftrial">
            <Link to="/login">Login</Link>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Header;
