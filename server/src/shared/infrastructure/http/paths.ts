import 'module-alias/register';
import { addAliases } from 'module-alias';

const DIR = `${process.cwd()}/src`;

addAliases({
  '@Modules': `${DIR}/modules`,
  '@Shared': `${DIR}/shared`,
});
