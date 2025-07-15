import ProfileDropdown from '../components/ProfileDropdown'
import React from 'react';

const Profile = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl">
              U
            </div>
            <div>
              <h2 className="text-xl font-semibold">User Name</h2>
              <p className="text-gray-400">user@example.com</p>
            </div>
          </div>
          <ProfileDropdown />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">First Name</label>
              <input 
                type="text" 
                defaultValue="User" 
                className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Last Name</label>
              <input 
                type="text" 
                defaultValue="Name" 
                className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              defaultValue="user@example.com" 
              className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile