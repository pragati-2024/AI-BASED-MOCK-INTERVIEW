import React from 'react';

const InterviewTips = () => {
  return (
    <div className="bg-gradient-to-b from-[#2c1b4e] via-[#110b23] to-[#0a061b] text-[#e6f1ff]">
      
      <header className="text-center px-6 pt-28 pb-20 relative overflow-hidden border-b border-[#1e2a47]">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9d7aff] to-[#64ffda] text-transparent bg-clip-text mb-4 animate-fadeInDown">
          Interview Mastery Unleashed
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-[#ccd6f6] animate-fadeInUp">
          Transform from nervous candidate to confident professional with these battle-tested strategies that make interviewers say "Wow!"
        </p>
        <div className="relative max-w-xl mx-auto mt-10 animate-fadeIn">
          <input
            type="text"
            placeholder="Search for killer interview tactics..."
            className="w-full py-4 px-6 rounded-full bg-[#112240] text-white border border-[#1e2a47] focus:outline-none focus:ring-2 focus:ring-[#64ffda]"
          />
          <button className="absolute right-2 top-2 bg-gradient-to-r from-[#9d7aff] to-[#7f5af0] text-white px-6 py-2 rounded-full font-semibold hover:translate-y-[-2px] transition">
            Find Secrets
          </button>
        </div>
      </header>

      
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-[#ccd6f6] mb-10 relative inline-block">
          Dominate Every Interview Dimension
          <span className="block w-20 h-1 bg-gradient-to-r from-[#9d7aff] to-[#64ffda] mx-auto mt-2"></span>
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "All Superpowers", "Communication", "Leadership", "Problem Solving",
            "Storytelling", "Technical", "Body Language", "Negotiation",
            "Creativity", "Stress Management"
          ].map((tag, i) => (
            <div key={i} className={`px-6 py-2 rounded-full border border-[#1e2a47] font-medium bg-[#112240] text-white transition hover:scale-105 hover:shadow-lg ${i === 0 ? 'bg-gradient-to-r from-[#9d7aff] to-[#7f5af0] text-white' : ''}`}>
              {tag}
            </div>
          ))}
        </div>
      </section>

      
      <section className="px-6 pb-20">
        <h2 className="text-3xl text-center font-bold text-[#ccd6f6] mb-10">
          Interview Ninja Tactics
          <span className="block w-20 h-1 bg-gradient-to-r from-[#9d7aff] to-[#64ffda] mx-auto mt-2"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              category: "Communication",
              title: "The 3-Second Rule That Makes You Unforgettable",
              excerpt: "Discover the neuroscience-backed technique that makes interviewers hang on your every word (most candidates never do this).",
              img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1350&q=80",
            },
            {
              category: "Leadership",
              title: "Fake It Till You Make It? Better Strategy Inside",
              excerpt: "How to demonstrate leadership when you've never managed a team (this works even for entry-level candidates).",
              img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80",
            },
            {
              category: "Problem Solving",
              title: "The Consultant's Secret Framework",
              excerpt: "McKinsey consultants use this exact method to crush case interviews - adapted for any problem-solving question.",
              img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1350&q=80",
            },
            {
              category: "Storytelling",
              title: 'Hollywood\'s Formula for "Tell Me About Yourself"',
              excerpt: "Screenwriters use this story structure to captivate audiences - perfect it for your interview opener.",
              img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1350&q=80",
            },
            {
              category: "Technical",
              title: "Whiteboard Interviews: How to Fail Gracefully",
              excerpt: "What to do when you're completely stuck (this saved my Google interview when I blanked on binary trees).",
              img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1350&q=80",
            },
            {
              category: "Negotiation",
              title: "Salary Negotiation: The Magic Number Trick",
              excerpt: "How to name your price without pricing yourself out (this one phrase increased my offer by 22%).",
              img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1350&q=80",
            }
          ].map((card, i) => (
            <div key={i} className="bg-[#112240] rounded-lg overflow-hidden border border-[#1e2a47] shadow-lg transform hover:-translate-y-2 transition">
              <img src={card.img} alt={card.category} className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105" />
              <div className="p-5">
                <span className="inline-block mb-2 text-sm font-semibold bg-[#9d7aff1a] text-[#9d7aff] px-3 py-1 rounded border border-[#9d7aff4d]">
                  {card.category}
                </span>
                <h3 className="text-xl font-bold text-[#ccd6f6] hover:text-[#64ffda] transition mb-2">
                  {card.title}
                </h3>
                <p className="text-[#8892b0] text-sm">{card.excerpt}</p>
                <a href="/error-404" className="inline-flex items-center mt-4 text-[#64ffda] hover:text-[#9d7aff] font-semibold text-sm transition">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="bg-gradient-to-r from-[#112240] to-[#0a192f] py-16 border-t border-b border-[#1e2a47]">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-around text-center gap-8 px-4">
          {[
            { stat: "97%", label: "More Confidence" },
            { stat: "3.5x", label: "More Callbacks" },
            { stat: "42%", label: "Higher Offers" },
          ].map((s, i) => (
            <div key={i} className="min-w-[150px]">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#9d7aff] to-[#64ffda] text-transparent bg-clip-text mb-2">
                {s.stat}
              </div>
              <div className="uppercase tracking-widest text-[#8892b0] text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InterviewTips;
