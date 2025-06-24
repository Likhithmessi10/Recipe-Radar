const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  ingredients: [String],
  generatedRecipes: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
