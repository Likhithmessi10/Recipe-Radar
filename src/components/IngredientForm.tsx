"use client";

import { useState } from "react";
import axios from "axios";

interface Props {
  setRecipes: (recipes: string[]) => void;
  setLoading: (loading: boolean) => void;
}

export const IngredientForm = ({ setRecipes, setLoading }: Props) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = input.split(",").map((i) => i.trim()).filter(Boolean);
    if (ingredients.length === 0) return alert("Enter at least one ingredient");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        ingredients,
      });

      setRecipes(res.data.recipes || []);
    } catch (err: any) {
      console.error("Error:", err?.response?.data || err.message);
      alert("Failed to fetch recipes from server.");
      setRecipes([]);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block font-medium">Enter Ingredients (comma-separated):</label>
      <input
        type="text"
        className="w-full border px-4 py-2 rounded"
        placeholder="e.g., paneer, onion, tomato"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Generate Recipes
      </button>
    </form>
  );
};
