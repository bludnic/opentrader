import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { TwitterSignalsService } from 'src/marketplace/twitter-signals/twitter-signals.service';
import { CreateTwitterSignalEventRequestBodyDto } from './dto/signal-events/create-signal-event/create-twitter-signal-event-request-body.dto';
import { CreateTwitterSignalEventResponseBodyDto } from './dto/signal-events/create-signal-event/create-twitter-signal-event-response-body.dto';
import { GetTwitterSignalEventResponseBodyDto } from './dto/signal-events/get-signal-event/get-twitter-signal-event-response-body.dto';
import { GetTwitterSignalEventsListResponseBodyDto } from './dto/signal-events/get-signal-events-list/get-twitter-signal-events-list-response-body.dto';
import { UpdateTwitterSignalEventRequestBodyDto } from './dto/signal-events/update-signal-event/update-twitter-signal-event-request-body.dto';
import { UpdateTwitterSignalEventResponseBodyDto } from './dto/signal-events/update-signal-event/update-twitter-signal-event-response-body.dto';

@Controller('marketplace/twitter/signal/events')
export class TwitterSignalEventsController {
  constructor(
    private firestoreService: FirestoreService,
    private readonly twitterSignalsService: TwitterSignalsService,
  ) {}

  @Get()
  async signalEvents(): Promise<GetTwitterSignalEventsListResponseBodyDto> {
    const signalEvents = await this.twitterSignalsService.signalEvents();

    return {
      signalEvents,
    };
  }

  @Get('/active')
  async activeSignalEvents(): Promise<GetTwitterSignalEventsListResponseBodyDto> {
    const signalEvents = await this.twitterSignalsService.activeSignalEvents();

    return {
      signalEvents,
    };
  }

  @Get('/:id')
  async signalEvent(
    @Param('id') signalEventId: string,
  ): Promise<GetTwitterSignalEventResponseBodyDto> {
    const signalEvent =
      await this.firestoreService.marketplaceTwitterSignalEvents.findOne(
        signalEventId,
      );

    return {
      signalEvent,
    };
  }

  @Post()
  async createSignalEvent(
    @Body() body: CreateTwitterSignalEventRequestBodyDto,
  ): Promise<CreateTwitterSignalEventResponseBodyDto> {
    const signalEvent =
      await this.firestoreService.marketplaceTwitterSignalEvents.create(body);

    return {
      signalEvent,
    };
  }

  @Put('/:id')
  async updateSignalEvent(
    @Param('id') signalEventId: string,
    @Body() body: UpdateTwitterSignalEventRequestBodyDto,
  ): Promise<UpdateTwitterSignalEventResponseBodyDto> {
    const signalEvent =
      await this.firestoreService.marketplaceTwitterSignalEvents.update(
        body,
        signalEventId,
      );

    return {
      signalEvent,
    };
  }
}
