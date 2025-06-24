'use client';

import { useFormStatus } from 'react-dom';
import { getRecipesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useActionState, useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';
import { ChefHat, Camera, X } from 'lucide-react';
import Image from 'next/image';

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
  const [state, formAction] = useActionState(getRecipesAction, initialState);
  const { toast } = useToast();
  const { pending } = useFormStatus();
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);


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
        // Reset form state on success
        formRef.current?.reset();
        setPhotoDataUri(null);
      }
    }
  }, [state, toast, setRecipes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePhoto = () => {
    setPhotoDataUri(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-primary"/>
            <CardTitle className="font-headline text-2xl">Find Your Next Meal</CardTitle>
        </div>
        <CardDescription>Enter the ingredients you have, or upload a photo, and we'll suggest some recipes.</CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              placeholder="e.g., chicken breast, broccoli, garlic, olive oil"
              rows={5}
            />
             <p className="text-xs text-muted-foreground">Separate ingredients with commas.</p>
          </div>
          
          <div className="relative flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex-grow border-t"></div>
            <span className="flex-shrink mx-4 font-semibold">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Upload Photo of Ingredients</Label>
            <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-muted-foreground"/>
                <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="file:text-primary file:font-semibold"
                />
            </div>
          </div>

          {photoDataUri && (
            <div className="mt-4 relative w-full aspect-video">
                <Image src={photoDataUri} alt="Ingredients preview" fill className="rounded-md object-cover" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 z-10" onClick={handleRemovePhoto}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
          )}
          <input type="hidden" name="photoDataUri" value={photoDataUri || ''} />


          <div className="space-y-2 pt-4">
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
