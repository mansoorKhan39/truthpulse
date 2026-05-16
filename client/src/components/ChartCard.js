import React from "react";
import "./ChartCard.css";

export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`chart-card ${className}`}>
      {(title || subtitle) && (
        <div className="cc-header">
          {title    && <h3 className="cc-title">{title}</h3>}
          {subtitle && <p  className="cc-sub">{subtitle}</p>}
        </div>
      )}
      <div className="cc-body">{children}</div>
    </div>
  );
}
