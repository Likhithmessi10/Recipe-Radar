'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Recipe } from '@/lib/types';
import { RecipeCard } from './RecipeCard';
import { Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SavedRecipesList() {
  const [savedRecipes] = useLocalStorage<Recipe[]>('saved-recipes', []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <div className="space-y-4 rounded-lg border p-6 h-64 animate-pulse bg-muted/50"></div>
         <div className="space-y-4 rounded-lg border p-6 h-64 animate-pulse bg-muted/50"></div>
         <div className="space-y-4 rounded-lg border p-6 h-64 animate-pulse bg-muted/50"></div>
       </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px]">
        <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground">No saved recipes yet.</h3>
        <p className="text-muted-foreground mt-2">Start discovering and saving recipes you love!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {savedRecipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
}
