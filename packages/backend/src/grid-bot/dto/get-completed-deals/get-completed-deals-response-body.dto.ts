import { CompletedDealDto } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/dto/completed-deal.dto';

export class GetCompletedDealsResponseBodyDto {
  completedDeals: CompletedDealDto[];
}
