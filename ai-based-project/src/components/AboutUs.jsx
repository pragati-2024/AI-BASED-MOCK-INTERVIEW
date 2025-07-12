import React from 'react';
// Import images from assets (update paths as needed)
import amitImg from '../assets/amit.png';
import rahulImg from '../assets/b16a0f0ffdd056b4c542d6ddf821195f.jpg';
import pragatiImg from '../assets/pragati.jpg';
import fireImg from '../assets/fire.png';

const teamMembers = [
  {
    name: 'Amit Kumar',
    img: amitImg,
    position: 'Lead Developer',
    description: 'Third-year B.Tech student passionate about building intuitive web experiences. Loves exploring new technologies and solving complex problems with elegant code.',
    socials: {
      instagram: 'https://www.instagram.com/amit_singh_96937/',
      github: 'https://github.com/Amitsingh9693',
      linkedin: 'https://www.linkedin.com/in/amit-kumar-200638284/'
    }
  },
  {
    name: 'Rahul Agnihotri',
    img: rahulImg,
    position: 'Lead Developer',
    description: "I'm Rahul Agnihotri, a 2nd-year student passionate about web development, with a growing interest in game development and AI.",
    socials: {
      instagram: 'https://www.instagram.com/rahul.agnihotrii/?utm_source=ig_web_button_share_sheet',
      github: 'https://github.com/rahulagnihotri51',
      linkedin: 'https://www.linkedin.com/in/rahul-agnihotri-8b587631a/'
    }
  },
  {
    name: 'Pragati Bansal',
    img: pragatiImg,
    position: 'Lead Developer',
    description: 'Blending creativity with code — a Third-year B.Tech student building future-ready, AI-powered web solutions.',
    socials: {
      instagram: 'https://www.instagram.com/02cheezer/',
      github: 'https://github.com/pragati-2024',
      linkedin: 'https://www.linkedin.com/in/pragati-b-238854269/'
    }
  },
  // Add more team members as needed
  {
    name: 'Prakhar Mishra',
    img: fireImg,
    position: 'Lead Developer',
    description: 'Prakhar loves building cool stuff on the web. He makes sure everything runs smoothly—from writing clean code to helping the team grow.',
    socials: {
      instagram: 'blank',
      github: 'https://github.com/Prakhar1903',
      linkedin: 'blank'
    }
  },
  {
    name: 'Priyanshu yadav',
    img: fireImg,
    position: 'Lead Developer',
    description: 'blank',
    socials: {
      instagram: 'blank',
      github: 'blank',
      linkedin: 'https://www.linkedin.com/in/priyanshu-yadav-5460a82a6/'
    }
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2c1b4e] via-[#110b23] to-[#0a061b] text-white px-4 py-10 font-[Segoe UI]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Meet Our Creative Team</h1>
        <p className="text-center text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          We're a passionate group of college students transforming ideas into digital reality. Combining diverse skills with boundless creativity, we craft solutions that are both innovative and practical.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-[#1c1b2f] rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform border border-white/10">
              <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-[#6d9dc5] shadow mb-4" />
              <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
              <p className="text-[#6d9dc5] font-medium mb-2">{member.position}</p>
              <p className="text-gray-300 text-center mb-4">{member.description}</p>
              <div className="flex gap-4 mt-auto">
                <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-200 text-xl"><i className="fab fa-instagram"></i></a>
                <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white text-xl"><i className="fab fa-github"></i></a>
                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-200 text-xl"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 