const express = require("express");
const router = express.Router();
const edaController = require("../controllers/edaController");

router.get("/stats",         edaController.getStats);
router.get("/word-frequency",edaController.getWordFrequency);
router.get("/sentiment",     edaController.getSentiment);
router.get("/topic-trends",  edaController.getTopicTrends);
router.get("/fake-real",     edaController.getFakeRealRatio);
router.get("/bigrams",       edaController.getBigrams);
router.get("/polarity",      edaController.getPolarityOverTime);
router.get("/length-dist",   edaController.getLengthDistribution);
router.get("/hashtags",      edaController.getTrendingHashtags);
router.get("/all",           edaController.getAll);

module.exports = router;
