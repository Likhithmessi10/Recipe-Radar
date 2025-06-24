export type Recipe = {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  instructions: string[];
  nutritionalInformation?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
};
