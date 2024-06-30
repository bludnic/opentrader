/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */
import { PrismaClient } from "@prisma/client";
import { calcGridLines } from "@opentrader/tools";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      email: "onboarding@opentrader.pro",
      password: "onboarding",
      displayName: "Open Trader",
      role: "Admin",
    },
  });
  console.log(
    `👤 Created user "${user.email}" with password "${user.password}"`,
  );

  const exchangeAccount = await prisma.exchangeAccount.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: "OKX Demo Account",
      exchangeCode: "OKX",
      apiKey: "YOUR_EXCHANGE_API_KEY",
      secretKey: "YOUR_EXCHANGE_API_SECRET_KEY",
      password: "YOU_EXCHANGE_API_PASSPHRASE",
      isDemoAccount: true,
      label: "DEFAULT",
      owner: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  console.log(
    `🏦 Created ${exchangeAccount.exchangeCode} exchange account "${exchangeAccount.name}"`,
  );

  const gridLines = calcGridLines(30000, 25000, 5, 0.001);
  const gridBot = await prisma.bot.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: "BTC/USDT Long Bot",
      baseCurrency: "BTC",
      quoteCurrency: "USDT",
      type: "GridBot",
      template: "gridBot",

      settings: {
        gridLines: gridLines as any,
      },

      exchangeAccount: {
        connect: {
          id: exchangeAccount.id,
        },
      },
      owner: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  console.log(`🤖 Created Grid Bot "${gridBot.name}" with gridLines:`);
  gridLines.forEach((gridLine) => {
    console.log(`  ${JSON.stringify(gridLine)}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
