import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const questionData = [
  { id: 1, name: 'HTML Notes', description: 'View Interview Questions', category: 'Frontend', image: '../assets/html.png', path: 'html' },
  { id: 2, name: 'CSS Notes', description: 'View Interview Questions', category: 'Frontend', image: '../assets/css-3.png', path: 'css' },
  { id: 3, name: 'JavaScript Notes', description: 'View Interview Questions', category: 'Frontend', image: '../assets/js.png', path: 'javascript' },
  { id: 4, name: 'React Notes', description: 'View Interview Questions', category: 'Frontend', image: '../assets/react.png', path: 'react' },
  { id: 5, name: 'Node.js Notes', description: 'View Interview Questions', category: 'Backend', image: '../assets/node-js.png', path: 'node' },
  { id: 6, name: 'Python Notes', description: 'View Interview Questions', category: 'Backend', image: '../assets/python.png', path: 'path' },
  { id: 7, name: 'DevOps Notes', description: 'View Interview Questions', category: 'DevOps', image: '../assets/devops.png', path: 'devops' },
  { id: 8, name: 'AI/ML Notes', description: 'View Interview Questions', category: 'AI/ML', image: '../assets/ai.png', path: 'ai-ml' },
];

const categories = ['Frontend', 'Backend', 'DevOps', 'AI/ML'];

// Helper function to group data by category
const groupByCategory = (data) => {
  return data.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});
};

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  const filteredData = questionData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const groupedAndFilteredData = groupByCategory(filteredData);
 const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <div className="min-h-screen px-6 py-10 radial-background text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Interview Question Bank</h1>
        <p className="text-lg text-purple-200">Select your topic to view detailed questions</p>
      </div>

      {/* Categories Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          className={`px-5 py-2 rounded-full font-semibold transition ${!activeCategory ? 'bg-pink-600 text-white' : 'bg-pink-400 text-white hover:bg-pink-500'}`}
          onClick={() => setActiveCategory('')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-full font-semibold transition ${activeCategory === cat ? 'bg-pink-600 text-white' : 'bg-pink-400 text-white hover:bg-pink-500'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search topic..."
          className="w-full max-w-md px-5 py-3 rounded-lg bg-purple-700 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area with Horizontal Scrolling Rows */}
      <div className="max-w-7xl mx-auto space-y-12">
        {Object.entries(groupedAndFilteredData).map(([category, items]) => (
          <div key={category} className="category-row">
            <h2 className="text-2xl font-bold mb-4 px-2">{category}</h2>
            <div className="card-scroll-container">
              {items.map((item) => (
                <div key={item.id} className="card-item bg-purple-600 hover:bg-purple-500 transition rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
                  <img src={new URL(item.image, import.meta.url).href} alt={item.name} className="w-20 h-20 mb-4" />
                  <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                  <p className="text-purple-200 mb-4">{item.description}</p>
                  <button
                    className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
                    onClick={() => navigate(`/questions/${item.path}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
      </div>
  );
};

export default QuestionBank;