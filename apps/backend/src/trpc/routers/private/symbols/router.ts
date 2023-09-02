import { router } from 'src/trpc/trpc';
import { authorizedProcedure } from 'src/trpc/procedures';
import { getSymbols } from './get-symbols/handler';
import { ZGetSymbolsInputSchema } from './get-symbols/schema';

export const symbolsRouter = router({
  list: authorizedProcedure.input(ZGetSymbolsInputSchema).query(getSymbols),
});
