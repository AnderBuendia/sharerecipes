export const setUrlQueryName = ({
  name,
  numberOfRecipes,
}: {
  name: string;
  numberOfRecipes: number;
}): string => {
  const urlQuery = name.replace(' ', '-').toLowerCase();

  if (numberOfRecipes > 0) {
    const repeatedUrlQuery = `${urlQuery}-${numberOfRecipes}`;
    return repeatedUrlQuery;
  }

  return urlQuery;
};

export const calculateAverageVotes = ({
  votes,
  numberOfVotes,
}: {
  votes: number;
  numberOfVotes: number;
}) => {
  const averageVotes = votes / numberOfVotes;

  return (Math.ceil(averageVotes) + Math.floor(averageVotes)) / 2;
};
