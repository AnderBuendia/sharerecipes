import cookie from 'cookie';

export const getJwtFromCookie = (cookies) => {
    if (cookies) {
        return cookie.parse(cookies)[process.env.JWT_COOKIE_NAME];
    }
}

export const setJwtCookie = (res, token) => {
	const jwtCookie = cookie.serialize(process.env.JWT_COOKIE_NAME, token, {
		httpOnly: true,
		path: '/',
		secure: process.env.SECURE_COOKIE !== 'false',
		sameSite: 'lax',
		maxAge: Number(process.env.COOKIE_EXPIRATION),
	});

	res.setHeader('Set-Cookie', jwtCookie);
};

export const removeJwtCookie = (res) => {
	const jwtCookie = cookie.serialize(process.env.JWT_COOKIE_NAME, '', {
		httpOnly: true,
		path: '/',
		secure: process.env.SECURE_COOKIE !== 'false',
		sameSite: 'lax',
		maxAge: 0,
	});

	res.setHeader('Set-Cookie', jwtCookie);
};
