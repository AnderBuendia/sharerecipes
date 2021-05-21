const RecipesList = ({ children }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer mt-2">
      {children}
    </div>
  );
};

export default RecipesList;
