import { RedirectConditions } from '@Enums/redirect-conditions';

export interface IRedirect {
  href: string;
  statusCode: number;
  asPath?: string;
  condition?: RedirectConditions;
  query?: Record<string, string>;
}
