"use client";
import { useState } from "react";
import "./globals.css"; // Import the CSS file

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="page">
      {/* Topbar */}
      <header className="topbar">
        <div className="logo">🌳 treey.ai</div>
        <div className="coming-soon">Coming Soon</div>
      </header>

      {/* Main content */}
      <main className="main-content">
        {/* Description Box */}
        <div className="description-box">
          <p>
            DESCRIPTIOOOOOOOOOOOOOOOOOOOOOOOOOOOON.
          </p>
        </div>

        {/* Text Input Box */}
        <div className="text-input-box">
          <label>Enter text:</label>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type something..."
          />
        </div>

        {/* Image Upload Box */}
        <div className="image-input-box">
          <label>UPLOADDDD</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {image && <img src={image} alt="Uploaded" />}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="contacts">
          <strong>Contacts:</strong> contact@treey.ai | +1 234 567 890
        </div>
        <div className="team">
          <strong>Team:</strong> SYLVIA,CELINE AND SIMAO
        </div>
      </footer>
    </div>
  );
}
