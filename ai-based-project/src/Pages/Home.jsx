import React, { useEffect } from 'react';
import InterviewImage from '../assets/an-isometric-3d-illustration-depicting-a_2I8c-hUtRFKGqF6ie-btZQ_B--sLBIqSV63F4x75Kj69A-removebg-preview.png';
import Brain from '../assets/1F9E0_color.png';
import Chat from '../assets/E248_color.png';
import Analytic from '../assets/1F4CA_color.png';
import Clock from '../assets/23F0_color.png';
import Superman from '../assets/a70b8cc1a74125a7cd7b2920d77a1ed5.jpg';
import Baburao from '../assets/25ceb275d244a2f4855d0af0bd1d344e.jpg';
import Binod from '../assets/maxresdefault.jpg';

const Home = () => {
  useEffect(() => {
    const words = [
      "Communication Skills",
      "Job Success",
      "Technical Knowledge",
      "Interview Skills",
      "Hiring Potential"
    ];
    
    let part = 0;
    let partIndex = 0;
    let interval;
    let direction = "forward";
    const element = document.querySelector(".changing-text");

    function typeWriterEffect() {
      if (!element) return;
      if (direction === "forward") {
        partIndex++;
        element.textContent = words[part].substring(0, partIndex);
        if (partIndex === words[part].length) {
          direction = "backward";
          clearInterval(interval);
          setTimeout(() => {
            interval = setInterval(typeWriterEffect, 80);
          }, 1000);
        }
      } else {
        partIndex--;
        element.textContent = words[part].substring(0, partIndex);
        if (partIndex === 0) {
          direction = "forward";
          part = (part + 1) % words.length;
        }
      }
    }

    interval = setInterval(typeWriterEffect, 80);

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, []);
    return (
      <div>
        <section className="hero-wrapper">
          <div className="hero">
            <div className="hero-badge">🤖 Ai Based Mock Interview 🚀</div>

            <h1 class="hero-title">
  Accelerate Your <br />
  <span class="dynamic-wrapper">
    <span class="changing-text">Job Success</span><span class="cursor">|</span>
  </span>
</h1>

            <p className="hero-subtext">
              Prepare like a pro with intelligent mock interviews, adaptive questioning, and actionable insights — everything you need to stand out and get hired.
            </p>

            <a href="#start" className="hero-btn">Get started</a>
          </div>

          <div className="hero-image">
            <img
              src={InterviewImage} alt="Interview"
            />
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-block">
            <h2 className="stat-value">10,000+</h2>
            <p className="stat-label">Interviews Completed</p>
          </div>
          <div className="stat-block">
            <h2 className="stat-value">95%</h2>
            <p className="stat-label">Success Rate</p>
          </div>
          <div className="stat-block">
            <h2 className="stat-value">
              4.9<span className="star">★</span>
            </h2>
            <p className="stat-label">User Rating</p>
          </div>
        </section>

        <div className="outer-box">
          <h2>Why Choose Mockneto?</h2>
          <p>
            Mockneto empowers you to excel in interviews with intelligent AI, actionable feedback, and unmatched flexibility.
          </p>

          <div className="grid">
            <div className="card">
              <img src={Brain} alt="AI Icon" className="card-icon" />
              <h3>AI-Powered Interviews</h3>
              <p>
                Mockneto helps you master interviews with AI-driven simulations, personalized feedback, and flexible practice tailored to your goals.
              </p>
            </div>

            <div className="card">
              <img src={Chat} alt="Chat Icon" className="card-icon" />
              <h3>Natural Conversations</h3>
              <p>
                Practice speaking naturally with advanced speech recognition and NLP that mimics real-life interviews.
              </p>
            </div>

            <div className="card">
              <img src={Analytic} alt="Analytics Icon" className="card-icon" />
              <h3>Performance Analytics</h3>
              <p>
                Get feedback on communication, confidence, and areas of improvement after every session.
              </p>
            </div>

            <div className="card">
              <img src={Clock} alt="Clock Icon" className="card-icon" />
              <h3>Flexible Scheduling</h3>
              <p>
                Practice anytime—no coordination needed. Just log in and start sharpening your interview skills.
              </p>
            </div>
          </div>
        </div>

        <section className="how-it-works">
          <h2>How It Works ?</h2>
          <p className="subtitle">
            Follow these three clear steps to effectively prepare for interviews using our smart and flexible AI-powered platform.
          </p>

          <div className="steps-container">
            <div className="step">
              <div className="number">1</div>
              <h3>Choose Your Interview Type</h3>
              <p>Select from technical, behavioral, or general interview categories based on your needs.</p>
            </div>

            <div className="step">
              <div className="number">2</div>
              <h3>Practice with AI</h3>
              <p>Engage in realistic conversations with our AI interviewer using voice or text.</p>
            </div>

            <div className="step">
              <div className="number">3</div>
              <h3>Get Detailed Feedback</h3>
              <p>Receive comprehensive analysis and personalized recommendations for improvement.</p>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <h2>What Our Users Say</h2>
          <p className="subtitle">Join thousands of candidates who turned interviews into offers</p>

          <div className="testimonial-cards">
            <div className="card">
              <img src={Superman} alt="Sarah Chen" className="profile-pic" />
              <div className="stars">★★★★★</div>
              <p className="review">
                "This platform helped me nail my technical interviews. The AI feedback was incredibly detailed and actionable."
              </p>
              <h4>Sarah Chen</h4>
              <p className="position">Software Engineer at Google</p>
            </div>

            <div className="card">
              <img src={Baburao} alt="Marcus Johnson" className="profile-pic" />
              <div className="stars">★★★★★</div>
              <p className="review">
                "The behavioral interview practice was game-changing. I felt so much more confident in my actual interviews."
              </p>
              <h4>Marcus Johnson</h4>
              <p className="position">Product Manager at Microsoft</p>
            </div>

            <div className="card">
              <img src={Binod} alt="Emily Rodriguez" className="profile-pic" />
              <div className="stars">★★★★★</div>
              <p className="review">
                "Amazing platform! The AI interviewer felt so realistic, and the analytics helped me identify my weak spots."
              </p>
              <h4>Emily Rodriguez</h4>
              <p className="position">Data Scientist at Meta</p>
            </div>
          </div>
        </section>
      </div>
    );
};

export default Home;
