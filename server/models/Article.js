/**
 * Article Model — MongoDB schema for ingested news articles
 * Uses Mongoose. Swap the JSON data layer for this in production.
 *
 * Usage:
 *   const Article = require('./models/Article');
 *   const fakes = await Article.find({ label: 'FAKE' }).limit(100);
 */

const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    body:       { type: String, default: "" },
    label:      { type: String, enum: ["FAKE", "REAL"], required: true, index: true },
    topic:      { type: String, enum: ["Politics","Health","Economy","Climate",
                                       "Technology","Entertainment","Crime","Sports"],
                  index: true },
    source:     { type: String, default: "unknown" },
    wordCount:  { type: Number, default: 0 },
    sentiment:  {
      compound: { type: Number, default: 0 },
      positive: { type: Number, default: 0 },
      neutral:  { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
      label:    { type: String, enum: ["Positive","Negative","Neutral"], default: "Neutral" },
    },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Text index for full-text search
articleSchema.index({ title: "text", body: "text" });

// Virtual: polarity bucket
articleSchema.virtual("polarityBucket").get(function () {
  const c = this.sentiment.compound;
  if (c >= 0.05)  return "Positive";
  if (c <= -0.05) return "Negative";
  return "Neutral";
});

// Static: class balance
articleSchema.statics.classBalance = async function () {
  return this.aggregate([
    { $group: { _id: "$label", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};

// Static: top words (would run after text processing)
articleSchema.statics.sentimentByTopic = async function () {
  return this.aggregate([
    { $group: {
        _id: "$topic",
        avgCompound: { $avg: "$sentiment.compound" },
        count: { $sum: 1 },
    }},
    { $sort: { _id: 1 } },
  ]);
};

module.exports = mongoose.models.Article || mongoose.model("Article", articleSchema);
