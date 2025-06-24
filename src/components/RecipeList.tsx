import type { Recipe } from '@/lib/types';
import { RecipeCard } from './RecipeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Salad } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[] | null;
  loading: boolean;
}

function RecipeSkeleton() {
    return (
        <div className="space-y-4 rounded-lg border p-6">
            <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    )
}

export function RecipeList({ recipes, loading }: RecipeListProps) {
  if (loading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <RecipeSkeleton />
                <RecipeSkeleton />
            </div>
        </div>
    );
  }

  if (!recipes) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px]">
            <Salad className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Find your perfect dish</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">Enter some ingredients you have on hand, and our AI chef will whip up some recipe ideas for you.</p>
        </div>
    );
  }

  if (recipes.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px]">
            <Salad className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">No recipes found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">We couldn't find any recipes with those ingredients. Try a different combination!</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline">Suggested Recipes</h2>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
