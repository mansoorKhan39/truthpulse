import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from "recharts";
import { useEDA } from "../hooks/useEDA";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import SectionHeader from "../components/SectionHeader";
import "./Dashboard.css";

const COLORS = ["#e63946", "#06d6a0", "#4361ee", "#ffd60a", "#f77f00", "#a8dadc", "#b5838d", "#90be6d"];

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n;
}

export default function Dashboard() {
  const { data, loading, error } = useEDA();

  if (loading) return <><div style={{ height: 64 }} /><Loader /></>;
  if (error)   return <div className="page-err">Failed to load: {error}</div>;

  const { dataset_stats: s, fake_real_ratio, sentiment, trending_hashtags, polarity_over_time } = data;

  // Fake vs Real by topic for bar chart
  const fakeRealData = Object.entries(fake_real_ratio).map(([topic, v]) => ({
    topic: topic.slice(0, 4), real: v.real, fake: v.fake
  }));

  // Overall sentiment pie
  const sentPie = Object.entries(sentiment.overall).map(([k, v]) => ({ name: k, value: v }));
  const sentColors = { Positive: "#06d6a0", Negative: "#e63946", Neutral: "#4361ee" };

  // Polarity line
  const polarData = polarity_over_time.months.map((m, i) => ({
    month: m,
    Fake: polarity_over_time.fake_polarity[i],
    Real: polarity_over_time.real_polarity[i],
    Tweet: polarity_over_time.tweet_polarity[i],
  }));

  return (
    <div className="page dashboard">
      {/* Hero */}
      <section className="hero grid-bg">
        <div className="hero-inner">
          <div className="hero-badges">
            <span className="tag tag-red">EDA · NLP</span>
            <span className="tag tag-blue">44,898 Articles</span>
            <span className="tag tag-green">160K Tweets</span>
          </div>
          <h1 className="hero-title">
            Decoding <span className="serif">Misinformation</span><br />
            through Data
          </h1>
          <p className="hero-desc">
            Exploratory data analysis across fake news corpora and Twitter sentiment datasets —
            uncovering linguistic patterns, emotional triggers, and topic dynamics that separate
            credible reporting from manufactured narratives.
          </p>
          <div className="hero-pills">
            <span className="pill">Word Frequency</span>
            <span className="pill">Sentiment Analysis</span>
            <span className="pill">Topic Modeling</span>
            <span className="pill">Polarity Tracking</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="pulse-ring r1" />
          <div className="pulse-ring r2" />
          <div className="pulse-ring r3" />
          <div className="pulse-core">
            <span>⬡</span>
          </div>
        </div>
      </section>

      <div className="page-content">
        {/* Stat cards */}
        <div className="stats-grid">
          <StatCard label="Total Articles" value={fmt(s.total_articles)} sub="Fake News + Real News datasets" accent="blue" icon="📰" />
          <StatCard label="Fake Articles"  value={fmt(s.fake_articles)}  sub={`${((s.fake_articles/s.total_articles)*100).toFixed(1)}% of corpus`} accent="red"   icon="⚠️" />
          <StatCard label="Real Articles"  value={fmt(s.real_articles)}  sub="Verified news sources" accent="green" icon="✅" />
          <StatCard label="Tweets Analyzed" value={fmt(s.twitter_tweets)} sub="Sentiment140 dataset" accent="yell"  icon="🐦" />
          <StatCard label="Unique Tokens"  value={fmt(s.unique_words)}   sub="After stopword removal" accent="blue"  icon="🔤" />
          <StatCard label="Avg. Article"   value={`${s.avg_article_length} wds`} sub="Mean word count per article" accent="red" icon="📊" />
        </div>

        {/* Fake vs Real + Sentiment */}
        <div className="two-col">
          <ChartCard title="Fake vs. Real Distribution by Topic" subtitle="Proportion of fake vs credible articles per category">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fakeRealData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="topic" tick={{ fill: "#8b8fa8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555872", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  formatter={(v, n) => [`${v}%`, n]}
                  contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }}
                />
                <Bar dataKey="fake" name="Fake" fill="#e63946" radius={[4, 4, 0, 0]} />
                <Bar dataKey="real" name="Real" fill="#06d6a0" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Overall Sentiment Distribution" subtitle="Aggregated across all articles & tweets">
            <div className="pie-wrap">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={sentPie} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                    paddingAngle={3} dataKey="value">
                    {sentPie.map((entry) => (
                      <Cell key={entry.name} fill={sentColors[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v}%`]}
                    contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="sent-breakdown">
                {sentPie.map(s => (
                  <div key={s.name} className="sent-row">
                    <span className="sent-dot" style={{ background: sentColors[s.name] }} />
                    <span className="sent-name">{s.name}</span>
                    <span className="sent-val">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Polarity over time */}
        <ChartCard
          title="Sentiment Polarity Over Time"
          subtitle="Monthly mean polarity scores: Fake News, Real News, and Twitter (−1 = negative, +1 = positive)"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={polarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555872", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={[-1, 0.6]} />
              <Tooltip
                contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, color: "#8b8fa8" }} />
              <Line type="monotone" dataKey="Fake"  stroke="#e63946" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Real"  stroke="#06d6a0" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Tweet" stroke="#4361ee" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Trending hashtags */}
        <SectionHeader tag="Twitter NLP" title="Trending Hashtags" desc="Top 10 hashtags by volume with associated sentiment classification." />
        <div className="hashtag-grid">
          {trending_hashtags.map((h, i) => (
            <div key={h.tag} className="hashtag-card">
              <div className="ht-rank">#{i + 1}</div>
              <div className="ht-tag">{h.tag}</div>
              <div className="ht-count">{fmt(h.count)} tweets</div>
              <span className={`tag ${h.sentiment === "Positive" ? "tag-green" : h.sentiment === "Negative" ? "tag-red" : "tag-blue"}`}>
                {h.sentiment}
              </span>
              <div className="ht-bar-wrap">
                <div
                  className="ht-bar"
                  style={{
                    width: `${Math.round(h.count / trending_hashtags[0].count * 100)}%`,
                    background: h.sentiment === "Positive" ? "var(--real)" : h.sentiment === "Negative" ? "var(--accent)" : "var(--accent2)"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dataset info */}
        <div className="dataset-info">
          <div className="ds-left">
            <span className="tag tag-yell">Data Sources</span>
            <h3>About the Dataset</h3>
            <p>
              This EDA combines three publicly available NLP datasets: the Kaggle Fake News dataset
              (21K real + 23K fake articles), the Sentiment140 Twitter corpus (160K tweets with
              polarity labels), and the LIAR benchmark dataset for fine-grained fake news detection.
              The combined corpus spans <strong>{s.date_range}</strong> with <strong>{fmt(s.unique_words)}</strong> unique tokens after preprocessing.
            </p>
            <div className="ds-sources">
              {s.sources.map(src => (
                <span key={src} className="tag tag-blue">{src}</span>
              ))}
            </div>
          </div>
          <div className="ds-right">
            <div className="ds-metric"><span>Avg. article length</span><strong>{s.avg_article_length} words</strong></div>
            <div className="ds-metric"><span>Date range</span><strong>{s.date_range}</strong></div>
            <div className="ds-metric"><span>Fake article ratio</span><strong>{((s.fake_articles/s.total_articles)*100).toFixed(1)}%</strong></div>
            <div className="ds-metric"><span>Preprocessing</span><strong>Tokenized · Stopwords removed · Lemmatized</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
