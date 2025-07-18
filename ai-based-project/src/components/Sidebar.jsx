import { NavLink } from 'react-router-dom'
import { FaHome, FaChartBar, FaUser, FaCog } from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import React from 'react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { icon: <FaHome />, text: "Dashboard", path: "/dashboard" },
    { icon: <FaUser />, text: "Profile", path: "/profile" },
    { icon: <FaUser />, text: "Question Bank", path: "/question" },
    { icon: <FaChartBar />, text: "Reports", path: "/reports" },
    { icon: <FaCog />, text: "Settings", path: "/settings" },
  ]

  return (
    <div className={`bg-gray-800 h-full fixed ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {sidebarOpen && <h1 className="text-xl font-bold text-purple-400">InterviewReady</h1>}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center p-4 mx-2 rounded-lg transition-colors ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                isActive ? 'bg-purple-700 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <span className={`${sidebarOpen ? 'mr-3' : ''}`}>{item.icon}</span>
            {sidebarOpen && <span>{item.text}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar