"use client";

import { useState } from "react";
import axios from "axios";

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        ingredients: ingredients.split(",").map((i) => i.trim()),
      });

      setRecipes(res.data.recipes);
    } catch (err: any) {
      alert("Failed to fetch recipes.");
      console.error(err.response?.data || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🍳 Recipe Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients like: paneer, onion, tomato"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Recipes"}
        </button>
      </form>

      {recipes.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Suggested Recipes:</h2>
          {recipes.map((r, idx) => (
            <div key={idx} className="bg-gray-100 p-2 rounded">
              <pre>{r}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
