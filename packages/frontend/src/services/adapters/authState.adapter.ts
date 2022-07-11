import { EndpointAuth } from '@Interfaces/ports/endpoint/endpoint-auth-state.interface';

export const createAdaptedAuthState = (resAuthState: EndpointAuth) => {
  const { user, token } = resAuthState;

  console.log('=> JWT', resAuthState);
  const formattedAuthState = {
    user,
    jwt: token,
  };

  return formattedAuthState;
};
