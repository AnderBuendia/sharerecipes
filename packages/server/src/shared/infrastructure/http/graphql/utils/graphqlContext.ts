import { ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { TOKEN_CODE } from '@Shared/utils/constants';
import type { ApolloContext } from '@Shared/infrastructure/http/graphql/interfaces/apollo.interface';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export function handleApolloContext(ctx: ApolloContext) {
  const { req, res } = ctx;

  const authorization = req.headers['authorization'];
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  req.url = url;

  if (authorization) {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, TOKEN_CODE, function (err, decoded) {
      if (err) {
        return new ApolloError(
          UserErrors.LINK_EXPIRED,
          HTTPStatusCodes.NOT_AUTHORIZED
        );
      }

      return decoded;
    });

    req['user'] = payload;
  }

  return { req, res };
}
