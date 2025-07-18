import ProfileDropdown from '../components/ProfileDropdown'
import React, { useState } from 'react';

// A good practice is to define reusable class strings for inputs and labels
const labelClasses = "block text-sm font-medium text-gray-600 mb-2";
const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 text-gray-800 caret-indigo-600";


function Profile() {
  // Example of using state to manage form data
  const [formData, setFormData] = useState({
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    location: "Kanpur, India",
    dob: "2002-08-15",
    password: "",
    targetRoles: "Software Engineer, Data Analyst",
    keySkills: "Python, React, SQL, AWS",
    university: "Indian Institute of Technology, Kanpur",
    major: "Computer Science and Engineering",
    gradYear: "2025",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    console.log("Profile data submitted:", formData);
    alert("Profile saved successfully!");
  };

    return (
    <div className="min-h-screen radial-background flex items-start justify-center p-6 sm:p-10">

      <div className="w-full max-w-4xl bg-[#2a1e5c]/90 backdrop-blur-sm rounded-xl shadow-xl p-8 sm:p-12 text-white">

        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white">Complete Your Profile</h1>
          <p className="text-gray-200 mt-2">This information helps us personalize your mock interview experience.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white pb-2 border-b border-white/20 mb-6">Basic Information 👤</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className={labelClasses + " text-white"}>Full Name</label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} required />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses + " text-white"}>Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} required />
              </div>
              <div>
                <label htmlFor="location" className={labelClasses + " text-white"}>Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
              <div>
                <label htmlFor="dob" className={labelClasses + " text-white"}>Date of Birth</label>
                <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
              <div>
                <label htmlFor="password" className={labelClasses + " text-white"}>New Password (Optional)</label>
                <input type="password" id="password" name="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
            </div>
          </div>

          {/* Section 2: Career Goals */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white pb-2 border-b border-white/20 mb-6">Career Goals 🎯</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="targetRoles" className={labelClasses + " text-white"}>Target Job Roles</label>
                <input type="text" id="targetRoles" name="targetRoles" value={formData.targetRoles} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
              <div>
                <label htmlFor="keySkills" className={labelClasses + " text-white"}>Key Skills</label>
                <input type="text" id="keySkills" name="keySkills" value={formData.keySkills} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
            </div>
          </div>

          {/* Section 3: Education & Background */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white pb-2 border-b border-white/20 mb-6">Education & Background 🎓</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="university" className={labelClasses + " text-white"}>University Name</label>
                <input type="text" id="university" name="university" value={formData.university} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
              <div>
                <label htmlFor="major" className={labelClasses + " text-white"}>Major / Field of Study</label>
                <input type="text" id="major" name="major" value={formData.major} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="gradYear" className={labelClasses + " text-white"}>Graduation Year</label>
                <input type="number" id="gradYear" name="gradYear" value={formData.gradYear} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} min="1980" max="2030" />
              </div>
            </div>
          </div>

          {/* Section 4: Professional Links */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white pb-2 border-b border-white/20 mb-6">Professional Links 🔗</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="linkedin" className={labelClasses + " text-white"}>LinkedIn Profile URL</label>
                <input type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedin} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
              <div>
                <label htmlFor="github" className={labelClasses + " text-white"}>GitHub Profile URL</label>
                <input type="url" id="github" name="github" placeholder="https://github.com/yourusername" value={formData.github} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="portfolio" className={labelClasses + " text-white"}>Portfolio URL</label>
                <input type="url" id="portfolio" name="portfolio" placeholder="https://yourwebsite.com" value={formData.portfolio} onChange={handleChange} className={inputClasses + " bg-white/10 text-white border-white/30 placeholder:text-gray-300"} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center">
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold py-3 px-10 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
              Save Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Profile;