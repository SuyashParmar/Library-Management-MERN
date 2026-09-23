require("dotenv").config();
const Groq = require("groq-sdk");
try {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log("Groq initialized");
} catch(e) {
  console.error("Init error:", e.message);
}
