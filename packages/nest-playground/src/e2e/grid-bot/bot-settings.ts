import { IGridBotSettings } from 'src/grid-bot/types/grid-bot-settings.interface';

export const gridBotSettings: IGridBotSettings = {
    id: 'E2DDOTBUSD',
    name: '[DOT/BUSD] E2E Testing',
    account: "'/accounts/okx_account'",
    baseCurrency: 'DOT',
    quoteCurrency: 'BUSD',
    gridLevels: 11,
    lowPrice: 10,
    highPrice: 20,
    quantityPerGrid: 5,
};