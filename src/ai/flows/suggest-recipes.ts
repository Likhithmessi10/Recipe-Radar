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
  recipes: z
    .array(
      z.object({
        name: z.string().describe('The name of the recipe.'),
        description: z
          .string()
          .describe('A short, enticing description of the recipe.'),
        prepTime: z
          .string()
          .describe("Estimated preparation time (e.g., '15 minutes')."),
        cookTime: z
          .string()
          .describe("Estimated cooking time (e.g., '30 minutes')."),
        servings: z.string().describe('Number of servings the recipe makes.'),
        ingredients: z
          .array(
            z.object({
              name: z.string().describe('Name of the ingredient.'),
              quantity: z
                .string()
                .describe("Quantity of the ingredient (e.g., '2', '1/2')."),
              unit: z
                .string()
                .describe("Unit of measurement (e.g., 'cups', 'tbsp', 'cloves')."),
            })
          )
          .describe('A detailed list of ingredients required for the recipe.'),
        instructions: z
          .array(z.string())
          .describe(
            'A list of step-by-step instructions for preparing the recipe.'
          ),
        nutritionalInformation: z
          .object({
            calories: z.string().optional().describe('Calories per serving.'),
            protein: z
              .string()
              .optional()
              .describe('Protein per serving (in grams).'),
            carbs: z
              .string()
              .optional()
              .describe('Carbohydrates per serving (in grams).'),
            fat: z.string().optional().describe('Fat per serving (in grams).'),
          })
          .optional()
          .describe(
            'Detailed nutritional information for the recipe, if available.'
          ),
      })
    )
    .describe(
      'An array of suggested recipes based on the provided ingredients.'
    ),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are an expert chef and recipe suggestion AI. Given a list of ingredients, a photo of ingredients, or both, and optional dietary restrictions, you will suggest highly detailed and appealing recipes that the user can make.

{{#if ingredients}}
Ingredients list provided: {{{ingredients}}}
{{/if}}
{{#if photoDataUri}}
Photo of ingredients provided: {{media url=photoDataUri}}
Identify the ingredients in the photo.
{{/if}}

Dietary Restrictions: {{{dietaryRestrictions}}}

For each recipe, provide the following details:
- A short, enticing description of the dish.
- Estimated preparation time, cooking time, and the number of servings.
- A detailed list of ingredients with precise quantities and units (e.g., 1 cup, 2 tbsp, 3 cloves).
- Clear, step-by-step instructions. Break down the process into easy-to-follow steps.
- A detailed nutritional information breakdown per serving (calories, protein, carbs, fat), if you can calculate it.

Suggest recipes that utilize the ingredients from the list and/or the photo, and adhere to the specified dietary restrictions. If both an image and text are provided, use ingredients from both sources.

Format the output strictly according to the provided JSON schema.`,
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
