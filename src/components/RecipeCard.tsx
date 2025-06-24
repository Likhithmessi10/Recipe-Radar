'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Heart, ChefHat } from 'lucide-react';
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
    setIsSaved(savedRecipes.some((r) => r.name === recipe.name));
  }, [savedRecipes, recipe.name]);

  const handleSaveToggle = () => {
    if (isSaved) {
      setSavedRecipes(savedRecipes.filter((r) => r.name !== recipe.name));
      toast({ description: "Recipe removed from your collection." });
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
      toast({ description: "Recipe saved to your collection!" });
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="font-headline text-xl">{recipe.name}</CardTitle>
            {recipe.nutritionalInformation && (
              <CardDescription className="pt-1 text-xs">{recipe.nutritionalInformation}</CardDescription>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={handleSaveToggle} aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}>
            <Heart className={cn('h-6 w-6 transition-colors', isSaved ? 'text-accent fill-accent' : 'text-muted-foreground')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredients</AccordionTrigger>
            <AccordionContent className="text-sm whitespace-pre-line">
              {recipe.ingredients}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger>Instructions</AccordionTrigger>
            <AccordionContent className="text-sm whitespace-pre-line">
              {recipe.instructions}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
