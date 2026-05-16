import React from "react";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-wrap">
      <div className="loader-hex">
        <div className="hex-ring" />
        <div className="hex-ring r2" />
        <span className="hex-icon">⬡</span>
      </div>
      <p className="loader-text">Loading dataset<span className="dots">...</span></p>
    </div>
  );
}
