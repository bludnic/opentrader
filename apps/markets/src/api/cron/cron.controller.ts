import { Controller, Post, Put } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';

import { FETCH_CANDLESTICKS_HISTORY_CRON_JOB_NAME } from 'src/api/cron/constants';

@Controller('cron')
@ApiTags('Cron')
export class CronController {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Post('/candlesticks-history/start')
  async startCandlesticksHistoryJob() {
    const job = this.schedulerRegistry.getCronJob(
      FETCH_CANDLESTICKS_HISTORY_CRON_JOB_NAME,
    );

    job.start();
  }

  @Put('/candlesticks-history/stop')
  async stopCandlesticksHistoryJob() {
    const job = this.schedulerRegistry.getCronJob(
      FETCH_CANDLESTICKS_HISTORY_CRON_JOB_NAME,
    );

    job.stop();
  }
}
