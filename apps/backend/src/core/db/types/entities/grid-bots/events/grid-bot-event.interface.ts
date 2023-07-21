import { GridBotEventCodeEnum } from '@bifrost/types';

export interface IGridBotEvent {
  id: string;
  eventCode: GridBotEventCodeEnum;
  message: string;
  createdAt: number;
  data: object | null; // additional context

  botId: string;
}
