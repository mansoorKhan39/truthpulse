"""
TruthPulse: Fake News & Twitter Sentiment EDA
Generates analysis data exported as JSON for the MERN frontend
Author: EDA NLP Project
"""

import json
import random
import math
from collections import Counter

random.seed(42)

# ─── Simulated Dataset (mirrors real Kaggle Fake News + Sentiment140 structure) ───

REAL_WORDS = [
    "government", "official", "report", "study", "research", "data",
    "confirmed", "statement", "according", "analysis", "evidence",
    "scientists", "experts", "university", "health", "economy", "policy",
    "election", "climate", "vaccine", "president", "congress", "budget",
    "inflation", "jobs", "rights", "law", "court", "vote", "medical"
]

FAKE_WORDS = [
    "shocking", "exposed", "secret", "hidden", "truth", "conspiracy",
    "banned", "censored", "deep state", "mainstream media", "hoax",
    "fake", "agenda", "globalist", "cover-up", "explosive", "breaking",
    "leaked", "bombshell", "unbelievable", "miracle", "they", "won't",
    "tell", "you", "woke", "rigged", "stolen", "radical", "elites"
]

TOPICS = ["Politics", "Health", "Economy", "Climate", "Technology", "Entertainment", "Crime", "Sports"]
SENTIMENTS = ["Positive", "Negative", "Neutral"]

# Word frequency generation
def generate_word_freq(words_pool, n=40, base_min=50, base_max=600):
    counts = {}
    for w in words_pool[:n]:
        counts[w] = random.randint(base_min, base_max)
    return dict(sorted(counts.items(), key=lambda x: -x[1])[:25])

real_word_freq = generate_word_freq(REAL_WORDS * 2, n=len(REAL_WORDS))
fake_word_freq = generate_word_freq(FAKE_WORDS * 2, n=len(FAKE_WORDS))

# Sentiment distribution per category
def sentiment_dist(pos_bias=0.0):
    base = [33, 34, 33]
    pos  = min(80, max(5, base[0] + int(pos_bias * 40)))
    neg  = min(80, max(5, base[1] - int(pos_bias * 20)))
    neu  = 100 - pos - neg
    return {"Positive": pos, "Negative": neg, "Neutral": neu}

sentiment_by_topic = {
    "Politics":      sentiment_dist(-0.3),
    "Health":        sentiment_dist(0.1),
    "Economy":       sentiment_dist(-0.2),
    "Climate":       sentiment_dist(-0.1),
    "Technology":    sentiment_dist(0.4),
    "Entertainment": sentiment_dist(0.5),
    "Crime":         sentiment_dist(-0.5),
    "Sports":        sentiment_dist(0.3),
}

# Overall sentiment
overall_sentiment = {"Positive": 0, "Negative": 0, "Neutral": 0}
for v in sentiment_by_topic.values():
    for k in overall_sentiment:
        overall_sentiment[k] += v[k]
total = sum(overall_sentiment.values())
overall_sentiment_pct = {k: round(v/total*100, 1) for k,v in overall_sentiment.items()}

# Topic trend (article volume over 12 months)
months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
topic_trends = {}
for topic in TOPICS:
    base = random.randint(120, 400)
    trend = [max(20, base + random.randint(-60, 80) + (i * random.randint(-5, 10))) for i in range(12)]
    topic_trends[topic] = {"months": months, "counts": trend}

# Fake vs Real distribution
fake_real_ratio = {
    "Politics":      {"real": 38, "fake": 62},
    "Health":        {"real": 55, "fake": 45},
    "Economy":       {"real": 61, "fake": 39},
    "Climate":       {"real": 49, "fake": 51},
    "Technology":    {"real": 70, "fake": 30},
    "Entertainment": {"real": 65, "fake": 35},
    "Crime":         {"real": 44, "fake": 56},
    "Sports":        {"real": 78, "fake": 22},
}

# Dataset stats
dataset_stats = {
    "total_articles": 44898,
    "fake_articles": 23481,
    "real_articles": 21417,
    "twitter_tweets": 160000,
    "unique_words": 87342,
    "avg_article_length": 412,
    "date_range": "2015–2018",
    "sources": ["Kaggle Fake News Dataset", "Sentiment140", "LIAR Dataset"]
}

# Bigrams (common two-word phrases)
real_bigrams = [
    ["white house", 312], ["according to", 289], ["health care", 241],
    ["climate change", 198], ["stock market", 175], ["supreme court", 163],
    ["new york", 154], ["interest rates", 142], ["federal reserve", 138],
    ["social media", 127]
]
fake_bigrams = [
    ["deep state", 401], ["mainstream media", 356], ["fake news", 298],
    ["cover up", 267], ["breaking news", 245], ["secret agenda", 211],
    ["they don't", 198], ["wake up", 187], ["hidden truth", 164],
    ["share before", 152]
]

# Sentiment polarity scores over time
polarity_over_time = {
    "months": months,
    "fake_polarity":  [round(random.uniform(-0.6, -0.1), 3) for _ in months],
    "real_polarity":  [round(random.uniform(-0.2,  0.4), 3) for _ in months],
    "tweet_polarity": [round(random.uniform(-0.3,  0.3), 3) for _ in months],
}

# Article length distribution buckets
length_buckets = {
    "0-100":    {"fake": 2841, "real": 1203},
    "101-300":  {"fake": 5612, "real": 3891},
    "301-600":  {"fake": 8234, "real": 7102},
    "601-1000": {"fake": 4921, "real": 6344},
    "1000+":    {"fake": 1873, "real": 2877},
}

# Top trending hashtags (Twitter)
trending_hashtags = [
    {"tag": "#FakeNews",     "count": 48201, "sentiment": "Negative"},
    {"tag": "#Breaking",     "count": 39105, "sentiment": "Neutral"},
    {"tag": "#ClimateChange","count": 31987, "sentiment": "Negative"},
    {"tag": "#Election2016", "count": 28432, "sentiment": "Negative"},
    {"tag": "#COVID",        "count": 25109, "sentiment": "Negative"},
    {"tag": "#Technology",   "count": 19875, "sentiment": "Positive"},
    {"tag": "#MAGA",         "count": 18203, "sentiment": "Negative"},
    {"tag": "#Science",      "count": 15690, "sentiment": "Positive"},
    {"tag": "#Economy",      "count": 14201, "sentiment": "Neutral"},
    {"tag": "#Health",       "count": 12987, "sentiment": "Positive"},
]

# Compile full JSON output
output = {
    "dataset_stats": dataset_stats,
    "word_frequency": {
        "real": real_word_freq,
        "fake": fake_word_freq
    },
    "sentiment": {
        "overall": overall_sentiment_pct,
        "by_topic": sentiment_by_topic
    },
    "topic_trends": topic_trends,
    "fake_real_ratio": fake_real_ratio,
    "bigrams": {
        "real": real_bigrams,
        "fake": fake_bigrams
    },
    "polarity_over_time": polarity_over_time,
    "length_distribution": length_buckets,
    "trending_hashtags": trending_hashtags
}

with open("eda_output.json", "w") as f:
    json.dump(output, f, indent=2)

print("✓ EDA data generated → eda_output.json")
print(f"  Total articles: {dataset_stats['total_articles']:,}")
print(f"  Fake: {dataset_stats['fake_articles']:,} | Real: {dataset_stats['real_articles']:,}")
print(f"  Tweets: {dataset_stats['twitter_tweets']:,}")
