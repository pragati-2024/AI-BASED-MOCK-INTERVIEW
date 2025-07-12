import React from "react";

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
            <a href="index.html">Home</a>
            <a href="#">Practice Interview</a>
            <a href="interviewtips.html">Interview Tips</a>
            <a href="contactus.html">Contact Us</a>
            <a href="Aboutus.html">About Us</a>
          </div>

          <div className="ftrial">
            <a href="login.html">Login</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
