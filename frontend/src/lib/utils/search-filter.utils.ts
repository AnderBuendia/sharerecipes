import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { UserProfile } from '@Interfaces/domain/user.interface';

export const searchFilterRecipes = (recipes: IRecipe[], search: string) => {
  return recipes.filter(
    (recipe: IRecipe) =>
      recipe.name.toLowerCase().includes(search) ||
      recipe.description.toLowerCase().includes(search) ||
      recipe.style.toLowerCase().includes(search)
  );
};

export const searchFilterUsers = (users: UserProfile[], q: string) => {
  const columns = users[0] && Object.keys(users[0]);

  return users.filter((row) =>
    columns.some(
      (column) =>
        row[column as keyof UserProfile].toString().toLowerCase().indexOf(q) >
        -1
    )
  );
};
