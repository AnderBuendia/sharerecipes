export const setUrlName = ({
  url,
  sameRecipes,
}: {
  url: string;
  sameRecipes: number;
}): string => {
  const newUrl = url.replace(' ', '-').toLowerCase();

  if (sameRecipes > 0) return `${newUrl}-${sameRecipes}`;

  return newUrl;
};
