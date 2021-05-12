export const generateQueryParams = query => {
    Object.keys(query)
		.map(key => {
			if (query[key]) return `${key}=${query[key]}`;
			else return key;
		})
		.join('&');

};