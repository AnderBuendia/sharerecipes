import 'module-alias/register';
import { addAliases } from 'module-alias';

addAliases({
  '@Routes': `${__dirname}/routes`,
  '@DB': `${__dirname}/db`,
  '@Models': `${__dirname}/models`,
  '@Middleware': `${__dirname}/middleware`,
  '@Graphql': `${__dirname}/graphql`,
  '@Interfaces': `${__dirname}/interfaces`,
  '@Enums': `${__dirname}/enums`,
  '@Utils': `${__dirname}/utils`,
});
