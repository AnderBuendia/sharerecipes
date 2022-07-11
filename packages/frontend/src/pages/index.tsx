import type { NextPage, GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { withAuthGSSP } from '@Lib/hof/gssp.hof';
import { useRecipe } from '@Services/recipe.service';
import { useRecipeStorage } from '@Services/storage.service';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipesNav from '@Components/Recipes/RecipesNav';
import SkeletonRecipeCard from '@Components/Recipes/SkeletonRecipeCard';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const RecipesListDynamic = dynamic(
  () => import('@Components/Recipes/RecipesList')
);

const IndexPage: NextPage = () => {
  const { sortRecipes } = useRecipeStorage();
  const { findRecipes } = useRecipe();
  const { data, loading, fetchMore } = findRecipes({
    sort: sortRecipes,
    offset: 0,
    limit: 20,
  });

  if (loading) {
    return (
      <div className="container mx-auto w-11/12 mt-16">
        <SkeletonRecipeCard />
        <SkeletonRecipeCard />
      </div>
    );
  }

  const recipes = data ? data.find_recipes : null;

  return (
    <MainLayout
      title="Home"
      description="Share your own recipes"
      url={MainPaths.INDEX}
    >
      <RecipesNav />
      <RecipesListDynamic recipes={recipes} fetchMore={fetchMore} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthGSSP();

export default IndexPage;
