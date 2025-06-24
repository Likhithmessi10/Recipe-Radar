'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getRecipesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';
import { ChefHat } from 'lucide-react';

interface IngredientFormProps {
  setRecipes: (recipes: SuggestRecipesOutput['recipes']) => void;
  setLoading: (loading: boolean) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? 'Finding Recipes...' : 'Find Recipes'}
    </Button>
  );
}

export function IngredientForm({ setRecipes, setLoading }: IngredientFormProps) {
  const initialState = { recipes: null, error: null };
  const [state, formAction] = useFormState(getRecipesAction, initialState);
  const { toast } = useToast();
  const { pending } = useFormStatus();

  useEffect(() => {
    setLoading(pending);
  }, [pending, setLoading]);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: state.error,
      });
    }
    if (state.recipes) {
      setRecipes(state.recipes);
       if (state.recipes.length > 0) {
        toast({
          title: 'Success!',
          description: `We found ${state.recipes.length} new recipes for you.`,
        });
      }
    }
  }, [state, toast, setRecipes]);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-primary"/>
            <CardTitle className="font-headline text-2xl">Find Your Next Meal</CardTitle>
        </div>
        <CardDescription>Enter the ingredients you have, and we'll suggest some recipes.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              placeholder="e.g., chicken breast, broccoli, garlic, olive oil"
              required
              rows={5}
            />
             <p className="text-xs text-muted-foreground">Separate ingredients with commas.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions (Optional)</Label>
            <Input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder="e.g., vegetarian, gluten-free"
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
