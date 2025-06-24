// This file holds the Genkit flow for suggesting recipes based on user-provided ingredients.

'use server';

/**
 * @fileOverview Recipe suggestion AI agent.
 *
 * - suggestRecipes - A function that suggests recipes based on the input ingredients.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z
  .object({
    ingredients: z
      .string()
      .optional()
      .describe('A comma-separated list of ingredients the user has on hand.'),
    photoDataUri: z
      .string()
      .optional()
      .describe(
        "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
      ),
    dietaryRestrictions: z
      .string()
      .optional()
      .describe('Any dietary restrictions or preferences the user has.'),
  })
  .refine(data => data.ingredients || data.photoDataUri, {
    message: 'Please provide either a list of ingredients or an image.',
  });
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.string().describe('A list of ingredients required for the recipe.'),
      instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
      nutritionalInformation: z
        .string()
        .optional()
        .describe('Nutritional information for the recipe, if available.'),
    })
  ).describe('An array of suggested recipes based on the provided ingredients.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are a recipe suggestion AI. Given a list of ingredients, a photo of ingredients, or both, and optional dietary restrictions, suggest recipes that the user can make.

{{#if ingredients}}
Ingredients list provided: {{{ingredients}}}
{{/if}}
{{#if photoDataUri}}
Photo of ingredients provided: {{media url=photoDataUri}}
Identify the ingredients in the photo.
{{/if}}

Dietary Restrictions: {{{dietaryRestrictions}}}

Suggest recipes that utilize the ingredients from the list and/or the photo, and adhere to the specified dietary restrictions. If both an image and text are provided, use ingredients from both sources.

Format the output as a JSON array of recipes, including the recipe name, ingredients, instructions, and nutritional information (if available).`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
