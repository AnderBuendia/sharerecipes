import jwt from 'jsonwebtoken';
import { VerifyToken } from '@Interfaces/auth-utils.interface';
require('dotenv').config({ path: 'src/variables.env' });

export const verifyToken = ({ token, code }): string => {
  const verify = jwt.verify(token, code) as VerifyToken;

  return verify._id;
};

export const signToken = ({ _id, code, time = '1h' }): string => {
  return jwt.sign({ _id }, code, { expiresIn: time });
};
