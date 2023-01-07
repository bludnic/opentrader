import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { GetTwitterSignalEventsListResponseBodyDto } from 'src/marketplace/twitter-signals/dto/signal-events/get-signal-events-list/get-twitter-signal-events-list-response-body.dto';
import { CreateTwitterSignalRequestBodyDto } from './dto/signals/create-signal/create-twitter-signal-request-body.dto';
import { CreateTwitterSignalResponseBodyDto } from './dto/signals/create-signal/create-twitter-signal-response-body.dto';
import { GetTwitterSignalResponseBodyDto } from './dto/signals/get-signal/get-twitter-signal-response-body.dto';
import { GetTwitterSignalsListResponseBodyDto } from './dto/signals/get-signals-list/get-twitter-signals-list-response-body.dto';
import { UpdateTwitterSignalRequestBodyDto } from './dto/signals/update-signal/update-twitter-signal-request-body.dto';
import { UpdateTwitterSignalResponseBodyDto } from './dto/signals/update-signal/update-twitter-signal-response-body.dto';

@Controller('marketplace/twitter/signals')
export class TwitterSignalsController {
  constructor(private firestoreService: FirestoreService) {}

  @Get()
  async signals(): Promise<GetTwitterSignalsListResponseBodyDto> {
    const signals =
      await this.firestoreService.marketplaceTwitterSignals.findAll();

    return {
      signals,
    };
  }

  @Get('/:signalId/events')
  async specificSignalEvents(
    @Param('signalId') signalId: string,
  ): Promise<GetTwitterSignalEventsListResponseBodyDto> {
    const signalEvents =
      await this.firestoreService.marketplaceTwitterSignalEvents.findBySignalId(
        signalId,
      );

    return {
      signalEvents,
    };
  }

  @Get('/:id')
  async signal(
    @Param('id') signalId: string,
  ): Promise<GetTwitterSignalResponseBodyDto> {
    const signal =
      await this.firestoreService.marketplaceTwitterSignals.findOne(signalId);

    return {
      signal,
    };
  }

  @Post()
  async createSignal(
    @Body() body: CreateTwitterSignalRequestBodyDto,
  ): Promise<CreateTwitterSignalResponseBodyDto> {
    const signal = await this.firestoreService.marketplaceTwitterSignals.create(
      body,
    );

    return {
      signal,
    };
  }

  @Put('/:id')
  async updateSignal(
    @Param('id') signalId: string,
    @Body() body: UpdateTwitterSignalRequestBodyDto,
  ): Promise<UpdateTwitterSignalResponseBodyDto> {
    const signal = await this.firestoreService.marketplaceTwitterSignals.update(
      body,
      signalId,
    );

    return {
      signal,
    };
  }
}
