"use client";
import { useState } from "react";

export default function Home() {
  //variables
  const [showInput, setShowInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [promptText, setPromptText] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  
  const handleGenerate = () => {
    console.log("--- GENERATE COMMAND EXECUTED ---");
    console.log("Prompt:", promptText); 
    console.log("Image:", selectedImage ? selectedImage.name : "None");
    console.log("Age:", age);
    console.log("Gender:", gender);
    // API VALUES!
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a2e] flex flex-col font-sans text-white">
      
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#0d0d0d] shadow-lg border-b border-cyan-500">
        <div className="text-2xl font-bold tracking-widest text-cyan-400 animate-pulse">
          🌳 treey.ai
        </div>
      </header>

      {/* Main Section */}
      <section className="flex flex-1 items-center justify-center flex-col text-center px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
          Hello there! <br /> It's about to start...
        </h1>

        <button
          className="mb-6 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold shadow-lg hover:scale-105 hover:shadow-cyan-400/50 transition-all duration-300"
          onClick={() => setShowInput(!showInput)}
        >
          {showInput ? "Hide Input" : "Try it out!"}
        </button>

        {showInput && (
          <div className="flex flex-col items-center">
            
            {/* Text Input Box */}
            <input
              type="text"
              placeholder="Describe your scenario"
              className="px-4 py-2 w-72 sm:w-96 rounded-lg bg-gray-900/70 backdrop-blur-sm border border-cyan-400 placeholder-cyan-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
            
            {/* Image Input Box */}
            <input
              type="file"
              accept="image/*" // Only allow image files
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedImage(file);
              }}
              className="mt-4 px-4 py-2 w-72 sm:w-96 rounded-lg bg-gray-900/70 backdrop-blur-sm border border-cyan-400 placeholder-cyan-300 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-600 transition-all cursor-pointer"
            />
            

            {/* Age and Gender Input Box */}
            <div className="mt-6 p-4 w-72 sm:w-96 rounded-lg bg-gray-900/70 backdrop-blur-sm border border-purple-500 flex justify-between items-center space-x-4">
    
              {/* Age Input  */}
              <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-20 px-1 py-2 rounded-lg bg-gray-800 border border-purple-400 placeholder-purple-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-right"
              />

              {/* Gender Input */}
              <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  // The remaining space is now available for Gender Input, adjusted to flex-1
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-purple-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all cursor-pointer"
              >
                  <option value="" disabled className="text-gray-400">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
              </select>
          </div>
                      
            {/* --- FINAL GENERATE BUTTON --- */}
            <button
              className="mt-8 px-12 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 text-black text-lg font-extrabold shadow-xl shadow-cyan-500/30 hover:scale-[1.03] hover:shadow-cyan-400/50 transition-all duration-300 transform"
              onClick={handleGenerate}
            >
              GENERATE
            </button>

          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#0d0d0d] text-white shadow-md px-8 py-4 flex flex-col items-center gap-1 border-t border-cyan-500">
        <p className="font-semibold tracking-wide text-cyan-400">Our Team</p>
        <p className="text-sm sm:text-base">
          João – joao@example.com | Celine – celine@example.com | Sylvia – sylvia@example.com
        </p>
      </footer>
    </main>
  );
}