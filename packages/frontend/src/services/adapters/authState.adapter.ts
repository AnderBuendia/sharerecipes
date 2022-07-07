import { EndpointAuth } from '@Interfaces/ports/endpoint/endpoint-auth-state.interface';

export const createAdaptedAuthState = (resAuthState: EndpointAuth) => {
  const { user, jwt } = resAuthState;
  const formattedAuthState = {
    user,
    jwt,
  };

  return formattedAuthState;
};
