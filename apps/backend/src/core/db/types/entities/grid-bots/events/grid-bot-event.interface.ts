import { GridBotEventCodeEnum } from 'src/core/db/types/common/enums/grid-bot-event-code.enum';

export interface IGridBotEvent {
  id: string;
  eventCode: GridBotEventCodeEnum;
  message: string;
  createdAt: number;
  data: object | null; // additional context

  botId: string;
}
