import React from "react";
import "./SectionHeader.css";

export default function SectionHeader({ tag, title, desc }) {
  return (
    <div className="section-header">
      {tag && <span className={`tag tag-blue sh-tag`}>{tag}</span>}
      <h2 className="sh-title">{title}</h2>
      {desc && <p className="sh-desc">{desc}</p>}
    </div>
  );
}
