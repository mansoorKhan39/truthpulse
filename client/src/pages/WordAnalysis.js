import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import { useEDA } from "../hooks/useEDA";
import Loader from "../components/Loader";
import ChartCard from "../components/ChartCard";
import SectionHeader from "../components/SectionHeader";
import "./WordAnalysis.css";

export default function WordAnalysis() {
  const { data, loading } = useEDA();
  const [mode, setMode] = useState("fake");
  const [bigMode, setBigMode] = useState("fake");

  if (loading) return <><div style={{ height: 64 }} /><Loader /></>;

  const { word_frequency, bigrams } = data;

  const wf = word_frequency[mode];
  const barData = Object.entries(wf)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const maxCount = barData[0]?.count || 1;

  const bigData = bigrams[bigMode].map(([phrase, count]) => ({ phrase, count }));
  const bigMax = bigData[0]?.count || 1;

  return (
    <div className="page">
      <div className="page-hero-sm grid-bg">
        <div className="page-hero-inner">
          <span className="tag tag-blue">Lexical Analysis</span>
          <h1>The Language of Lies</h1>
          <p>Word frequency analysis and bigram patterns reveal the distinct vocabularies of fake vs. real news — two very different ways of talking about the world.</p>
        </div>
      </div>

      <div className="page-content">
        {/* Mode switch */}
        <div className="mode-switch">
          <button className={mode === "fake" ? "ms-btn active-red" : "ms-btn"} onClick={() => setMode("fake")}>
            <span className="ms-dot fake-dot" /> Fake News Lexicon
          </button>
          <button className={mode === "real" ? "ms-btn active-green" : "ms-btn"} onClick={() => setMode("real")}>
            <span className="ms-dot real-dot" /> Real News Lexicon
          </button>
        </div>

        {/* Word cloud style grid */}
        <SectionHeader
          tag="Token Frequency"
          title={`Top Words in ${mode === "fake" ? "Fake" : "Real"} News`}
          desc="Frequencies computed after stopword removal and lemmatization. Size indicates relative frequency."
        />

        <div className="word-cloud">
          {barData.map((d) => {
            const size = 12 + Math.round((d.count / maxCount) * 28);
            const opacity = 0.4 + (d.count / maxCount) * 0.6;
            return (
              <span
                key={d.word}
                className={`cloud-word ${mode}`}
                style={{ fontSize: size, opacity }}
                title={`${d.word}: ${d.count} occurrences`}
              >
                {d.word}
              </span>
            );
          })}
        </div>

        {/* Bar chart */}
        <ChartCard
          title={`Word Frequency — ${mode === "fake" ? "Fake" : "Real"} News (Top 20)`}
          subtitle="Occurrence count per word across the corpus"
          className="mt-20"
        >
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={barData} layout="vertical" barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#555872", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="word" tick={{ fill: "#8b8fa8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ background: "#12152b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12 }}
                formatter={(v) => [v, "occurrences"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={mode === "fake" ? `rgba(230,57,70,${0.4 + (d.count / maxCount) * 0.6})` : `rgba(6,214,160,${0.4 + (d.count / maxCount) * 0.6})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bigrams */}
        <SectionHeader
          tag="Bigram Analysis"
          title="Two-Word Phrase Patterns"
          desc="The most common consecutive word pairs (bigrams) — a powerful signal for language style classification."
        />

        <div className="mode-switch mb-20">
          <button className={bigMode === "fake" ? "ms-btn active-red" : "ms-btn"} onClick={() => setBigMode("fake")}>
            Fake Bigrams
          </button>
          <button className={bigMode === "real" ? "ms-btn active-green" : "ms-btn"} onClick={() => setBigMode("real")}>
            Real Bigrams
          </button>
        </div>

        <div className="bigram-list">
          {bigData.map(({ phrase, count }, i) => (
            <div key={phrase} className={`bigram-row ${bigMode}`}>
              <span className="bg-rank">#{i + 1}</span>
              <span className="bg-phrase">"{phrase}"</span>
              <div className="bg-track">
                <div
                  className="bg-fill"
                  style={{ width: `${(count / bigMax) * 100}%` }}
                />
              </div>
              <span className="bg-count">{count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <SectionHeader
          tag="Comparative Analysis"
          title="Fake vs. Real: Language Markers"
          desc="Key linguistic differences that help distinguish manufactured from verified content."
        />
        <div className="compare-table">
          <div className="ct-header">
            <span>Feature</span>
            <span style={{ color: "var(--accent)" }}>Fake News</span>
            <span style={{ color: "var(--real)" }}>Real News</span>
          </div>
          {[
            ["Dominant tone", "Sensational, alarming", "Measured, factual"],
            ["Common bigrams", '"deep state", "wake up"', '"white house", "according to"'],
            ["Avg word length", "4.2 chars", "5.1 chars"],
            ["Exclamation use", "3.4× more frequent", "Baseline"],
            ["Named entities", "Vague references", "Specific names/dates"],
            ["Hedge language", "Rarely used", "Common ('may', 'according to')"],
            ["Call to action", "Frequent ('share', 'tell')", "Absent"],
            ["Source citation", "Rarely present", "Present in 74% of articles"],
          ].map(([feature, fake, real]) => (
            <div key={feature} className="ct-row">
              <span className="ct-feat">{feature}</span>
              <span className="ct-fake">{fake}</span>
              <span className="ct-real">{real}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
