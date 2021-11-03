import { NestedValue } from 'react-hook-form';

export type FormValuesNewRecipe = {
  name: string;
  prep_time: number;
  serves: number;
  difficulty: string;
  ingredients: NestedValue<string[]>;
  style: string;
  other_style: string;
  description: string;
};
