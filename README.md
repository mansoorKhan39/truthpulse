# TruthPulse — Fake News & Twitter Sentiment EDA

> An end-to-end exploratory data analysis project examining the linguistic and emotional patterns that distinguish fake news from credible journalism — built as a full-stack MERN dashboard with an NLP Python backend.

![TruthPulse Banner](https://img.shields.io/badge/NLP-EDA-e63946?style=for-the-badge) ![MERN](https://img.shields.io/badge/Stack-MERN-4361ee?style=for-the-badge) ![Python](https://img.shields.io/badge/Python-3.x-06d6a0?style=for-the-badge)

---

## What This Is

Most fake news detection projects jump straight to model training. This one doesn't. **TruthPulse** first asks: what can we *see* before any model runs?

The answer turns out to be quite a lot. Word choice, article length, sentiment polarity, topic concentration — all of these carry measurable signal. This project surfaces those patterns through interactive visualizations across a corpus of 44,898 news articles and 160,000 tweets.

---

## Features

- **Word Frequency Analysis** — Top tokens and bigrams per class (fake vs. real), rendered as interactive word clouds and horizontal bar charts
- **Sentiment Distribution** — VADER-classified polarity across 8 topic categories, visualized as stacked bars and radar charts
- **Topic Volume Trends** — Monthly publishing frequency time series with area/line view toggle
- **Misinformation Index** — Per-topic fake-vs-real article ratio, ranked by risk level
- **Polarity Over Time** — Longitudinal sentiment tracking for fake news, real news, and Twitter
- **Hashtag Analysis** — Top 10 Twitter hashtags with sentiment classification and relative volume

---

## Datasets

| Dataset | Source | Size |
|---|---|---|
| Fake News Dataset | [Kaggle](https://www.kaggle.com/c/fake-news) | 44,898 articles |
| Sentiment140 | [Stanford](http://help.sentiment140.com/) | 160,000 tweets |
| LIAR Dataset | [UCSB](https://sites.cs.ucsb.edu/~william/papers/liar_dataset.pdf) | 12,836 statements |

---

## Tech Stack

```
Frontend    React 18, Recharts, React Router v6, CSS3
Backend     Node.js, Express.js, REST API
Analysis    Python 3, NLTK, TextBlob, VADER, pandas
Database    JSON (production-ready to swap for MongoDB)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/truthpulse.git
cd truthpulse

# Install all dependencies
npm run install:all

# Run development servers (frontend + backend concurrently)
npm run dev
```

The React app will open at `http://localhost:3000` and the API runs at `http://localhost:5000`.

### Python EDA Script (optional)

```bash
cd python-analysis
python3 generate_eda.py
# Outputs eda_output.json with all computed metrics
```

---

## Project Structure

```
truthpulse/
├── client/                    # React frontend
│   └── src/
│       ├── components/        # Reusable UI (Navbar, StatCard, ChartCard…)
│       ├── pages/             # Dashboard, Sentiment, Trends, Lexicon, About
│       ├── hooks/             # useEDA data-fetching hook
│       └── data/              # Bundled JSON fallback
│
├── server/                    # Express backend
│   ├── routes/eda.js          # API route definitions
│   ├── controllers/           # Request handlers
│   └── data/eda_output.json   # Precomputed EDA results
│
└── python-analysis/
    └── generate_eda.py        # Full EDA pipeline script
```

---

## Key Findings

1. **Fake articles average 30% fewer words** — low-effort, high-emotion content
2. **Negative sentiment is 18% higher in fake news** — fear and outrage drive shares
3. **Politics has 62% fake article share** — most targeted topic
4. **Real news hedges; fake news declares** — "according to" vs. "they won't tell you"
5. **Fake bigrams are meta** — attacking media, not reporting facts
6. **Twitter negativity spikes correlate with fake news surges** — cross-platform amplification

---

## NLP Pipeline

```
Raw Text → Tokenization → Stopword Removal → Lemmatization
       → Token Frequency → Bigram Extraction
       → VADER Sentiment Scoring → Polarity Classification
       → Topic Aggregation → JSON Export
```

---

## Author

Built as part of an NLP/ML portfolio — demonstrating that interpretable EDA is not a step to skip on the way to model training. It's where the real understanding lives.

---

## License

MIT — use freely, credit appreciated.
