import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { useState } from 'react';
const Settings = () => {
   const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-3xl">
        <div className="space-y-6">
          <Section title="Account Settings">
            <ToggleSetting label="Email notifications" defaultChecked />
            <ToggleSetting label="Dark mode" defaultChecked />
          </Section>
          
          <Section title="Interview Preferences">
            <SelectSetting 
              label="Default difficulty" 
              options={['Easy', 'Medium', 'Hard']} 
              defaultValue="Medium"
            />
            <SelectSetting 
              label="Preferred language" 
              options={['English', 'Spanish', 'French', 'German']} 
              defaultValue="English"
            />
          </Section>
          
          <div className="pt-4 border-t border-gray-700">
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
      </div>
  )
}

const Section = ({ title, children }) => {
  return (
    <div className="pb-6 border-b border-gray-700">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

const ToggleSetting = ({ label, defaultChecked = false }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      </label>
    </div>
  )
}

const SelectSetting = ({ label, options, defaultValue }) => {
  return (
    <div>
      <label className="block text-gray-300 mb-2">{label}</label>
      <select 
        defaultValue={defaultValue}
        className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default Settings