import { useState } from 'react';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import React from 'react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 rounded-full p-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
          <span className="text-white">U</span>
        </div>
        <FiChevronDown className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
          <DropdownItem icon={<FiUser />} text="Profile" />
          <DropdownItem icon={<FiSettings />} text="Settings" />
          <div className="border-t border-gray-700 my-1"></div>
          <DropdownItem icon={<FiLogOut />} text="Logout" />
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, text }) => {
  return (
    <div className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export default ProfileDropdown;