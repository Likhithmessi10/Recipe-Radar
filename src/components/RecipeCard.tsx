'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Heart, Clock, Flame, Users } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Recipe } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>('saved-recipes', []);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Handle cases where recipe or recipe.name is undefined
    if (recipe?.name) {
      setIsSaved(savedRecipes.some((r) => r.name === recipe.name));
    }
  }, [savedRecipes, recipe]);

  const handleSaveToggle = () => {
    if (isSaved) {
      setSavedRecipes(savedRecipes.filter((r) => r.name !== recipe.name));
      toast({ description: "Recipe removed from your collection." });
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
      toast({ description: "Recipe saved to your collection!" });
    }
  };

  if (!recipe) {
    return null;
  }

  return (
    <Card className="flex flex-col h-full shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="font-headline text-xl">{recipe.name}</CardTitle>
            <CardDescription className="pt-1 text-sm">{recipe.description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSaveToggle} aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}>
            <Heart className={cn('h-6 w-6 transition-colors', isSaved ? 'text-accent fill-accent' : 'text-muted-foreground')} />
          </Button>
        </div>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4" />
                <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{recipe.servings}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <Accordion type="single" collapsible className="w-full" defaultValue="ingredients">
          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredients</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger>Instructions</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
          {recipe.nutritionalInformation && (recipe.nutritionalInformation.calories || recipe.nutritionalInformation.protein || recipe.nutritionalInformation.carbs || recipe.nutritionalInformation.fat) && (
            <AccordionItem value="nutrition">
              <AccordionTrigger>Nutritional Information (per serving)</AccordionTrigger>
              <AccordionContent className="text-sm space-y-1">
                {recipe.nutritionalInformation.calories && <p><strong>Calories:</strong> {recipe.nutritionalInformation.calories}</p>}
                {recipe.nutritionalInformation.protein && <p><strong>Protein:</strong> {recipe.nutritionalInformation.protein}g</p>}
                {recipe.nutritionalInformation.carbs && <p><strong>Carbs:</strong> {recipe.nutritionalInformation.carbs}g</p>}
                {recipe.nutritionalInformation.fat && <p><strong>Fat:</strong> {recipe.nutritionalInformation.fat}g</p>}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
