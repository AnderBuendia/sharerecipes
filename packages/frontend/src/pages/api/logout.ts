import { NextApiRequest, NextApiResponse } from 'next';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { removeJwtCookie } from '@Lib/utils/jwt-cookie.utils';

const logout = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(HTTPStatusCodes.METHOD_NOT_ALLOWED).send(false);
    return;
  }

  removeJwtCookie(res);
  res.status(HTTPStatusCodes.OK).send(true);
};

export default logout;
