const express = require("express");
const router = express.Router();
const { chatBot, semanticSearch } = require("../controllers/aiController");

router.post("/chat", chatBot);
router.get("/search", semanticSearch);

module.exports = router;
