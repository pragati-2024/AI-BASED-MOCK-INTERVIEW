import React from "react";

const Header = () => {
  return (
    <footer class="footer">
  <div class="footer-container">
    <div class="footer-section">
      <h3>Mockneto</h3>
      <p>Your personal AI coach to master real-world interviews with confidence. Transform your interview skills with our cutting-edge AI technology.</p>
      <div class="social-icons">
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-linkedin-in"></i></a>
        <a href="#"><i class="fab fa-github"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
    </div>

    <div class="footer-section">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="Minterview.html">Home</a></li>
        <li><a href="#">Practice Interview</a></li>
        <li><a href="interviewtips.html">Interview Tips</a></li>
        <li><a href="#">Mock Assignment</a></li>
        <li><a href="Aboutus.html">About Us</a></li>
        <li><a href="contactus.html">Contact</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Interview Tips</h4>
      <ul>
        <li><a href="interview tips.html">Communictaion Skills</a></li>
        <li><a href="#">Leadership Skils</a></li>
        <li><a href="#">Problem Solving</a></li>
        <li><a href="#">Body Language</a></li>
        <li><a href="#">Creativity</a></li>
        <li><a href="#">Practice Question</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Stay Updated</h4>
      <p>Subscribe to our newsletter for the latest interview tips and AI updates.</p>
      <form class="subscribe-form">
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
      <p><i class="fas fa-envelope"></i> support@mockneto.com</p>
      <p><i class="fas fa-phone-alt"></i> +91 8282828282</p>
      <p><i class="fas fa-map-marker-alt"></i> Bharat</p>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2025 Mockneto. All rights reserved.</p>
    <div class="policy-links">
      <a href="error 404.html">Privacy Policy</a> |
      <a href="error 404.html">Terms of Service</a> |
      <a href="error 404.html">Cookie Policy</a> |
      <a href="error 404.html">GDPR</a>
    </div>
  </div>
</footer>
  );
};

export default Header;