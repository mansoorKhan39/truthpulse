import React, { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell
} from "recharts";
import { useEDA } from "../hooks/useEDA";
import Loader from "../components/Loader";
import ChartCard from "../components/ChartCard";
import SectionHeader from "../components/SectionHeader";
import "./Sentiment.css";

const TOPICS = ["Politics", "Health", "Economy", "Climate", "Technology", "Entertainment", "Crime", "Sports"];
const SENT_COLORS = { Positive: "#06d6a0", Negative: "#e63946", Neutral: "#4361ee" };

export default function Sentiment() {
  const { data, loading } = useEDA();
  const [activeTopic, setActiveTopic] = useState("Politics");

  if (loading) return <><div style={{ height: 64 }} /><Loader /></>;

  const { sentiment, length_distribution } = data;

  // Radar data: all topics, one axis per topic
  const radarData = TOPICS.map(topic => ({
    topic,
    Positive: sentiment.by_topic[topic].Positive,
    Negative: sentiment.by_topic[topic].Negative,
    Neutral:  sentiment.by_topic[topic].Neutral,
  }));

  // Bar chart for selected topic
  const topicSent = sentiment.by_topic[activeTopic];
  const topicBar = Object.entries(topicSent).map(([k, v]) => ({ name: k, value: v }));

  // Length distribution chart
  const lenData = Object.entries(length_distribution).map(([bucket, vals]) => ({
    bucket, fake: vals.fake, real: vals.real
  }));

  // Sentiment stacked bar all topics
  const stackedData = TOPICS.map(topic => ({
    topic: topic.slice(0, 5),
    ...sentiment.by_topic[topic]
  }));

  return (
    <div className="page">
      <div className="page-hero-sm grid-bg">
        <div className="page-hero-inner">
          <span className="tag tag-green">Sentiment Analysis</span>
          <h1>Emotional Landscape of News</h1>
          <p>How positive, negative, and neutral tones vary across topics — and how fake vs. real news weaponizes emotion differently.</p>
        </div>
      </div>

      <div className="page-content">
        <SectionHeader
          tag="NLP · VADER / TextBlob"
          title="Topic-Level Sentiment Breakdown"
          desc="Click a topic to drill down into its sentiment composition. Each score represents percentage of articles classified into that polarity bucket."
        />

        {/* Topic selector */}
        <div className="topic-tabs">
          {TOPICS.map(t => (
            <button
              key={t}
              className={`topic-tab ${activeTopic === t ? "active" : ""}`}
              onClick={() => setActiveTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="sent-drill">
          <ChartCard title={`${activeTopic} — Sentiment Split`} subtitle="Percentage of articles by sentiment class">
            <div className="drill-bars">
              {topicBar.map(({ name, value }) => (
                <div key={name} className="drill-row">
                  <span className="drill-label">{name}</span>
                  <div className="drill-track">
                    <div
                      className="drill-fill"
                      style={{ width: `${value}%`, background: SENT_COLORS[name] }}
                    />
                  </div>
                  <span className="drill-pct">{value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Sentiment Insight" subtitle={`Key observation for ${activeTopic}`}>
            <div className="insight-box">
              <div className="insight-icon">
                {topicSent.Negative > 50 ? "🔴" : topicSent.Positive > 50 ? "🟢" : "🔵"}
              </div>
              <p className="insight-text">
                {topicSent.Negative > 50
                  ? `${activeTopic} coverage skews heavily negative (${topicSent.Negative}%), suggesting fear-based framing or crisis-driven reporting.`
                  : topicSent.Positive > 50
                  ? `${activeTopic} articles trend positive (${topicSent.Positive}%), possibly reflecting promotional or aspirational coverage.`
                  : `${activeTopic} shows a balanced distribution, with neutral tone at ${topicSent.Neutral}% indicating factual, reported-style content.`
                }
              </p>
              <div className="insight-stats">
                <div className="i-stat"><span>Positive</span><strong style={{ color: "#06d6a0" }}>{topicSent.Positive}%</strong></div>
                <div className="i-stat"><span>Negative</span><strong style={{ color: "#e63946" }}>{topicSent.Negative}%</strong></div>
                <div className="i-stat"><span>Neutral</span><strong style={{ color: "#4361ee" }}>{topicSent.Neutral}%</strong></div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Stacked bar */}
        <ChartCard
          title="Stacked Sentiment Across All Topics"
          subtitle="Comparing positive/negative/neutral ratios side by side"
          className="mt-20"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stackedData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="topic" tick={{ fill: "#8b8fa8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555872", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }}
                formatter={(v) => [`${v}%`]}
              />
              <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
              <Bar dataKey="Positive" stackId="a" fill="#06d6a0" />
              <Bar dataKey="Neutral"  stackId="a" fill="#4361ee" />
              <Bar dataKey="Negative" stackId="a" fill="#e63946" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radar */}
        <div className="two-col mt-20">
          <ChartCard title="Positive Sentiment Radar" subtitle="How positivity varies across all 8 topic categories">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: "#8b8fa8", fontSize: 10, fontFamily: "DM Mono" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#555872", fontSize: 9 }} />
                <Radar name="Positive" dataKey="Positive" stroke="#06d6a0" fill="#06d6a0" fillOpacity={0.2} />
                <Radar name="Negative" dataKey="Negative" stroke="#e63946" fill="#e63946" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Article length */}
          <ChartCard title="Article Length vs. Classification" subtitle="Fake articles tend to be shorter — a key linguistic signal">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="bucket" tick={{ fill: "#8b8fa8", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555872", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
                <Bar dataKey="fake" name="Fake" fill="#e63946" radius={[4, 4, 0, 0]} />
                <Bar dataKey="real" name="Real" fill="#06d6a0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="chart-note">Word count buckets (e.g., 301–600 words)</p>
          </ChartCard>
        </div>

        {/* Key findings */}
        <div className="findings-grid">
          <div className="finding-card fc-red">
            <div className="fc-num">01</div>
            <h4>Fake News is More Negative</h4>
            <p>Fake articles average 18% higher negative sentiment scores, exploiting emotional arousal to drive sharing behavior.</p>
          </div>
          <div className="finding-card fc-green">
            <div className="fc-num">02</div>
            <h4>Real News is More Neutral</h4>
            <p>Verified reporting tends toward neutral language, prioritizing factual framing over emotional manipulation.</p>
          </div>
          <div className="finding-card fc-blue">
            <div className="fc-num">03</div>
            <h4>Crime & Politics Most Negative</h4>
            <p>Both categories show &gt;50% negative sentiment, making them most susceptible to fake news amplification.</p>
          </div>
          <div className="finding-card fc-yell">
            <div className="fc-num">04</div>
            <h4>Technology Coverage is Optimistic</h4>
            <p>Tech articles skew 40%+ positive — the highest of any category — reflecting innovation-focused narratives.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
