export const generateQueryParams = (query) => {
  return Object.keys(query)
    .map((key) => {
      if (query[key]) return `${key}=${query[key]}`;
      else return key;
    })
    .join('&');
};
