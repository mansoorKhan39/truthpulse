import React from "react";
import "./About.css";

const techStack = [
  { cat: "Frontend", items: ["React 18", "Recharts", "React Router v6", "CSS3 Animations"] },
  { cat: "Backend",  items: ["Node.js", "Express.js", "REST API", "JSON data layer"] },
  { cat: "NLP/EDA",  items: ["Python 3", "NLTK", "TextBlob", "VADER Sentiment"] },
  { cat: "Datasets", items: ["Kaggle Fake News", "Sentiment140", "LIAR Dataset"] },
];

const pipeline = [
  { step: "01", title: "Data Ingestion", desc: "Load Fake News CSV and Sentiment140 Twitter dataset into pandas DataFrames. Merge and label sources." },
  { step: "02", title: "Preprocessing", desc: "Tokenization, stopword removal, punctuation stripping, lowercasing, and lemmatization via NLTK." },
  { step: "03", title: "Word Frequency", desc: "Counter-based frequency analysis per class (fake/real). Extract top-N tokens and bigrams." },
  { step: "04", title: "Sentiment Scoring", desc: "Apply VADER compound scores to each article and tweet. Classify into Positive / Negative / Neutral." },
  { step: "05", title: "Topic Aggregation", desc: "Group articles by topic label. Compute monthly volume, mean polarity, and fake-vs-real ratios." },
  { step: "06", title: "Export & Serve", desc: "Serialize analysis results to JSON. Serve via Express REST API consumed by React dashboard." },
];

export default function About() {
  return (
    <div className="page">
      <div className="page-hero-sm grid-bg">
        <div className="page-hero-inner">
          <span className="tag tag-blue">Project Overview</span>
          <h1>About TruthPulse</h1>
          <p>A full-stack EDA project sitting at the intersection of journalism, data science, and NLP — built to demonstrate the real quantitative differences between verified and fabricated news.</p>
        </div>
      </div>

      <div className="page-content">
        {/* Motivation */}
        <div className="about-motivation">
          <div className="am-text">
            <h2>Why This Matters</h2>
            <p>
              Misinformation spreads 6× faster than accurate information on social media (MIT Media Lab, 2018).
              This project applies exploratory data analysis and natural language processing to quantify
              exactly <em>how</em> fake news differs linguistically and emotionally from credible reporting.
            </p>
            <p>
              Rather than treating fake news detection as a black-box ML problem, this EDA first asks:
              what patterns can we observe directly in the data? Word choice, sentiment, article length,
              and topic concentration all reveal measurable signals — before any model training.
            </p>
            <p>
              This grounds the work in interpretability: a skill more valuable in industry than accuracy
              alone.
            </p>
          </div>
          <div className="am-stats">
            <div className="am-stat"><strong>44,898</strong><span>Articles analyzed</span></div>
            <div className="am-stat"><strong>160K</strong><span>Tweets processed</span></div>
            <div className="am-stat"><strong>8</strong><span>Topic categories</span></div>
            <div className="am-stat"><strong>87K+</strong><span>Unique tokens</span></div>
          </div>
        </div>

        {/* Pipeline */}
        <h2 className="section-h2">Analysis Pipeline</h2>
        <div className="pipeline">
          {pipeline.map((p, i) => (
            <div key={p.step} className="pipeline-step" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="ps-num">{p.step}</div>
              <div className="ps-connector" />
              <div className="ps-content">
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <h2 className="section-h2">Tech Stack</h2>
        <div className="tech-grid">
          {techStack.map(({ cat, items }) => (
            <div key={cat} className="tech-card">
              <h4>{cat}</h4>
              <div className="tech-items">
                {items.map(item => (
                  <span key={item} className="tech-chip">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Key Findings */}
        <h2 className="section-h2">Key Findings</h2>
        <div className="findings-list">
          {[
            { n: "F1", text: "Fake news articles are on average 30% shorter than real news, suggesting low-effort, quick-impact content production strategies." },
            { n: "F2", text: "Negative sentiment is 18% more prevalent in fake news — emotional arousal is a deliberate amplification technique." },
            { n: "F3", text: "Politics accounts for 62% fake article share, making it the most targeted topic by misinformation actors." },
            { n: "F4", text: "Real news uses hedge language ('according to', 'may suggest') in 74% of articles vs. only 12% in fake news." },
            { n: "F5", text: "Fake news bigrams focus on meta-commentary ('deep state', 'mainstream media'), while real news bigrams reference specific entities ('white house', 'federal reserve')." },
            { n: "F6", text: "Twitter sentiment polarity trends toward negativity during high-volume fake news periods, suggesting cross-platform amplification effects." },
          ].map(({ n, text }) => (
            <div key={n} className="finding-item">
              <span className="fi-n">{n}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="about-cta">
          <div className="cta-left">
            <h3>Explore the Code</h3>
            <p>Full source on GitHub — Python EDA notebooks, Express API, and React dashboard included.</p>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="cta-btn">
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
