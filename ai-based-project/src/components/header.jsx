import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
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
            <Link to="#">Practice Interview</Link>
            <Link to="/interviewtips">Interview Tips</Link>
            <Link to="/contactus">Contact Us</Link>
            <Link to="/aboutus">About Us</Link>
          </div>

          <div className="ftrial">
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
