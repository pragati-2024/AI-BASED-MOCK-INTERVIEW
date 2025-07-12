import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2c1b4e] via-[#110b23] to-[#0a061b] text-white px-4 py-10 font-[Inter]">
      <div className="max-w-6xl mx-auto mb-12">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 animate-slideUp">
            Contact Our Team
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            We're computer science students working on Project Aurora. Reach out with questions or collaboration ideas!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full bg-[#1e293b] p-8 rounded-xl border border-[#334155] shadow-xl relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all">
            <h3 className="text-2xl font-semibold mb-6 relative text-white after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:rounded animate-gradientPulse">
              Contact Info
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4 group">
                <i className="fas fa-user-graduate text-purple-400 mt-1"></i>
                <p><strong>Team:</strong> Mocknet Developers</p>
              </div>
              <div className="flex items-start gap-4 group">
                <i className="fas fa-envelope text-purple-400 mt-1"></i>
                <p><strong>Email:</strong> <a href="mailto:mocknet@university.edu" className="text-blue-400 hover:underline">mocknet@university.edu</a></p>
              </div>
              <div className="flex items-start gap-4 group">
                <i className="fas fa-building-columns text-purple-400 mt-1"></i>
                <p><strong>Department:</strong> Computer Science</p>
              </div>
              <div className="flex items-start gap-4 group">
                <i className="fas fa-map-marked-alt text-purple-400 mt-1"></i>
                <p><strong>Campus Location:</strong> LPU , GLA</p>
              </div>
              <div className="flex items-start gap-4 group">
                <i className="fas fa-clock text-purple-400 mt-1"></i>
                <p><strong>Hours:</strong> Mon-Fri, 10AM-6PM</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#1e293b] p-8 rounded-xl border border-[#334155] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            <h3 className="text-2xl font-semibold mb-6 relative text-white after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:rounded animate-gradientPulse">
              Send a Message
            </h3>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Your Name</label>
                <input type="text" id="name" placeholder="Your name" className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                <input type="email" id="email" placeholder="your.email@university.edu" className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-1 font-medium">Subject</label>
                <input type="text" id="subject" placeholder="Project inquiry" className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">Message</label>
                <textarea id="message" rows="4" placeholder="Your message..." className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required></textarea>
              </div>
              <button type="submit" className="w-full py-3 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg">
                <i className="fas fa-paper-plane mr-2"></i>Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="text-sm text-purple-400 text-right mt-10">
          <i className="fas fa-code"></i> Student Project
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
