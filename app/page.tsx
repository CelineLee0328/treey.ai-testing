"use client";
import { useState } from "react";

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const handleGenerate = () => {
    console.log("=== GENERATE CLICKED ===");
    console.log("Selected Model:", selectedModel);
    console.log("Scenario/Prompt:", promptText);
    console.log("Product Image:", selectedImage ? selectedImage.name : "None");
    console.log("========================");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col font-sans text-white relative overflow-hidden">
      
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 bg-black/30 backdrop-blur-xl border-b border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🌳</div>
          <div className="text-2xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            treey.ai
          </div>
        </div>
        <div className="hidden sm:flex gap-6 text-sm">
          <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
          <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">About</a>
          <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
        </div>
      </header>

      {/* Main Section */}
      <section className="relative z-10 flex flex-1 items-center justify-center flex-col text-center px-4 py-12">
        <div className="mb-8 inline-block">
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-sm text-cyan-300 backdrop-blur-sm">
            ✨ AI-Powered Virtual Try-On
          </span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-black mb-6 leading-tight">
          <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Transform Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Product Vision
          </span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-2xl">
          Experience the future of virtual modeling. Upload your product, choose a model, and watch the magic happen.
        </p>

        <button
          className="group relative mb-12 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 overflow-hidden"
          onClick={() => setShowInput(!showInput)}
        >
          <span className="relative z-10 text-white text-lg flex items-center gap-2">
            {showInput ? "← Go Back" : "Get Started →"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>

        {showInput && (
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Input Card */}
            <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-500/20 shadow-2xl mb-8">
              
              {/* Scenario Input */}
              <div className="mb-6">
                <label className="block text-left text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Describe Your Scenario
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Professional business meeting, Beach vacation, Evening party..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 backdrop-blur-sm border-2 border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                    ✍️
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <label className="block text-left text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Upload Product Image
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setSelectedImage(file);
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 backdrop-blur-sm border-2 border-dashed border-gray-700 text-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-purple-500 file:text-white hover:file:shadow-lg hover:border-cyan-400 transition-all cursor-pointer group-hover:border-cyan-500/50"
                  />
                  {selectedImage && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                      ✓
                    </div>
                  )}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-left text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">
                  Select Your Model
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "Sophia", desc: "Professional", color: "from-pink-500 to-rose-500", emoji: "👔" },
                    { name: "Liam", desc: "Casual", color: "from-blue-500 to-teal-500", emoji: "👕" },
                    { name: "Isabella", desc: "Artistic", color: "from-purple-500 to-indigo-500", emoji: "🎨" },
                    { name: "Noah", desc: "Sporty", color: "from-orange-500 to-red-500", emoji: "⚡" },
                  ].map((model) => (
                    <div
                      key={model.name}
                      onClick={() => setSelectedModel(model.name)}
                      className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedModel === model.name
                          ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20"
                          : "bg-slate-900/50 border-2 border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${model.color} mb-3 flex items-center justify-center text-4xl shadow-lg`}>
                        {model.emoji}
                      </div>
                      <p className="font-bold text-white text-lg">{model.name}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{model.desc}</p>
                      {selectedModel === model.name && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-black text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              className="group relative w-full sm:w-auto px-16 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white text-xl font-black shadow-2xl shadow-purple-500/40 hover:shadow-cyan-400/60 hover:scale-[1.02] transition-all duration-500 overflow-hidden"
              onClick={handleGenerate}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>GENERATE MAGIC</span>
                <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">✨</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-xl text-white px-8 py-8 flex flex-col items-center gap-4 border-t border-cyan-500/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <p className="font-bold tracking-widest text-cyan-400 uppercase text-sm">Our Team</p>
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-400">
          <a href="mailto:joao@example.com" className="hover:text-cyan-400 transition-colors">João</a>
          <span className="hidden sm:block">•</span>
          <a href="mailto:celine@example.com" className="hover:text-cyan-400 transition-colors">Celine</a>
          <span className="hidden sm:block">•</span>
          <a href="mailto:sylvia@example.com" className="hover:text-cyan-400 transition-colors">Sylvia</a>
        </div>
        <p className="text-xs text-gray-600 mt-2">© 2024 treey.ai - All rights reserved</p>
      </footer>
    </main>
  );
}