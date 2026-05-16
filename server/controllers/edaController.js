const path = require("path");
const data = require(path.join(__dirname, "../data/eda_output.json"));

exports.getAll  = (req, res) => res.json(data);
exports.getStats              = (req, res) => res.json(data.dataset_stats);
exports.getWordFrequency      = (req, res) => res.json(data.word_frequency);
exports.getSentiment          = (req, res) => res.json(data.sentiment);
exports.getTopicTrends        = (req, res) => res.json(data.topic_trends);
exports.getFakeRealRatio      = (req, res) => res.json(data.fake_real_ratio);
exports.getBigrams            = (req, res) => res.json(data.bigrams);
exports.getPolarityOverTime   = (req, res) => res.json(data.polarity_over_time);
exports.getLengthDistribution = (req, res) => res.json(data.length_distribution);
exports.getTrendingHashtags   = (req, res) => res.json(data.trending_hashtags);
