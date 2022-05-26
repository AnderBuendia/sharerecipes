import jwt from 'jsonwebtoken';

export interface VerifyToken {
  _id: string;
  iat: number;
  exp: number;
}

export const verifyToken = ({ token, code }): string => {
  const verify = jwt.verify(token, code) as VerifyToken;

  return verify._id;
};

export const signToken = ({ _id, code, time = '1h' }): string => {
  return jwt.sign({ _id }, code, { expiresIn: time });
};
