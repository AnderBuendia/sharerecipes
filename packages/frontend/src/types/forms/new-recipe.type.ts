import { NestedValue } from 'react-hook-form';

export type FormValuesNewRecipe = {
  name: string;
  prepTime: string;
  serves: string;
  difficulty: string;
  ingredients: NestedValue<string[]>;
  description: string;
  style: string;
  otherStyle?: string;
};
