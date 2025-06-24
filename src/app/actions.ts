'use server';

import { suggestRecipes, SuggestRecipesInput, SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';
import { z } from 'zod';

const actionSchema = z.object({
  ingredients: z.string().min(3, { message: 'Please list at least one ingredient.' }),
  dietaryRestrictions: z.string().optional(),
});

export async function getRecipesAction(
  prevState: any,
  formData: FormData
): Promise<{ recipes: SuggestRecipesOutput['recipes'] | null; error: string | null }> {
  const validatedFields = actionSchema.safeParse({
    ingredients: formData.get('ingredients'),
    dietaryRestrictions: formData.get('dietaryRestrictions'),
  });

  if (!validatedFields.success) {
    return {
      recipes: null,
      error: validatedFields.error.flatten().fieldErrors.ingredients?.[0] || 'Invalid input.',
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
