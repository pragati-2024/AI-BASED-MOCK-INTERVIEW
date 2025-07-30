import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Mic,
  User,
  Star,
  RotateCcw,
} from "lucide-react";

const faqData = [
  {
    icon: <Star size={20} />,
    question: "What is Mockneto?",
    answer: "Mockneto is an AI-powered platform for mock interviews to help you prepare effectively.",
  },
  {
    icon: <User  size={20} />,
    question: "How does the AI interview work?",
    answer: "The AI conducts interviews using NLP and ML models and gives instant feedback on your performance.",
  },
  {
    icon: <ShieldCheck size={20} />,
    question: "Is Mockneto free to use?",
    answer: "Yes, Mockneto offers free and premium interview practice options.",
  },
  {
    icon: <User  size={20} />,
    question: "What types of interviews can I practice?",
    answer: "You can practice technical, HR, behavioral, and domain-specific interviews.",
  },
  {
    icon: <Star size={20} />,
    question: "Can I customize the mock interview?",
    answer: "Yes, you can choose the difficulty, domain, and number of questions.",
  },
  {
    icon: <RotateCcw size={20} />,
    question: "Will I get feedback after the mock interview?",
    answer: "Yes, AI-generated feedback is provided instantly after every mock session.",
  },
  {
    icon: <Star size={20} />,
    question: "Can I track my performance over time?",
    answer: "Yes, Mockneto tracks your past interviews and gives you performance analytics.",
  },
  {
    icon: <ShieldCheck size={20} />,
    question: "Is my data safe on Mockneto?",
    answer: "Yes, we follow strict data protection standards.",
  },
  {
    icon: <Mic size={20} />,
    question: "Do I need a mic or camera?",
    answer: "Yes, to simulate a real interview environment, a mic and camera are recommended.",
  },
  {
    icon: <RotateCcw size={20} />,
    question: "Can I retake an interview?",
    answer: "Absolutely, you can retake interviews as many times as you want.",
  },
];

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  const handleToggle = (index) => {
    setOpenIndex((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIndex([]);
    } else {
      setOpenIndex(faqData.map((_, i) => i));
    }
    setAllExpanded(!allExpanded);
  };

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );
 const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <div className="min-h-screen bg-[#0f0e17] text-white py-12 px-4">
      <h1 className="text-5xl sm:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Frequently Asked Questions
      </h1>

      <div className="max-w-4xl mx-auto mb-6 flex items-center space-x-2">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 bg-[#1a1a2e] text-white rounded focus:outline-none transition duration-300 ease-in-out hover:bg-[#2a2a3e]"
        />
      </div>

      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={toggleAll}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition duration-300 ease-in-out"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="border border-purple-600 rounded-lg bg-[#1a1a2e] p-4 transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => handleToggle(index)}
              className="flex items-center justify-between w-full text-left font-semibold transition duration-300 ease-in-out hover:text-purple-300"
            >
              <span className="flex items-center gap-2 text-purple-300">
                {faq.icon} {faq.question}
              </span>
              {openIndex.includes(index) ? <ChevronUp className="text-purple-300" /> : <ChevronDown className="text-purple-300" />}
            </button>
            {openIndex.includes(index) && (
              <p className="mt-2 text-sm text-gray-300 transition duration-300 ease-in-out">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
      </div>
  );
};

export default Faq;
