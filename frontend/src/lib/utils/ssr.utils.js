import { loadCurrentUserSSR } from './user.utils';
import { generateQueryParams } from './url.utils';
import { removeJwtCookie } from './jwt-cookie.utils';

export const isRequestSSR = (currentUrl) => {
	if (!currentUrl) return true;
	const extension = currentUrl.split('?').shift()?.split('.').pop();
	return !extension || extension !== 'json';
};

export const serverRedirect = (res, redirect) => {
    const { href, statusCode, query } = redirect;

    let queryString;

    if (query) queryString = generateQueryParams(query);
    const url = queryString ? `${href}?${queryString}` : href;

    res.setHeader('Location', url);
    res.statusCode = statusCode;
    res.end;
}

export const loadAuthProps = async (res, jwt, apolloClient) => {
    try {
        return await loadCurrentUserSSR(jwt, apolloClient);
    } catch (error) {
        removeJwtCookie(res);
    }
}