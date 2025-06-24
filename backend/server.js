const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// Define Recipe model
const Recipe = mongoose.model("Recipe", new mongoose.Schema({
  ingredients: [String],
  generatedRecipes: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}));

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Recipe Radar Backend is running!");
});

// Generate recipe route
app.post("/api/generate", async (req, res) => {
  const { ingredients } = req.body;
  console.log("POST /api/generate hit with:", ingredients);

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "No ingredients provided." });
  }

  try {
    const prompt = `Suggest 3 unique and delicious recipes using the following ingredients: ${ingredients.join(", ")}`;

   const geminiRes = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  }
);




    console.log("✅ Gemini API Response:", JSON.stringify(geminiRes.data, null, 2));

    const text = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestions";
    const recipes = text.split(/\n{2,}/).map(r => r.trim()).filter(Boolean);

    const newRecipe = new Recipe({
      ingredients,
      generatedRecipes: recipes
    });

    await newRecipe.save();

    res.json({ recipes });

  } catch (err) {
    console.error("❌ Gemini API Error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Failed to generate recipes.",
      details: err?.response?.data || err.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
