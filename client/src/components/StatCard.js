import React from "react";
import "./StatCard.css";

export default function StatCard({ label, value, sub, accent = "blue", icon }) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      <div className="stat-glow" />
    </div>
  );
}
