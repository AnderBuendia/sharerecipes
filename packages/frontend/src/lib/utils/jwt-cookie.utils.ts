import cookie from 'cookie';
import { ServerResponse } from 'http';

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || '';

export const getJwtFromCookie = (cookies?: string) => {
  if (cookies) {
    return cookie.parse(cookies)[JWT_COOKIE_NAME];
  }
};

export const setJwtCookie = (res: ServerResponse, token: string) => {
  const jwtCookie = cookie.serialize(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    path: '/',
    secure: process.env.SECURE_COOKIE !== 'false',
    sameSite: 'lax',
    maxAge: Number(process.env.COOKIE_EXPIRATION),
  });

  res.setHeader('Set-Cookie', jwtCookie);
};

export const removeJwtCookie = (res: ServerResponse) => {
  const jwtCookie = cookie.serialize(JWT_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    secure: process.env.SECURE_COOKIE !== 'false',
    sameSite: 'lax',
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', jwtCookie);
};
