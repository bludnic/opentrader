import { CreateBotRequestBodyDto } from "src/lib/bifrost/client";

export type CreateBotFormValues = Omit<
  CreateBotRequestBodyDto,
  "exchangeAccountId" | "gridLines"
> & {
  highPrice: number;
  lowPrice: number;
  quantityPerGrid: number;
  gridLevels: number;
}
