import { HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { X_EXCHANGE_ACCOUNT_ID_HEADER_KEY } from 'src/common/middlewares/exchange-account.middleware';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IGetLimitOrderRequest } from 'src/core/exchanges/okx/types/exchange/trade/get-limit-order/get-limit-order-request.interface';
import { IGetLimitOrderResponse } from 'src/core/exchanges/okx/types/exchange/trade/get-limit-order/get-limit-order-response.interface';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { okxExchangeAccountDocumentId } from 'src/core/exchanges/utils/contexts/okx';
import { DefaultExchangeServiceFactorySymbol } from 'src/core/exchanges/utils/default-exchange.factory';
import { gridBotSettings } from 'src/e2e/grid-bot/bot-settings';
import { gridBotE2EHistoryData } from 'src/e2e/grid-bot/history-data';
import { GridBotE2EHistoryData } from 'src/e2e/grid-bot/types';
import { mapDealToE2EDeal } from 'src/e2e/grid-bot/utils/mappers/map-deal-to-e2e-deal';
import { mapE2ELimitOrderToLimitOrder } from 'src/e2e/grid-bot/utils/mappers/map-e2e-limit-order-to-limit-order';

import { CreateBotResponseBodyDto } from 'src/grid-bot/dto/create-bot/create-bot-response-body.dto';
import { StartBotRequestDto } from 'src/grid-bot/dto/start-bot/start-bot-request-body.dto';
import { SyncBotQueryParamsDto } from 'src/grid-bot/dto/sync-bot/sync-bot-query-params.dto';
import {
  GridBotServiceFactory,
  GridBotServiceFactorySymbol,
} from 'src/grid-bot/grid-bot-service.factory';
import { GridBotService } from 'src/grid-bot/grid-bot.service';
import { IGridBotSettings } from 'src/grid-bot/types/grid-bot-settings.interface';
import * as request from 'supertest';

function* e2eDataGenerator(): Generator<GridBotE2EHistoryData> {
  for (const day of gridBotE2EHistoryData) {
    yield day;
  }

  // Always return history data for the last day if there are no more days left
  while (true) {
    yield gridBotE2EHistoryData[gridBotE2EHistoryData.length - 1];
  }
}

const exchangeAccountHeader = () => ({
  [X_EXCHANGE_ACCOUNT_ID_HEADER_KEY]: okxExchangeAccountDocumentId,
});

describe('AppController', () => {
  let app: INestApplication;
  let e2eDataGen = e2eDataGenerator();
  let e2eData: { current: GridBotE2EHistoryData } = {
    current: e2eDataGen.next().value,
  };

  let firestoreService: FirestoreService;

  let exchangeService: Partial<IExchangeService> = {
    getMarketPrice: async ({ symbol }) => {
      return {
        symbol,
        price: e2eData.current.price,
        timestamp: 0,
      };
    },
    placeLimitOrder: async (request) => {
      return {
        orderId: `mock_${request.clientOrderId}`, // maybe use uuid
        clientOrderId: request.clientOrderId,
      };
    },
    getLimitOrder: async (
      params: IGetLimitOrderRequest,
    ): Promise<IGetLimitOrderResponse> => {
      const limitOrder = e2eData.current.limitOrders.find(
        (order) => order.clientOrderId === params.clientOrderId,
      );

      return mapE2ELimitOrderToLimitOrder(limitOrder, e2eData.current.price);
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DefaultExchangeServiceFactorySymbol)
      .useValue(exchangeService)
      .overrideProvider(GridBotServiceFactorySymbol)
      .useFactory({
        factory: (
          httpService: HttpService,
          configService: ConfigService,
          firestoreService: FirestoreService,
        ): GridBotServiceFactory => {
          return {
            create: () => {
              return new GridBotService(
                exchangeService as IExchangeService, // I know what I am doing
                firestoreService,
              );
            },
            fromExchangeAccount: () => {
              return new GridBotService(
                exchangeService as IExchangeService, // I know what I am doing
                firestoreService,
              );
            },
          };
        },
        inject: [HttpService, ConfigService, FirestoreService],
      })
      .compile();

    app = moduleRef.createNestApplication();

    // this service is used as a helper to retrieve the deals from Firestore
    // and compare them with expected result
    firestoreService = moduleRef.get<FirestoreService>(FirestoreService);

    e2eDataGen = e2eDataGenerator();
    e2eData.current = e2eDataGen.next().value;

    await app.init();
  });

  describe('Create and start bot', () => {
    it(`/POST grid-bot/create`, async () => {
      const requestBody: IGridBotSettings = gridBotSettings;
      const expectedResponse: CreateBotResponseBodyDto = {
        bot: {
          id: gridBotSettings.id,
          name: gridBotSettings.name,
          account: gridBotSettings.account,
          baseCurrency: gridBotSettings.baseCurrency,
          quoteCurrency: gridBotSettings.quoteCurrency,
          gridLevels: gridBotSettings.gridLevels,
          lowPrice: gridBotSettings.lowPrice,
          highPrice: gridBotSettings.highPrice,
          quantityPerGrid: gridBotSettings.quantityPerGrid,

          enabled: false,
          deals: [],
          createdAt: 0, // can't know the exact value
        },
      };
      delete expectedResponse.bot.createdAt;

      await request(app.getHttpServer())
        .post('/grid-bot/create')
        .set(exchangeAccountHeader())
        .send(requestBody)
        .expect(201)
        .expect((res) => {
          const body: CreateBotResponseBodyDto = res.body;

          expect(body).toMatchObject(expectedResponse);
        });
    });

    it('/PUT grid-bot/start', async () => {
      const requestBody: StartBotRequestDto = {
        botId: gridBotSettings.id,
      };

      await request(app.getHttpServer())
        .put('/grid-bot/start')
        .set(exchangeAccountHeader())
        .send(requestBody)
        .expect(200);

      const { deals } = await firestoreService.getBot({
        id: gridBotSettings.id,
      });
      const dealsSimplified = deals.map((deal) => mapDealToE2EDeal(deal));

      expect(dealsSimplified).toStrictEqual(e2eData.current.deals.reverse());
    });

    describe('/PATH grid-bot/sync', () => {
      const queryParams: SyncBotQueryParamsDto = {
        botId: gridBotSettings.id,
      };

      beforeAll(() => {
        e2eDataGen = e2eDataGenerator();
      });

      beforeEach(() => {
        e2eData.current = e2eDataGen.next().value;
      });

      // данные за первый исторический день (`i = 0`) предназначены для бота в момент старта `GET /grid-bot/start`,
      // поэтому начинаем синк с `i = 1`
      for (let i = 1; i < gridBotE2EHistoryData.length - 1; i++) {
        // `e2eData.time` возвращает всегда одно и тоже время (первый элемент), хз почему.
        // вытаскиваю напрямую из массива, вот такой воркароунд
        it(`Day #${i + 1}: ${gridBotE2EHistoryData[i].time}`, async () => {
          await request(app.getHttpServer())
            .patch('/grid-bot/sync')
            .set(exchangeAccountHeader())
            .query(queryParams)
            .expect(200)
            .send();

          const { deals } = await firestoreService.getBot({
            id: gridBotSettings.id,
          });
          const dealsSimplified = deals.map((deal) => mapDealToE2EDeal(deal));
          const dealsSimplifiedSorted = [...dealsSimplified].sort((a, b) =>
            a.id > b.id ? 1 : -1,
          );
          const e2eDealsSorted = [...e2eData.current.deals].sort((a, b) =>
            a.id > b.id ? 1 : -1,
          );

          expect(dealsSimplifiedSorted).toEqual(e2eDealsSorted);
        });
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
