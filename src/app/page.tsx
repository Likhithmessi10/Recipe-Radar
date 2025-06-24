'use client';

import { useState } from 'react';
import { AdBanner } from '@/components/AdBanner';
import { Header } from '@/components/Header';
import { IngredientForm } from '@/components/IngredientForm';
import { RecipeList } from '@/components/RecipeList';
import { RelatedArticles } from '@/components/RelatedArticles';
import type { Recipe } from '@/lib/types';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSetRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <IngredientForm setRecipes={handleSetRecipes} setLoading={setLoading} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <RecipeList recipes={recipes} loading={loading} />
          </div>
        </div>
        <div className="mt-16 pt-8 border-t grid md:grid-cols-2 gap-8">
          <RelatedArticles />
          <AdBanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}
