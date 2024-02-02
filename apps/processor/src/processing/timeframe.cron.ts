import { BotProcessing } from "#processing/bot";
import { xprisma } from "@opentrader/db/dist";
import type { ScheduledTask } from "node-cron";
import { schedule } from "node-cron";

type Timeframe = "1m" | "5m" | "10m" | "15m" | "30m" | "1h" | "4h" | "1d";

const CronExpression: Record<Timeframe, string> = {
  "1m": "20 * * * * *",
  "5m": "20 */5 * * * *",
  "10m": "20 */10 * * * *",
  "15m": "20 */15 * * * *",
  "30m": "20 */30 * * * *",
  "1h": "20 0 * * * *",
  "4h": "20 0 */4 * * *",
  "1d": "20 0 0 * * *",
};

export class TimeframeCron {
  tasks: ScheduledTask[] = [];

  create() {
    for (const [timeframe, cronExpression] of Object.entries(CronExpression)) {
      this.tasks.push(
        schedule(cronExpression, async () => {
          await this.execTemplate(timeframe as Timeframe);
        }),
      );
    }
  }

  destroy() {
    for (const task of this.tasks) {
      task.stop();
    }
  }

  async execTemplate(timeframe: Timeframe) {
    const bots = await xprisma.bot.findMany({
      where: {
        timeframe,
        enabled: true,
      },
    });
    console.log(`TimeframeCron: ${timeframe}. Found ${bots.length} bots`);

    for (const bot of bots) {
      console.log(`Exec bot #${bot.id} template`);
      const botProcessor = await BotProcessing.fromId(bot.id);

      if (botProcessor.isBotStopped()) {
        console.error("❗ Cannot run bot process when the bot is disabled");
        continue;
      }

      await botProcessor.process();
      await botProcessor.placePendingOrders();

      console.log(`Exec bot #${bot.id} template done`);
    }
  }
}
