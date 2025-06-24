'use server';

import { suggestRecipes, SuggestRecipesInput, SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';
import { z } from 'zod';

const actionSchema = z
  .object({
    ingredients: z.string().optional(),
    photoDataUri: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
  })
  .refine(data => data.ingredients || data.photoDataUri, {
    message: 'Please list at least one ingredient or upload an image.',
    path: ['ingredients'],
  });

export async function getRecipesAction(
  prevState: any,
  formData: FormData
): Promise<{ recipes: SuggestRecipesOutput['recipes'] | null; error: string | null }> {
  const validatedFields = actionSchema.safeParse({
    ingredients: formData.get('ingredients'),
    photoDataUri: formData.get('photoDataUri'),
    dietaryRestrictions: formData.get('dietaryRestrictions'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const formErrors = validatedFields.error.flatten().formErrors;
    return {
      recipes: null,
      error: fieldErrors.ingredients?.[0] || formErrors[0] || 'Invalid input.',
    };
  }

  try {
    const input: SuggestRecipesInput = validatedFields.data;
    const result = await suggestRecipes(input);
    if (!result.recipes || result.recipes.length === 0) {
      return { recipes: [], error: 'No recipes found. Try different ingredients.' };
    }
    return { recipes: result.recipes, error: null };
  } catch (e) {
    console.error(e);
    return { recipes: null, error: 'An error occurred while suggesting recipes. Please try again.' };
  }
}
