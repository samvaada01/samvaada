import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';

const whatsappLinks = {
"Artificial Intelligence & Data Science":"https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
"Artificial Intelligence & Machine Learning":"https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
"Biotechnology": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
"Civil Engineering":"https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
"Computer & Communication Engineering":"https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
"Computer Science & Engineering" : "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
"Computer Science & Engineering(Cyber Security)": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
"Electrical & Electronics Engineering":"https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
"Electronics & Communication Engineering":"https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
"Electronics Engineering (VLSI Design & Technology)":"https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
"Electronics & Communication (Advanced Communication Technology)":"https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
"Information Science & Engineering" : "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
"Mechanical Engineering":"https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
"Robotics & Artificial Intelligence" : "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
};


export default function Community() {
  const [hasJoined, setHasJoined] = useState(false);
  const [branch, setBranch] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "" || branch === "") return;
    setHasJoined(true);
  };

  return (
    <div className="py-24 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-faint -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-glow/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto z-10"
      >
        {!hasJoined ? (
          <div className="bg-ground-card border border-brand-800 p-6 sm:p-8 rounded-2xl shadow-card backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 via-brand-glow to-brand-600 opacity-50" />
            <div className="text-center mb-6 sm:mb-8">
              <span className="cam-label mb-2 block">Join The Network</span>
              <h1 className="text-2xl sm:text-3xl font-display font-bold ink-gradient">NMAMIT Community</h1>
              <p className="text-ink-dim mt-2 text-xs sm:text-sm">Connect with peers from your branch.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-ink-dim mb-1.5 sm:mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-ground border border-brand-800 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base text-ink focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-ink-dim mb-1.5 sm:mb-2">Select Branch</label>
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-ground border border-brand-800 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base text-ink focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors appearance-none cursor-pointer truncate pr-10"
                  required
                >
                  <option value="" disabled>Select your branch</option>
                  {Object.keys(whatsappLinks).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full btn-cine mt-2 sm:mt-4 flex items-center justify-center gap-2 group py-2.5 sm:py-3 text-sm sm:text-base"
              >
                Join Community
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-ground-card border border-brand-800 p-6 sm:p-8 rounded-2xl shadow-card backdrop-blur-sm text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#25D366]" />
            <span className="cam-label mb-3 sm:mb-4 block text-[#25D366]">Access Granted</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 sm:mb-4">Welcome to NMAMIT Community</h2>
            
            <p className="text-sm sm:text-base text-ink-dim mb-6 sm:mb-8 leading-relaxed">
              This is the place where you will get all the information about all the activities that are going in and around the college. Join our community, stay connected, and <span className="font-semibold text-brand-glow block mt-1">Never miss any update</span>
            </p>

            <a 
              href={whatsappLinks[branch]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-4 py-3.5 sm:py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] w-full shadow-lg shadow-[#25D366]/20 text-sm sm:text-base"
            >
              <FaWhatsapp className="text-2xl sm:text-3xl shrink-0" />
              <span>Join WhatsApp Group</span>
            </a>
            
            <button 
              onClick={() => setHasJoined(false)}
              className="mt-6 text-sm text-ink-faint hover:text-ink-dim transition-colors"
            >
              ← Back
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
