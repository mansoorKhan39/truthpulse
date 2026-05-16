import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";
import { useEDA } from "../hooks/useEDA";
import Loader from "../components/Loader";
import ChartCard from "../components/ChartCard";
import SectionHeader from "../components/SectionHeader";
import "./TopicTrends.css";

const TOPIC_COLORS = {
  Politics:      "#e63946",
  Health:        "#06d6a0",
  Economy:       "#ffd60a",
  Climate:       "#4cc9f0",
  Technology:    "#4361ee",
  Entertainment: "#f77f00",
  Crime:         "#b5838d",
  Sports:        "#90be6d",
};

const TOPICS = Object.keys(TOPIC_COLORS);

export default function TopicTrends() {
  const { data, loading } = useEDA();
  const [selected, setSelected] = useState(new Set(["Politics", "Health", "Technology"]));
  const [view, setView] = useState("line");

  if (loading) return <><div style={{ height: 64 }} /><Loader /></>;

  const { topic_trends, fake_real_ratio } = data;

  // Build unified monthly data
  const months = topic_trends.Politics.months;
  const unified = months.map((month, i) => {
    const obj = { month };
    TOPICS.forEach(t => { obj[t] = topic_trends[t].counts[i]; });
    return obj;
  });

  const toggleTopic = (t) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); }
      else next.add(t);
      return next;
    });
  };

  // Topic volume totals
  const topicTotals = TOPICS.map(t => ({
    topic: t,
    total: topic_trends[t].counts.reduce((a, b) => a + b, 0),
    color: TOPIC_COLORS[t],
  })).sort((a, b) => b.total - a.total);

  const maxTotal = topicTotals[0].total;

  // Fake/real bar data
  const frData = Object.entries(fake_real_ratio).map(([topic, v]) => ({
    topic, ...v, delta: v.fake - v.real
  })).sort((a, b) => b.delta - a.delta);

  return (
    <div className="page">
      <div className="page-hero-sm grid-bg">
        <div className="page-hero-inner">
          <span className="tag tag-yell">Topic Modeling</span>
          <h1>What the World Was Reading</h1>
          <p>Monthly article volume trends across 8 major topic categories — revealing which subjects dominated public discourse and when.</p>
        </div>
      </div>

      <div className="page-content">
        <SectionHeader
          tag="Time Series"
          title="Monthly Topic Volume"
          desc="Select topics below to compare their publishing volume over 12 months. Each data point represents articles published in that category."
        />

        {/* Topic toggles */}
        <div className="topic-toggles">
          {TOPICS.map(t => (
            <button
              key={t}
              className={`tt-btn ${selected.has(t) ? "on" : "off"}`}
              style={selected.has(t) ? { borderColor: TOPIC_COLORS[t], color: TOPIC_COLORS[t], background: `${TOPIC_COLORS[t]}18` } : {}}
              onClick={() => toggleTopic(t)}
            >
              <span className="tt-dot" style={{ background: TOPIC_COLORS[t] }} />
              {t}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="view-toggle">
          <button className={view === "line" ? "active" : ""} onClick={() => setView("line")}>Line</button>
          <button className={view === "area" ? "active" : ""} onClick={() => setView("area")}>Area</button>
        </div>

        <ChartCard title="Article Volume by Topic" subtitle="Monthly publishing frequency 2015–2018">
          <ResponsiveContainer width="100%" height={380}>
            {view === "line" ? (
              <LineChart data={unified}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555872", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
                {TOPICS.filter(t => selected.has(t)).map(t => (
                  <Line key={t} type="monotone" dataKey={t} stroke={TOPIC_COLORS[t]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            ) : (
              <AreaChart data={unified}>
                <defs>
                  {TOPICS.filter(t => selected.has(t)).map(t => (
                    <linearGradient key={t} id={`grad-${t}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TOPIC_COLORS[t]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={TOPIC_COLORS[t]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555872", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
                {TOPICS.filter(t => selected.has(t)).map(t => (
                  <Area key={t} type="monotone" dataKey={t} stroke={TOPIC_COLORS[t]} fill={`url(#grad-${t})`} strokeWidth={2} />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        {/* Topic volume ranking */}
        <SectionHeader tag="Volume Ranking" title="Total Article Volume by Topic" desc="Aggregated across the full dataset period." />
        <div className="topic-ranks">
          {topicTotals.map((t, i) => (
            <div key={t.topic} className="rank-row">
              <span className="rank-num">#{i + 1}</span>
              <span className="rank-label">{t.topic}</span>
              <div className="rank-track">
                <div className="rank-fill" style={{ width: `${(t.total / maxTotal) * 100}%`, background: t.color }} />
              </div>
              <span className="rank-total">{t.total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Fake news by topic */}
        <SectionHeader
          tag="Misinformation Index"
          title="Which Topics Attract Most Fake News?"
          desc="Ranked by fake article share. Higher delta = topic is more heavily targeted by misinformation."
        />
        <div className="mis-grid">
          {frData.map(d => (
            <div key={d.topic} className={`mis-card ${d.delta > 10 ? "hot" : d.delta < 0 ? "safe" : ""}`}>
              <div className="mis-top">
                <span className="mis-topic">{d.topic}</span>
                <span className={`tag ${d.delta > 10 ? "tag-red" : d.delta < 0 ? "tag-green" : "tag-yell"}`}>
                  {d.delta > 10 ? "High Risk" : d.delta < 0 ? "Low Risk" : "Medium"}
                </span>
              </div>
              <div className="mis-bars">
                <div className="mis-row">
                  <span>Fake</span>
                  <div className="mis-track">
                    <div className="mis-fill fake" style={{ width: `${d.fake}%` }} />
                  </div>
                  <span>{d.fake}%</span>
                </div>
                <div className="mis-row">
                  <span>Real</span>
                  <div className="mis-track">
                    <div className="mis-fill real" style={{ width: `${d.real}%` }} />
                  </div>
                  <span>{d.real}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
