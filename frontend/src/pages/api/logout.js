import { HTTPStatusCodes } from '../../enums/config/http-status-codes';
import { removeJwtCookie } from '../../lib/utils/jwt-cookie.utils';

const logout = (req, res) => {
  if (req.method !== 'POST') {
    res.status(HTTPStatusCodes.METHOD_NOT_ALLOWED).send(false);
    return;
  }

  removeJwtCookie(res);
  res.status(HTTPStatusCodes.OK).send(true);
};

export default logout;
