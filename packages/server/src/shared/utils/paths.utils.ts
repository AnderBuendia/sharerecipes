import 'module-alias/register';
import { addAliases } from 'module-alias';

const SHARED_ROUTE = `${__dirname}/../`;

addAliases({
  '@Modules': `${SHARED_ROUTE}../modules`,
  '@Shared': SHARED_ROUTE,
});
