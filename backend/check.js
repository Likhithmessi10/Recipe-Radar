const axios = require("axios");
require("dotenv").config();

async function listModels() {
  try {
    const res = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    console.log("✅ Models Available to Your API Key:");
    res.data.models.forEach(model => {
      console.log(`- ${model.name}`);
    });
  } catch (err) {
    console.error("❌ Error fetching models:", err.response?.data || err.message);
  }
}

listModels();
